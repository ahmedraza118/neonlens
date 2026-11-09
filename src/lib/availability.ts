import 'server-only'

import { getPayloadClient } from './payload'
import { getAvailability } from './queries'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** Calendar day in Bucharest (the studio's time zone), e.g. a date picked in the admin at local midnight. */
const bucharestDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest', year: 'numeric', month: '2-digit', day: '2-digit' })

export function toISODate(d: Date | string): string {
  return bucharestDay.format(new Date(d))
}

/** How long an unpaid checkout holds its date (matches the Stripe session expiry in actions/booking.ts). */
export const CHECKOUT_HOLD_MINUTES = 60

/** A real calendar day: JavaScript would otherwise read 2027-02-31 as 3 March. */
export function isRealDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false
  const parsed = new Date(`${iso}T12:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === iso
}

export type AvailabilityRules = {
  blockedDates: string[]
  blockedWeekdays: number[]
  minDate: string
  maxDate: string
}

/** Everything the booking calendar needs to grey out dates. */
export async function getAvailabilityRules(): Promise<AvailabilityRules> {
  const [availability, payload] = await Promise.all([getAvailability(), getPayloadClient()])
  // Paid bookings, plus checkouts still in progress (so two clients cannot pay for the same day).
  const holdSince = new Date(Date.now() - CHECKOUT_HOLD_MINUTES * 60 * 1000).toISOString()
  const paid = await payload.find({
    collection: 'bookings',
    where: {
      or: [{ status: { in: ['paid', 'completed'] } }, { and: [{ status: { equals: 'pending' } }, { createdAt: { greater_than: holdSince } }] }],
    },
    limit: 2000,
    depth: 0,
    select: { date: true },
  })

  const blocked = new Set<string>([
    ...(availability.blockedDates ?? []).map((b) => toISODate(b.date)),
    ...paid.docs.map((b) => toISODate(b.date)),
  ])

  const today = new Date()
  const min = new Date(today)
  min.setUTCDate(min.getUTCDate() + (availability.minNoticeDays ?? 7))
  const max = new Date(today)
  max.setUTCDate(max.getUTCDate() + (availability.bookingWindowDays ?? 540))

  return {
    blockedDates: [...blocked].sort(),
    blockedWeekdays: (availability.blockedWeekdays ?? []).map((d) => WEEKDAYS.indexOf(d)),
    minDate: toISODate(min),
    maxDate: toISODate(max),
  }
}

export function isDateBookable(rules: AvailabilityRules, iso: string): boolean {
  if (!isRealDate(iso)) return false
  if (iso < rules.minDate || iso > rules.maxDate) return false
  if (rules.blockedDates.includes(iso)) return false
  return !rules.blockedWeekdays.includes(new Date(`${iso}T12:00:00Z`).getUTCDay())
}

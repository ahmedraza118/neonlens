import 'server-only'

import { getPayloadClient } from './payload'
import { getAvailability } from './queries'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function toISODate(d: Date | string): string {
  return new Date(d).toISOString().slice(0, 10)
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
  const paid = await payload.find({
    collection: 'bookings',
    where: { status: { in: ['paid', 'completed'] } },
    limit: 1000,
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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false
  if (iso < rules.minDate || iso > rules.maxDate) return false
  if (rules.blockedDates.includes(iso)) return false
  return !rules.blockedWeekdays.includes(new Date(`${iso}T12:00:00Z`).getUTCDay())
}

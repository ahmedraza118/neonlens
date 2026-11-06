import 'server-only'

import { createHmac, timingSafeEqual } from 'crypto'

import { fmt, toLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

import { notifyStudio, rowsToHtml, sendEmail } from './notify'
import { getPayloadClient } from './payload'
import { toISODate } from './availability'
import { getSettings } from './queries'
import { getStripe } from './stripe'
import { formatDate, formatMoney } from './utils'

const signRelease = (id: string) => createHmac('sha256', process.env.PAYLOAD_SECRET || 'dev-secret').update(`release:${id}`).digest('base64url').slice(0, 22)

/** Token in Stripe's cancel URL that lets the client release their own unpaid date hold. */
export function releaseToken(bookingId: number | string): string {
  return `${bookingId}.${signRelease(String(bookingId))}`
}

/**
 * Called when a client comes back from Stripe with "cancel": frees the date (pending → cancelled)
 * and expires the Stripe session so it can no longer be paid. Ignores invalid tokens.
 */
export async function releasePendingBooking(token: string | undefined) {
  const [id, sig] = (token ?? '').split('.')
  if (!id || !sig) return
  const expected = Buffer.from(signRelease(id))
  const given = Buffer.from(sig)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return
  const payload = await getPayloadClient()
  const result = await payload.update({
    collection: 'bookings',
    where: { and: [{ id: { equals: id } }, { status: { equals: 'pending' } }] },
    data: { status: 'cancelled' },
  })
  const sessionId = result.docs[0]?.stripeSessionId
  if (sessionId) await getStripe()?.checkout.sessions.expire(sessionId).catch(() => undefined)
}

/**
 * Marks a booking as paid exactly once and sends confirmations. Safe to call repeatedly and
 * concurrently (the Stripe webhook and the success page both call it): the update only applies
 * while the booking is still pending, and only the call that changed it sends emails.
 */
export async function markBookingPaid(bookingId: number | string, sessionId: string) {
  const payload = await getPayloadClient()
  const booking = await payload.findByID({ collection: 'bookings', id: bookingId, depth: 0 }).catch(() => null)
  if (!booking || booking.stripeSessionId !== sessionId) return booking
  if (booking.status === 'paid' || booking.status === 'completed') return booking

  const result = await payload.update({
    collection: 'bookings',
    where: { and: [{ id: { equals: booking.id } }, { status: { not_in: ['paid', 'completed'] } }] },
    data: { status: 'paid', paidAt: new Date().toISOString() },
  })
  const updated = result.docs[0]
  if (!updated) return payload.findByID({ collection: 'bookings', id: booking.id, depth: 0 })

  // Another paid booking on the same day (e.g. a hold expired mid-checkout): alert the studio at once.
  const day = toISODate(booking.date)
  const others = await payload.find({
    collection: 'bookings',
    where: { and: [{ id: { not_equals: booking.id } }, { status: { in: ['paid', 'completed'] } }] },
    limit: 2000,
    depth: 0,
    select: { date: true, name: true },
  })
  const clash = others.docs.find((b) => toISODate(b.date) === day)
  if (clash) {
    await notifyStudio(`⚠️ DOUBLE BOOKING on ${day}: ${booking.name} and ${clash.name}`, [
      ['Date', day],
      ['New booking', `#${booking.id} ${booking.name} (${booking.email})`],
      ['Existing booking', `#${clash.id} ${clash.name}`],
      ['Action', 'Contact the new client today and refund the deposit in Stripe if needed.'],
    ])
  }

  const lang = toLocale(booking.locale)
  const t = getDictionary(lang)
  const settings = await getSettings(lang)
  const currency = booking.currency ?? settings.currency
  const rows: Array<[string, string]> = [
    ['Service', `${booking.serviceTitle} — ${booking.packageName}`],
    ['Date', formatDate(booking.date)],
    ['Deposit paid', formatMoney(booking.depositAmount, currency)],
    ['Balance', formatMoney(booking.packagePrice - booking.depositAmount, currency)],
  ]
  const r = t.actions.rows
  const clientRows: Array<[string, string]> = [
    [r.service, `${booking.serviceTitle} — ${booking.packageName}`],
    [r.date, formatDate(booking.date, lang)],
    [r.depositPaid, formatMoney(booking.depositAmount, currency, lang)],
    [r.balance, formatMoney(booking.packagePrice - booking.depositAmount, currency, lang)],
  ]
  await Promise.allSettled([
    notifyStudio(`💸 Deposit paid: ${booking.name}`, [...rows, ['Email', booking.email], ['Phone', booking.phone ?? '']], booking.email),
    sendEmail({
      to: booking.email,
      subject: fmt(t.actions.bookedSubject, { date: formatDate(booking.date, lang), name: settings.businessName }),
      replyTo: settings.email,
      html: `<p style="font-family:sans-serif">${fmt(t.actions.bookedHi, { name: booking.name.split(' ')[0].replace(/[<>&]/g, '') })}</p>${rowsToHtml(t.actions.bookedTitle, clientRows)}<p style="font-family:sans-serif">${t.actions.bookedNext}<br>${settings.businessName} · ${settings.phone}</p>`,
    }),
  ])
  return updated
}

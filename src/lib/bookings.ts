import 'server-only'

import { fmt, toLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

import { notifyStudio, rowsToHtml, sendEmail } from './notify'
import { getPayloadClient } from './payload'
import { getSettings } from './queries'
import { formatDate, formatMoney } from './utils'

/** Marks a booking as paid exactly once and sends confirmations. Safe to call repeatedly. */
export async function markBookingPaid(bookingId: number | string, sessionId: string) {
  const payload = await getPayloadClient()
  const booking = await payload.findByID({ collection: 'bookings', id: bookingId, depth: 0 }).catch(() => null)
  if (!booking || booking.status === 'paid' || booking.stripeSessionId !== sessionId) return booking

  const updated = await payload.update({
    collection: 'bookings',
    id: booking.id,
    data: { status: 'paid', paidAt: new Date().toISOString() },
  })

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

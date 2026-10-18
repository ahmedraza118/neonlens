import 'server-only'

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

  const settings = await getSettings()
  const rows: Array<[string, string]> = [
    ['Service', `${booking.serviceTitle} — ${booking.packageName}`],
    ['Date', formatDate(booking.date)],
    ['Deposit paid', formatMoney(booking.depositAmount, booking.currency ?? settings.currency)],
    ['Balance', formatMoney(booking.packagePrice - booking.depositAmount, booking.currency ?? settings.currency)],
  ]
  await Promise.allSettled([
    notifyStudio(`💸 Deposit paid: ${booking.name}`, [...rows, ['Email', booking.email], ['Phone', booking.phone ?? '']], booking.email),
    sendEmail({
      to: booking.email,
      subject: `You're booked! ${formatDate(booking.date)} with ${settings.businessName}`,
      replyTo: settings.email,
      html: `<p style="font-family:sans-serif">Hi ${booking.name.split(' ')[0].replace(/[<>&]/g, '')}, your date is officially reserved 🎉</p>${rowsToHtml('Booking confirmation', rows)}<p style="font-family:sans-serif">We'll be in touch within 48 hours to plan the details.<br>${settings.businessName} · ${settings.phone}</p>`,
    }),
  ])
  return updated
}

'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { fmt, toLocale, withLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getAvailabilityRules, isDateBookable } from '@/lib/availability'
import { notifyStudio } from '@/lib/notify'
import { getPayloadClient } from '@/lib/payload'
import { getPricing, getService, getSettings } from '@/lib/queries'
import { depositFor } from '@/lib/quote'
import { getStripe, toStripeAmount } from '@/lib/stripe'
import { absoluteUrl, formatDate, formatMoney } from '@/lib/utils'

export type BookingState = { message: string; errors?: Partial<Record<string, string>> }

const schemaFor = (t: ReturnType<typeof getDictionary>) => z.object({
  service: z.string().min(1, t.actions.chooseService),
  // Package row id: names differ per language, ids do not.
  packageId: z.string().min(1, t.actions.choosePackage),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t.actions.pickDate),
  name: z.string().trim().min(2, t.actions.nameShort).max(120),
  email: z.email(t.actions.emailShort),
  phone: z.string().trim().max(40).optional(),
  location: z.string().trim().max(160).optional(),
  notes: z.string().trim().max(3000).optional(),
  terms: z.literal('on', { message: t.actions.acceptTerms }),
})

export async function createBooking(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const locale = toLocale(formData.get('lang'))
  const t = getDictionary(locale)
  const raw = Object.fromEntries([...formData.entries()].filter(([k, v]) => k !== 'lang' && typeof v === 'string' && v !== ''))
  const parsed = schemaFor(t).safeParse(raw)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message
    return { message: t.actions.checkFields, errors }
  }
  const data = parsed.data

  // Never trust prices or dates from the browser — re-derive everything server-side.
  const [service, pricing, settings, rules] = await Promise.all([getService(data.service, locale), getPricing(), getSettings(locale), getAvailabilityRules()])
  const pkg = service?.packages?.find((p) => p.id === data.packageId)
  if (!service || !pkg) return { message: t.actions.packageGone, errors: { packageId: t.actions.choosePackage } }
  if (!isDateBookable(rules, data.date)) return { message: t.actions.dateTaken, errors: { date: t.actions.pickAnother } }

  const deposit = depositFor(pkg.price, pricing.depositPercent)
  const payload = await getPayloadClient()
  const booking = await payload.create({
    collection: 'bookings',
    data: {
      status: 'pending',
      locale,
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      notes: data.notes,
      date: new Date(`${data.date}T12:00:00Z`).toISOString(),
      service: service.id,
      serviceTitle: service.title,
      packageName: pkg.name,
      packagePrice: pkg.price,
      depositAmount: deposit,
      currency: settings.currency,
    },
  })

  const stripe = getStripe()
  if (!stripe || deposit <= 0) {
    // No online payments configured: we still capture the request and follow up manually.
    await notifyStudio(`Booking request (no online payment): ${data.name}`, [
      ['Service', `${service.title} — ${pkg.name}`],
      ['Date', data.date],
      ['Email', data.email],
      ['Phone', data.phone],
      ['Deposit due', formatMoney(deposit, settings.currency)],
    ], data.email)
    redirect(withLocale(`/book/success?booking=${booking.id}`, locale))
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: data.email,
    locale,
    client_reference_id: String(booking.id),
    metadata: { bookingId: String(booking.id) },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: settings.currency.toLowerCase(),
          unit_amount: toStripeAmount(deposit),
          product_data: {
            name: fmt(t.actions.depositName, { service: service.title, package: pkg.name }),
            description: fmt(t.actions.depositDescription, {
              date: formatDate(`${data.date}T12:00:00Z`, locale),
              balance: formatMoney(pkg.price - deposit, settings.currency, locale),
            }),
          },
        },
      },
    ],
    success_url: absoluteUrl(withLocale('/book/success?session_id={CHECKOUT_SESSION_ID}', locale)),
    cancel_url: absoluteUrl(withLocale(`/book?service=${service.slug}&package=${encodeURIComponent(pkg.id ?? '')}&cancelled=1`, locale)),
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60, // hold the slot for 1 hour
  })

  await payload.update({ collection: 'bookings', id: booking.id, data: { stripeSessionId: session.id } })
  redirect(session.url!)
}

'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { getAvailabilityRules, isDateBookable } from '@/lib/availability'
import { notifyStudio } from '@/lib/notify'
import { getPayloadClient } from '@/lib/payload'
import { getPricing, getService, getSettings } from '@/lib/queries'
import { depositFor } from '@/lib/quote'
import { getStripe, toStripeAmount } from '@/lib/stripe'
import { absoluteUrl, formatMoney } from '@/lib/utils'

export type BookingState = { message: string; errors?: Partial<Record<string, string>> }

const schema = z.object({
  service: z.string().min(1, 'Choose a service'),
  packageName: z.string().min(1, 'Choose a package'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date'),
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z.email('Enter a valid email'),
  phone: z.string().trim().max(40).optional(),
  location: z.string().trim().max(160).optional(),
  notes: z.string().trim().max(3000).optional(),
  terms: z.literal('on', { message: 'Please accept the booking terms' }),
})

export async function createBooking(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const raw = Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === 'string' && v !== ''))
  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message
    return { message: 'Please check the highlighted fields.', errors }
  }
  const data = parsed.data

  // Never trust prices or dates from the browser — re-derive everything server-side.
  const [service, pricing, settings, rules] = await Promise.all([getService(data.service), getPricing(), getSettings(), getAvailabilityRules()])
  const pkg = service?.packages?.find((p) => p.name === data.packageName)
  if (!service || !pkg) return { message: 'That package is no longer available.', errors: { packageName: 'Choose a package' } }
  if (!isDateBookable(rules, data.date)) return { message: 'Sorry, that date was just taken.', errors: { date: 'Pick another date' } }

  const deposit = depositFor(pkg.price, pricing.depositPercent)
  const payload = await getPayloadClient()
  const booking = await payload.create({
    collection: 'bookings',
    data: {
      status: 'pending',
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
    redirect(`/book/success?booking=${booking.id}`)
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: data.email,
    client_reference_id: String(booking.id),
    metadata: { bookingId: String(booking.id) },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: settings.currency.toLowerCase(),
          unit_amount: toStripeAmount(deposit),
          product_data: {
            name: `Deposit — ${service.title}: ${pkg.name}`,
            description: `Reserves ${data.date}. Remaining ${formatMoney(pkg.price - deposit, settings.currency)} due before the shoot.`,
          },
        },
      },
    ],
    success_url: absoluteUrl('/book/success?session_id={CHECKOUT_SESSION_ID}'),
    cancel_url: absoluteUrl(`/book?service=${service.slug}&package=${encodeURIComponent(pkg.name)}&cancelled=1`),
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60, // hold the slot for 1 hour
  })

  await payload.update({ collection: 'bookings', id: booking.id, data: { stripeSessionId: session.id } })
  redirect(session.url!)
}

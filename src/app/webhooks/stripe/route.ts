import type Stripe from 'stripe'

import { markBookingPaid } from '@/lib/bookings'
import { getPayloadClient } from '@/lib/payload'
import { getStripe } from '@/lib/stripe'

/**
 * Stripe → Developers → Webhooks → add endpoint https://yourdomain.com/webhooks/stripe
 * with events checkout.session.completed, checkout.session.expired,
 * checkout.session.async_payment_succeeded and checkout.session.async_payment_failed.
 */
export async function POST(req: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) return new Response('Stripe not configured', { status: 501 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(await req.text(), req.headers.get('stripe-signature') ?? '', secret)
  } catch (err) {
    console.warn('[stripe] webhook signature check failed', (err as Error).message)
    return new Response('Invalid signature', { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const bookingId = session.metadata?.bookingId
  if (!bookingId) return Response.json({ received: true })

  // "completed" may still be unpaid for delayed methods (bank transfer); those report later via async_payment_*.
  const paid =
    (event.type === 'checkout.session.completed' && session.payment_status === 'paid') ||
    event.type === 'checkout.session.async_payment_succeeded'
  if (paid) {
    await markBookingPaid(bookingId, session.id)
  } else if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
    const payload = await getPayloadClient()
    const booking = await payload.findByID({ collection: 'bookings', id: bookingId }).catch(() => null)
    if (booking?.status === 'pending') {
      await payload.update({ collection: 'bookings', id: booking.id, data: { status: 'cancelled' } })
    }
  }
  return Response.json({ received: true })
}

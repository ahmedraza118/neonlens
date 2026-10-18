import type Stripe from 'stripe'

import { markBookingPaid } from '@/lib/bookings'
import { getPayloadClient } from '@/lib/payload'
import { getStripe } from '@/lib/stripe'

/**
 * Stripe → Developers → Webhooks → add endpoint https://yourdomain.com/webhooks/stripe
 * with events checkout.session.completed and checkout.session.expired.
 */
export async function POST(req: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) return new Response('Stripe not configured', { status: 501 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(await req.text(), req.headers.get('stripe-signature') ?? '', secret)
  } catch (err) {
    return new Response(`Invalid signature: ${(err as Error).message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const bookingId = session.metadata?.bookingId
  if (!bookingId) return Response.json({ received: true })

  if (event.type === 'checkout.session.completed' && session.payment_status === 'paid') {
    await markBookingPaid(bookingId, session.id)
  } else if (event.type === 'checkout.session.expired') {
    const payload = await getPayloadClient()
    const booking = await payload.findByID({ collection: 'bookings', id: bookingId }).catch(() => null)
    if (booking?.status === 'pending') {
      await payload.update({ collection: 'bookings', id: booking.id, data: { status: 'cancelled' } })
    }
  }
  return Response.json({ received: true })
}

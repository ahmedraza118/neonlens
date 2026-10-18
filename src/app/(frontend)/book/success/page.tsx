import type { Metadata } from 'next'
import Link from 'next/link'

import { markBookingPaid } from '@/lib/bookings'
import { getStripe } from '@/lib/stripe'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Booking received', robots: { index: false } }

type Props = { searchParams: Promise<{ session_id?: string; booking?: string }> }

export default async function BookingSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams
  let paidDate: string | null = null

  // Confirm directly with Stripe as well as via the webhook, so the page is correct even if
  // the webhook is delayed or not configured locally.
  const stripe = getStripe()
  if (stripe && session_id) {
    const session = await stripe.checkout.sessions.retrieve(session_id).catch(() => null)
    if (session?.payment_status === 'paid' && session.metadata?.bookingId) {
      const booking = await markBookingPaid(session.metadata.bookingId, session.id)
      paidDate = booking?.date ? formatDate(booking.date) : null
    }
  }

  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div className="max-w-xl">
        <p className="text-6xl">✦</p>
        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">{paidDate ? "You're booked!" : 'Request received!'}</h1>
        <p className="mt-4 text-lg text-muted">
          {paidDate
            ? `Your deposit is paid and ${paidDate} is reserved for you. A confirmation email is on its way.`
            : "We've received your booking request and will email you within 24 hours with payment details to secure the date."}
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Link href="/portfolio" className="btn-primary">Get inspired</Link>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    </section>
  )
}

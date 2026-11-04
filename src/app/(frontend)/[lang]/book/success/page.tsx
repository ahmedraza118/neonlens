import type { Metadata } from 'next'
import Link from 'next/link'

import { fmt } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { markBookingPaid } from '@/lib/bookings'
import { getStripe } from '@/lib/stripe'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ session_id?: string; booking?: string }> }

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { t } = await localeFromParams(params)
  return { title: t.book.successMeta, robots: { index: false } }
}

export default async function BookingSuccessPage({ params, searchParams }: Props) {
  const { lang, t, href } = await localeFromParams(params)
  const { session_id } = await searchParams
  let paidDate: string | null = null

  // Confirm directly with Stripe as well as via the webhook, so the page is correct even if
  // the webhook is delayed or not configured locally.
  const stripe = getStripe()
  if (stripe && session_id) {
    const session = await stripe.checkout.sessions.retrieve(session_id).catch(() => null)
    if (session?.payment_status === 'paid' && session.metadata?.bookingId) {
      const booking = await markBookingPaid(session.metadata.bookingId, session.id)
      paidDate = booking?.date ? formatDate(booking.date, lang) : null
    }
  }

  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div className="max-w-xl">
        <p className="text-6xl">✦</p>
        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">{paidDate ? t.book.successBooked : t.book.successRequest}</h1>
        <p className="mt-4 text-lg text-muted">
          {paidDate ? fmt(t.book.successPaid, { date: paidDate }) : t.book.successPending}
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Link href={href('/portfolio')} className="btn-primary">{t.book.inspired}</Link>
          <Link href={href('/')} className="btn-ghost">{t.common.home}</Link>
        </div>
      </div>
    </section>
  )
}

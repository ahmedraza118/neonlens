import type { Metadata } from 'next'

import { BookingForm } from '@/components/BookingForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getAvailabilityRules } from '@/lib/availability'
import { getPricing, getServices, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ service?: string; package?: string; cancelled?: string }> }

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Book Your Date',
    description: 'Check live availability, choose a package and reserve your date with a secure online deposit.',
    path: '/book',
  })
}

export default async function BookPage({ searchParams }: Props) {
  const params = await searchParams
  const [settings, pricing, services, rules] = await Promise.all([getSettings(), getPricing(), getServices(), getAvailabilityRules()])
  const bookable = services
    .filter((s) => s.packages && s.packages.length > 0)
    .map((s) => ({ slug: s.slug!, title: s.title, packages: s.packages!.map((p) => ({ name: p.name, price: p.price, hours: p.hours, includes: p.includes, popular: p.popular })) }))

  return (
    <section className="container-x pt-12 pb-24">
      <Breadcrumbs items={[{ name: 'Book', path: '/book' }]} />
      <div className="mt-8 mb-12 max-w-2xl">
        <p className="eyebrow mb-3">Booking</p>
        <h1 className="text-4xl font-bold sm:text-5xl">Lock in your date.</h1>
        <p className="mt-4 text-lg text-muted">Pick a package and an available date, then reserve it with a {pricing.depositPercent}% deposit. Greyed-out dates are already booked.</p>
        {params.cancelled && <p role="status" className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm">Payment was cancelled — your date is not reserved yet. You can try again below.</p>}
      </div>
      <BookingForm
        services={bookable}
        rules={rules}
        depositPercent={pricing.depositPercent}
        currency={settings.currency}
        onlinePayments={Boolean(process.env.STRIPE_SECRET_KEY)}
        initialService={params.service}
        initialPackage={params.package}
      />
    </section>
  )
}

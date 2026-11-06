import type { Metadata } from 'next'

import { BookingForm } from '@/components/BookingForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { fmt } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { getAvailabilityRules } from '@/lib/availability'
import { releasePendingBooking } from '@/lib/bookings'
import { getPricing, getServices, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ service?: string; package?: string; cancelled?: string }> }

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { lang, t } = await localeFromParams(params)
  return buildMetadata({
    title: t.book.metaTitle,
    description: t.book.metaDescription,
    path: '/book',
    lang,
  })
}

export default async function BookPage({ params: routeParams, searchParams }: Props) {
  const { t } = await localeFromParams(routeParams)
  const params = await searchParams
  // Back from Stripe with "cancel": free the date this client was holding before showing the calendar.
  if (params.cancelled) await releasePendingBooking(params.cancelled)
  const [settings, pricing, services, rules] = await Promise.all([getSettings(), getPricing(), getServices(), getAvailabilityRules()])
  const bookable = services
    .filter((s) => s.packages && s.packages.length > 0)
    .map((s) => ({ slug: s.slug!, title: s.title, packages: s.packages!.map((p, i) => ({ id: p.id ?? String(i), name: p.name, price: p.price, hours: p.hours, includes: p.includes, popular: p.popular })) }))

  return (
    <section className="container-x pt-12 pb-24">
      <Breadcrumbs items={[{ name: t.book.crumb, path: '/book' }]} />
      <div className="mt-8 mb-12 max-w-2xl">
        <p className="eyebrow mb-3">{t.book.eyebrow}</p>
        <h1 className="text-4xl font-bold sm:text-5xl">{t.book.title}</h1>
        <p className="mt-4 text-lg text-muted">{fmt(t.book.intro, { percent: pricing.depositPercent })}</p>
        {params.cancelled && <p role="status" className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm">{t.book.cancelled}</p>}
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

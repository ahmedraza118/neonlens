import type { Metadata } from 'next'

import Link from 'next/link'

import { BookingForm } from '@/components/BookingForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Stars } from '@/components/Cards'
import { fmt } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { getAvailabilityRules, isDateBookable } from '@/lib/availability'
import { releasePendingBooking } from '@/lib/bookings'
import { getPricing, getService, getServices, getSettings, getTestimonials } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ service?: string; package?: string; cancelled?: string; date?: string }> }

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
  const { t, href } = await localeFromParams(routeParams)
  const params = await searchParams
  // Back from Stripe with "cancel": free the date this client was holding before showing the calendar.
  if (params.cancelled) await releasePendingBooking(params.cancelled)
  const [settings, pricing, services, rules, testimonials, chosenService] = await Promise.all([
    getSettings(),
    getPricing(),
    getServices(),
    getAvailabilityRules(),
    getTestimonials({ featured: true }),
    // The slug in the URL may be the other language's, after using the language switcher.
    params.service ? getService(params.service) : null,
  ])
  const review = testimonials[0]
  const googleRating = settings.googleRating?.value && settings.googleRating?.count ? settings.googleRating : null
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
        initialService={chosenService?.slug ?? undefined}
        initialPackage={params.package}
        initialDate={params.date && isDateBookable(rules, params.date) ? params.date : undefined}
      />
      {/* Reassurance for visitors close to paying, and a way out that is not "leave the site". */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {(review || googleRating) && (
          <figure className="card p-6">
            {googleRating && (
              <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Stars rating={googleRating.value!} />
                {fmt(t.reviews.summary, { value: googleRating.value!, count: googleRating.count! })}
              </p>
            )}
            {review && (
              <>
                <blockquote className="text-sm leading-relaxed text-fg/85">“{review.quote}”</blockquote>
                <figcaption className="mt-3 text-xs text-muted">{review.name}{review.role ? `, ${review.role}` : ''}</figcaption>
              </>
            )}
          </figure>
        )}
        <div className="card p-6">
          <h2 className="text-lg font-bold">{t.book.notReady}</h2>
          <p className="mt-2 text-sm text-muted">{t.book.notReadyText}</p>
          <Link href={href('/contact')} data-cta="book_ask_first" className="btn-ghost mt-4">{t.book.askFirst}</Link>
        </div>
      </div>
    </section>
  )
}

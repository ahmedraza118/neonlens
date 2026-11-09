import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Faq } from '@/components/Faq'
import { QuoteCalculator } from '@/components/QuoteCalculator'
import { SectionHeading } from '@/components/SectionHeading'
import { fmt } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { getLocation, getLocations, getPricing, getService, getServices, getSettings, populated } from '@/lib/queries'
import type { AddOn, Rate } from '@/lib/quote'
import { buildMetadata } from '@/lib/seo'
import { formatMoney } from '@/lib/utils'
import type { Service } from '@/payload-types'

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ service?: string; location?: string }> }

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { lang, t } = await localeFromParams(params)
  const [settings, services] = await Promise.all([getSettings(), getServices()])
  const from = Math.min(...services.map((s) => s.startingPrice))
  return buildMetadata({
    title: t.pricing.metaTitle,
    description: fmt(t.pricing.metaDescription, { from: Number.isFinite(from) ? formatMoney(from, settings.currency, lang) : t.pricing.fairRates }),
    path: '/pricing',
    lang,
  })
}

const idOf = (v: Service | number | null | undefined) => (typeof v === 'object' && v ? v.id : (v ?? 0))

export default async function PricingPage({ params, searchParams }: Props) {
  const { lang, t } = await localeFromParams(params)
  const { service, location } = await searchParams
  const [settings, pricing, services, locations, chosenService, chosenLocation] = await Promise.all([
    getSettings(),
    getPricing(),
    getServices(),
    getLocations(),
    // The slug in the URL may be the other language's, after using the language switcher.
    service ? getService(service) : null,
    location ? getLocation(location) : null,
  ])

  const rates: Rate[] = (pricing.rates ?? []).map((r) => ({
    serviceId: idOf(r.service),
    baseFee: r.baseFee,
    hourlyRate: r.hourlyRate,
    minHours: r.minHours,
    maxHours: r.maxHours,
  }))
  const addOns: AddOn[] = (pricing.addOns ?? []).map((a, i) => ({
    id: a.id ?? String(i),
    name: a.name,
    price: a.price,
    unit: a.unit === 'perHour' ? 'perHour' : 'flat',
    serviceIds: (a.services ?? []).map((s) => idOf(populated<Service>(s) ?? (s as number))),
  }))

  return (
    <>
      <section className="container-x pt-12 pb-20">
        <Breadcrumbs items={[{ name: t.nav.pricing, path: '/pricing' }]} />
        <div className="mt-8">
          <SectionHeading as="h1" eyebrow={t.pricing.eyebrow} title={t.pricing.title}>
            {t.pricing.intro}
            {services.map((s, i) => (
              <span key={s.id}>
                {i > 0 && ', '}
                {fmt(t.pricing.serviceFrom, { service: s.title.toLocaleLowerCase(lang), price: formatMoney(s.startingPrice, settings.currency, lang) })}
              </span>
            ))}
            .
          </SectionHeading>
        </div>
        <Suspense>
          <QuoteCalculator
            services={services.map((s) => ({ id: s.id, title: s.title, slug: s.slug! }))}
            locations={locations.map((l) => ({ slug: l.slug!, name: l.name, travelFee: l.travelFee ?? 0 }))}
            rates={rates}
            addOns={addOns}
            currency={settings.currency}
            spreadPercent={pricing.estimateSpreadPercent ?? 10}
            initialService={chosenService?.slug ?? undefined}
            initialLocation={chosenLocation?.slug ?? undefined}
          />
        </Suspense>
      </section>
      <Faq
        faqs={[
          { question: t.pricing.depositQ, answer: fmt(t.pricing.depositA, { percent: pricing.depositPercent }) },
          ...(settings.generalFaqs ?? []).filter((f) => new RegExp(t.pricing.faqMatch, 'i').test(f.question)),
        ]}
        heading={t.pricing.faqHeading}
      />
    </>
  )
}

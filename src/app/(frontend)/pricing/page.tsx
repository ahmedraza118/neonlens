import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Faq } from '@/components/Faq'
import { QuoteCalculator } from '@/components/QuoteCalculator'
import { SectionHeading } from '@/components/SectionHeading'
import { getLocations, getPricing, getServices, getSettings, populated } from '@/lib/queries'
import type { AddOn, Rate } from '@/lib/quote'
import { buildMetadata } from '@/lib/seo'
import { formatMoney } from '@/lib/utils'
import type { Service } from '@/payload-types'

type Props = { searchParams: Promise<{ service?: string; location?: string }> }

export async function generateMetadata(): Promise<Metadata> {
  const [settings, services] = await Promise.all([getSettings(), getServices()])
  const from = Math.min(...services.map((s) => s.startingPrice))
  return buildMetadata({
    title: 'Pricing & Instant Quote Calculator',
    description: `Transparent photography and videography prices from ${Number.isFinite(from) ? formatMoney(from, settings.currency) : 'fair rates'}. Build your package and get an instant estimate.`,
    path: '/pricing',
  })
}

const idOf = (v: Service | number | null | undefined) => (typeof v === 'object' && v ? v.id : (v ?? 0))

export default async function PricingPage({ searchParams }: Props) {
  const { service, location } = await searchParams
  const [settings, pricing, services, locations] = await Promise.all([getSettings(), getPricing(), getServices(), getLocations()])

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
        <Breadcrumbs items={[{ name: 'Pricing', path: '/pricing' }]} />
        <div className="mt-8">
          <SectionHeading as="h1" eyebrow="Pricing" title="Know the number before you call.">
            Build your coverage below for an instant estimate. Packages start at{' '}
            {services.map((s, i) => (
              <span key={s.id}>
                {i > 0 && ', '}
                {s.title.toLowerCase()} from {formatMoney(s.startingPrice, settings.currency)}
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
            initialService={service}
            initialLocation={location}
          />
        </Suspense>
      </section>
      <Faq
        faqs={[
          { question: 'How much is the deposit?', answer: `We take a ${pricing.depositPercent}% deposit to reserve your date. You can pay it online by card when you book.` },
          ...(settings.generalFaqs ?? []).filter((f) => /price|cost|pay|deposit|travel/i.test(f.question)),
        ]}
        heading="Pricing FAQ"
      />
    </>
  )
}

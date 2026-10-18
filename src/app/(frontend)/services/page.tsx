import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ServiceCard } from '@/components/Cards'
import { InquirySection } from '@/components/InquirySection'
import { SectionHeading } from '@/components/SectionHeading'
import { getLocations, getServices, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locations] = await Promise.all([getSettings(), getLocations()])
  const city = locations.find((l) => l.isPrimary)?.name ?? settings.address?.city
  return buildMetadata({
    title: `Photography & Videography Services in ${city}`,
    description: `Wedding, brand, event and portrait photography and films in ${city} and beyond. Transparent packages and online booking with ${settings.businessName}.`,
    path: '/services',
  })
}

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()])
  return (
    <>
      <section className="container-x pt-12 pb-24">
        <Breadcrumbs items={[{ name: 'Services', path: '/services' }]} />
        <div className="mt-8">
          <SectionHeading as="h1" eyebrow="Services" title="Everything you need, from one crew.">
            Photography, film, or both — planned together so the stills and the story match.
          </SectionHeading>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} currency={settings.currency} />
          ))}
        </div>
      </section>
      <InquirySection />
    </>
  )
}

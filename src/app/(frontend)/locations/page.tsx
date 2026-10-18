import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { InquirySection } from '@/components/InquirySection'
import { Media } from '@/components/Media'
import { SectionHeading } from '@/components/SectionHeading'
import { getLocations, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locations] = await Promise.all([getSettings(), getLocations()])
  return buildMetadata({
    title: 'Areas We Cover',
    description: `${settings.businessName} photographs and films across ${locations.map((l) => l.name).join(', ')}. See local venues, projects and travel fees.`,
    path: '/locations',
  })
}

export default async function LocationsPage() {
  const locations = await getLocations()
  return (
    <>
      <section className="container-x pt-12 pb-24">
        <Breadcrumbs items={[{ name: 'Locations', path: '/locations' }]} />
        <div className="mt-8">
          <SectionHeading as="h1" eyebrow="Locations" title="Where we shoot">
            Based locally, happy to travel. Pick a city to see the venues we know and work we have made there.
          </SectionHeading>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l) => (
            <Link key={l.id} href={`/locations/${l.slug}`} className="group card overflow-hidden">
              <div className="relative aspect-[3/2]">
                <Media media={l.heroImage} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold">{l.name}</h2>
                {l.region && <p className="text-sm text-muted">{l.region}</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>
      <InquirySection />
    </>
  )
}

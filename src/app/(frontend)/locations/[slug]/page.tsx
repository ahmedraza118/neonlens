import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProjectCard } from '@/components/Cards'
import { Faq } from '@/components/Faq'
import { InquirySection } from '@/components/InquirySection'
import { PageHero } from '@/components/PageHero'
import { Paragraphs } from '@/components/Paragraphs'
import { SectionHeading } from '@/components/SectionHeading'
import { getLocation, getLocations, getProjects, getServices, getSettings, populated } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { formatMoney } from '@/lib/utils'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getLocations()).map((l) => ({ slug: l.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [location, settings] = await Promise.all([getLocation(slug), getSettings()])
  if (!location) return {}
  return buildMetadata({
    title: `Photographer & Videographer in ${location.name}`,
    description: `Wedding, brand and event photography and video in ${location.name}${location.region ? `, ${location.region}` : ''}. Local venues, real projects and instant quotes from ${settings.businessName}.`,
    path: `/locations/${location.slug}`,
    image: populated(location.heroImage),
    seo: location.seo,
  })
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params
  const [location, settings, services] = await Promise.all([getLocation(slug), getSettings(), getServices()])
  if (!location) notFound()
  const projects = await getProjects({ locationId: location.id, limit: 9 })

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Locations', path: '/locations' }, { name: location.name, path: `/locations/${location.slug}` }]}
        eyebrow={location.region}
        title={<>Photographer & videographer in <span className="text-accent">{location.name}</span></>}
        subtitle={location.nearbyAreas && location.nearbyAreas.length > 0 ? `Also covering ${location.nearbyAreas.join(', ')}.` : undefined}
        image={location.heroImage}
      />

      <section className="container-x py-12">
        <Paragraphs text={location.intro} className="max-w-3xl text-lg leading-relaxed text-fg/85" />
      </section>

      <section className="container-x py-12">
        <SectionHeading eyebrow="Services" title={`What we offer in ${location.name}`} />
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <Link key={s.id} href={`/services/${s.slug}/${location.slug}`} className="card flex items-center justify-between p-6 transition hover:border-accent/50">
              <span>
                <span className="block text-lg font-bold">{s.title} in {location.name}</span>
                <span className="text-sm text-muted">from {formatMoney(s.startingPrice, settings.currency)}</span>
              </span>
              <span aria-hidden className="text-accent">→</span>
            </Link>
          ))}
        </div>
      </section>

      {location.venues && location.venues.length > 0 && (
        <section className="container-x py-12">
          <SectionHeading eyebrow="Local knowledge" title={`Venues & photo spots in ${location.name}`} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {location.venues.map((v) => (
              <div key={v.id} className="card p-6">
                <h3 className="text-lg font-bold">{v.name}</h3>
                {v.description && <p className="mt-2 text-sm text-muted">{v.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="container-x py-12">
          <SectionHeading eyebrow="Portfolio" title={`Shot in ${location.name}`} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      <Faq faqs={location.faqs} heading={`Shooting in ${location.name}: FAQ`} />
      <InquirySection heading={`Planning something in ${location.name}?`} defaultLocation={location.name} />
    </>
  )
}

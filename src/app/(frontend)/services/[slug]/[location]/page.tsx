import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { InquirySection } from '@/components/InquirySection'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { Paragraphs } from '@/components/Paragraphs'
import { ServiceBody, serviceLocationNote } from '@/components/ServiceBody'
import { serviceSchema } from '@/lib/jsonld'
import { getLocation, getLocations, getService, getServices, getSettings, populated } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { formatMoney } from '@/lib/utils'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string; location: string }> }

/** One landing page per service × city, e.g. /services/wedding-photography/cluj-napoca. */
export async function generateStaticParams() {
  const [services, locations] = await Promise.all([getServices(), getLocations()])
  return services.flatMap((s) => locations.map((l) => ({ slug: s.slug!, location: l.slug! })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, location: locationSlug } = await params
  const [service, location, settings] = await Promise.all([getService(slug), getLocation(locationSlug), getSettings()])
  if (!service || !location) return {}
  return buildMetadata({
    title: `${service.title} in ${location.name}`,
    description: `${service.tagline}. ${service.title} in ${location.name}${location.region ? `, ${location.region}` : ''} from ${formatMoney(service.startingPrice, settings.currency)} — see local work, packages and check your date.`,
    path: `/services/${service.slug}/${location.slug}`,
    image: populated(location.heroImage) ?? populated(service.heroImage),
  })
}

export default async function ServiceLocationPage({ params }: Props) {
  const { slug, location: locationSlug } = await params
  const [service, location, settings, locations] = await Promise.all([getService(slug), getLocation(locationSlug), getSettings(), getLocations()])
  if (!service || !location) notFound()

  const note = serviceLocationNote(location, service.id)
  const hero = populated(location.heroImage) ?? service.heroImage

  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Services', path: '/services' },
          { name: service.title, path: `/services/${service.slug}` },
          { name: location.name, path: `/services/${service.slug}/${location.slug}` },
        ]}
        eyebrow={location.region ? `${location.name}, ${location.region}` : location.name}
        title={<>{service.title} in <span className="text-accent">{location.name}</span></>}
        subtitle={
          <>
            From <span className="font-semibold text-fg">{formatMoney(service.startingPrice, settings.currency)}</span>
            {location.travelFee ? ` · travel ${formatMoney(location.travelFee, settings.currency)}` : ' · no travel fee'}
          </>
        }
        image={hero}
      >
        <Link href="#inquire" className="btn-primary">Check your date</Link>
        <Link href={`/pricing?service=${service.slug}&location=${location.slug}`} className="btn-ghost">Instant quote</Link>
      </PageHero>

      <section className="container-x grid gap-12 py-16 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8 text-lg leading-relaxed text-fg/85">
          {note && <Paragraphs text={note} />}
          <Paragraphs text={location.intro} />
          <Paragraphs text={service.intro} className="text-base text-muted" />
        </div>
        <aside className="space-y-6">
          {location.venues && location.venues.length > 0 && (
            <div className="card p-6">
              <p className="eyebrow mb-4">Venues & spots we know in {location.name}</p>
              <ul className="space-y-3 text-sm">
                {location.venues.map((v) => (
                  <li key={v.id}>
                    <p className="font-semibold">{v.name}</p>
                    {v.description && <p className="text-muted">{v.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="card p-6">
            <p className="eyebrow mb-4">Also in {location.name}</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/locations/${location.slug}`} className="text-muted hover:text-fg">All services in {location.name} →</Link>
              </li>
              {locations
                .filter((l) => l.id !== location.id)
                .map((l) => (
                  <li key={l.id}>
                    <Link href={`/services/${service.slug}/${l.slug}`} className="text-muted hover:text-fg">
                      {service.title} in {l.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </section>

      <ServiceBody service={service} settings={settings} location={location} />
      <InquirySection heading={`${service.title} in ${location.name}?`} defaultService={service.title} defaultLocation={location.name} />
      <JsonLd data={serviceSchema(service, settings, location)} />
    </>
  )
}

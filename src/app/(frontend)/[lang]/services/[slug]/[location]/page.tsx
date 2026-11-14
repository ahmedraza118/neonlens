import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import { InquirySection } from '@/components/InquirySection'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { Paragraphs } from '@/components/Paragraphs'
import { ServiceBody } from '@/components/ServiceBody'
import { areaPageIndexable, hasAreaPage, placeName, serviceLocationNote } from '@/lib/areas'
import { fmt, toLocale } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { serviceSchema } from '@/lib/jsonld'
import { getLocation, getLocations, getService, getServices, getSettings, getSlugs, populated } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { formatMoney } from '@/lib/utils'

export const revalidate = 3600

type Props = { params: Promise<{ lang: string; slug: string; location: string }> }

/** Service × area landing pages, e.g. /servicii/fotograf-nunta/snagov — only where hasAreaPage(). */
type StaticProps = { params: { lang: string } }

export async function generateStaticParams({ params }: StaticProps) {
  const lang = toLocale(params.lang)
  const [services, locations] = await Promise.all([getServices(lang), getLocations(lang)])
  return services.flatMap((s) => locations.filter((l) => hasAreaPage(l, s.id)).map((l) => ({ slug: s.slug!, location: l.slug! })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t } = await localeFromParams(params)
  const { slug, location: locationSlug } = await params
  const [service, location, settings] = await Promise.all([getService(slug), getLocation(locationSlug), getSettings()])
  if (!service || !location || !hasAreaPage(location, service.id)) return {}
  return buildMetadata({
    title: fmt(t.common.in, { service: service.title, city: location.name }),
    description: fmt(t.services.localMetaDescription, {
      service: service.title,
      place: placeName(location),
      price: formatMoney(service.startingPrice, settings.currency, lang),
    }),
    path: await (async () => {
      const [s, l] = await Promise.all([getSlugs('services', service.id), getSlugs('locations', location.id)])
      return { ro: `/services/${s.ro}/${l.ro}`, en: `/services/${s.en}/${l.en}` }
    })(),
    lang,
    image: populated(location.heroImage) ?? populated(service.heroImage),
    geo: { placename: location.name, region: location.region, lat: location.geo?.lat, lng: location.geo?.lng },
    // Near-copies of the main service page stay out of Google until switched on in the CMS.
    noIndexFollow: !areaPageIndexable(location, service.id),
  })
}

export default async function ServiceLocationPage({ params }: Props) {
  const { lang, t, href } = await localeFromParams(params)
  const { slug, location: locationSlug } = await params
  const [service, location, settings, locations] = await Promise.all([getService(slug), getLocation(locationSlug), getSettings(), getLocations()])
  if (!service || !location) notFound()
  // Bucharest is covered by the main service page itself (one strong page per search).
  if (location.isPrimary) permanentRedirect(href(`/services/${service.slug}`))
  if (!hasAreaPage(location, service.id)) notFound()
  if (service.slug !== slug || location.slug !== locationSlug) permanentRedirect(href(`/services/${service.slug}/${location.slug}`))

  const note = serviceLocationNote(location, service.id)
  const hero = populated(location.heroImage) ?? service.heroImage

  return (
    <>
      <PageHero
        crumbs={[
          { name: t.nav.services, path: '/services' },
          { name: service.title, path: `/services/${service.slug}` },
          { name: location.name, path: `/services/${service.slug}/${location.slug}` },
        ]}
        eyebrow={placeName(location)}
        title={
          <>
            {t.common.in.split('{city}')[0].replace('{service}', service.title)}
            <span className="text-accent">{location.name}</span>
          </>
        }
        subtitle={
          <>
            {t.common.fromCap} <span className="font-semibold text-fg">{formatMoney(service.startingPrice, settings.currency, lang)}</span>
            {location.travelFee ? fmt(t.services.travel, { price: formatMoney(location.travelFee, settings.currency, lang) }) : t.services.noTravel}
          </>
        }
        image={hero}
      >
        <Link href="#inquire" className="btn-primary">{t.common.checkDate}</Link>
        <Link href={href(`/pricing?service=${service.slug}&location=${location.slug}`)} className="btn-ghost">{t.common.instantQuoteShort}</Link>
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
              <p className="eyebrow mb-4">{fmt(t.services.venues, { city: location.name })}</p>
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
            <p className="eyebrow mb-4">{fmt(t.services.alsoIn, { city: location.name })}</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={href(`/locations/${location.slug}`)} className="inline-block py-2 text-muted hover:text-fg">{fmt(t.services.allIn, { city: location.name })}</Link>
              </li>
              {locations
                .filter((l) => l.id !== location.id && hasAreaPage(l, service.id))
                .map((l) => (
                  <li key={l.id}>
                    <Link href={href(`/services/${service.slug}/${l.slug}`)} className="inline-block py-2 text-muted hover:text-fg">
                      {fmt(t.common.in, { service: service.title, city: l.name })}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </section>

      <ServiceBody service={service} settings={settings} location={location} />
      <InquirySection heading={fmt(t.services.localInquiry, { service: service.title, city: location.name })} defaultService={service.title} defaultLocation={location.name} />
      <JsonLd data={serviceSchema(service, settings, location, lang)} />
    </>
  )
}

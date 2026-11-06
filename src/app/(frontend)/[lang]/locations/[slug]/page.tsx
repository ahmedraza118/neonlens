import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import { ProjectCard } from '@/components/Cards'
import { Faq } from '@/components/Faq'
import { InquirySection } from '@/components/InquirySection'
import { PageHero } from '@/components/PageHero'
import { Paragraphs } from '@/components/Paragraphs'
import { SectionHeading } from '@/components/SectionHeading'
import { fmt, toLocale } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { getLocation, getLocations, getProjects, getServices, getSettings, getSlugs, populated } from '@/lib/queries'
import { buildMetadata, localizedPaths } from '@/lib/seo'
import { hasAreaPage } from '@/lib/areas'
import { formatMoney } from '@/lib/utils'

export const revalidate = 3600

type Props = { params: Promise<{ lang: string; slug: string }> }

type StaticProps = { params: { lang: string } }

export async function generateStaticParams({ params }: StaticProps) {
  return (await getLocations(toLocale(params.lang))).map((l) => ({ slug: l.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t } = await localeFromParams(params)
  const { slug } = await params
  const [location, settings] = await Promise.all([getLocation(slug), getSettings()])
  if (!location) return {}
  return buildMetadata({
    title: fmt(t.locations.detailMetaTitle, { city: location.name }),
    description: fmt(t.locations.detailMetaDescription, {
      place: location.region ? `${location.name}, ${location.region}` : location.name,
      name: settings.businessName,
    }),
    path: localizedPaths(await getSlugs('locations', location.id), (s) => `/locations/${s}`),
    lang,
    image: populated(location.heroImage),
    seo: location.seo,
  })
}

export default async function LocationPage({ params }: Props) {
  const { lang, t, href } = await localeFromParams(params)
  const { slug } = await params
  const [location, settings, services] = await Promise.all([getLocation(slug), getSettings(), getServices()])
  if (!location) notFound()
  if (location.slug !== slug) permanentRedirect(href(`/locations/${location.slug}`))
  const projects = await getProjects({ locationId: location.id, limit: 9 })

  return (
    <>
      <PageHero
        crumbs={[{ name: t.locations.crumb, path: '/locations' }, { name: location.name, path: `/locations/${location.slug}` }]}
        eyebrow={location.region}
        title={
          <>
            {t.locations.detailTitle.split('{city}')[0]}
            <span className="text-accent">{location.name}</span>
          </>
        }
        subtitle={location.nearbyAreas && location.nearbyAreas.length > 0 ? fmt(t.locations.alsoCovering, { areas: location.nearbyAreas.join(', ') }) : undefined}
        image={location.heroImage}
      />

      <section className="container-x py-12">
        <Paragraphs text={location.intro} className="max-w-3xl text-lg leading-relaxed text-fg/85" />
      </section>

      <section className="container-x py-12">
        <SectionHeading eyebrow={t.locations.offerEyebrow} title={fmt(t.locations.offerTitle, { city: location.name })} />
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            // The area landing page where one exists, else the main service page (which covers Bucharest).
            <Link
              key={s.id}
              href={href(hasAreaPage(location, s.id) ? `/services/${s.slug}/${location.slug}` : `/services/${s.slug}`)}
              className="card flex items-center justify-between p-6 transition hover:border-accent/50"
            >
              <span>
                <span className="block text-lg font-bold">{hasAreaPage(location, s.id) || location.isPrimary ? fmt(t.common.in, { service: s.title, city: location.name }) : s.title}</span>
                <span className="text-sm text-muted">{t.common.from} {formatMoney(s.startingPrice, settings.currency, lang)}</span>
              </span>
              <span aria-hidden className="text-accent">→</span>
            </Link>
          ))}
        </div>
      </section>

      {location.venues && location.venues.length > 0 && (
        <section className="container-x py-12">
          <SectionHeading eyebrow={t.locations.venuesEyebrow} title={fmt(t.locations.venuesTitle, { city: location.name })} />
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
          <SectionHeading eyebrow={t.services.portfolio} title={fmt(t.locations.shotIn, { city: location.name })} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      <Faq faqs={location.faqs} heading={fmt(t.locations.faq, { city: location.name })} />
      <InquirySection heading={fmt(t.locations.inquiry, { city: location.name })} defaultLocation={location.name} />
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import { DateChecker } from '@/components/DateChecker'
import { InquirySection } from '@/components/InquirySection'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { Paragraphs } from '@/components/Paragraphs'
import { ServiceBody } from '@/components/ServiceBody'
import { fmt, toLocale } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { serviceSchema, videoSchema } from '@/lib/jsonld'
import { getLocations, getService, getServices, getSettings, getSlugs, populated } from '@/lib/queries'
import { buildMetadata, localizedPaths } from '@/lib/seo'
import { hasAreaPage } from '@/lib/areas'
import { formatMoney } from '@/lib/utils'

export const revalidate = 3600

type Props = { params: Promise<{ lang: string; slug: string }> }

type StaticProps = { params: { lang: string } }

export async function generateStaticParams({ params }: StaticProps) {
  const services = await getServices(toLocale(params.lang))
  return services.map((s) => ({ slug: s.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t } = await localeFromParams(params)
  const { slug } = await params
  const [service, settings, locations] = await Promise.all([getService(slug), getSettings(), getLocations()])
  if (!service) return {}
  const city = locations.find((l) => l.isPrimary)?.name ?? settings.address?.city
  return buildMetadata({
    title: fmt(t.common.in, { service: service.title, city: city ?? '' }),
    description: `${service.excerpt} ${fmt(t.services.metaFrom, { price: formatMoney(service.startingPrice, settings.currency, lang) })}`,
    path: localizedPaths(await getSlugs('services', service.id), (s) => `/services/${s}`),
    lang,
    image: populated(service.heroImage),
    seo: service.seo,
  })
}

export default async function ServicePage({ params }: Props) {
  const { lang, t, href } = await localeFromParams(params)
  const { slug } = await params
  const [service, settings, locations] = await Promise.all([getService(slug), getSettings(), getLocations()])
  if (!service) notFound()
  if (service.slug !== slug) permanentRedirect(href(`/services/${service.slug}`))

  return (
    <>
      <PageHero
        crumbs={[{ name: t.nav.services, path: '/services' }, { name: service.title, path: `/services/${service.slug}` }]}
        eyebrow={service.tagline}
        title={fmt(t.services.h1, { service: service.title, area: t.common.area })}
        subtitle={<>{t.common.fromCap} <span className="font-semibold text-fg">{formatMoney(service.startingPrice, settings.currency, lang)}</span></>}
        image={service.heroImage}
      >
        <Link href="#inquire" className="btn-primary">{t.common.checkAvailability}</Link>
        <Link href={href(`/pricing?service=${service.slug}`)} className="btn-ghost">{t.common.instantQuote}</Link>
      </PageHero>

      <section className="container-x grid gap-12 py-16 lg:grid-cols-[2fr_1fr]">
        <Paragraphs text={service.intro} className="text-lg leading-relaxed text-fg/85" />
        <aside className="h-fit space-y-6">
          <DateChecker service={service.slug ?? undefined} />
          <div className="card p-6">
          <p className="eyebrow mb-4">{t.services.availableIn}</p>
          <ul className="space-y-2">
            {/* Area landing page where one exists, otherwise the area's overview page. */}
            {locations.map((l) => (
              <li key={l.id}>
                <Link
                  href={href(hasAreaPage(l, service.id) ? `/services/${service.slug}/${l.slug}` : `/locations/${l.slug}`)}
                  className="flex justify-between gap-3 py-2 text-sm text-muted hover:text-fg"
                >
                  {hasAreaPage(l, service.id) ? fmt(t.common.in, { service: service.title, city: l.name }) : l.name} <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
          </div>
        </aside>
      </section>

      <ServiceBody service={service} settings={settings} />
      <InquirySection heading={fmt(t.services.planning, { service: service.title.toLocaleLowerCase(lang) })} defaultService={service.title} />
      <JsonLd
        data={[
          serviceSchema(service, settings, null, lang),
          videoSchema(service.video, { name: service.title, description: service.excerpt, thumbnail: service.heroImage, uploadDate: service.createdAt }),
        ]}
      />
    </>
  )
}

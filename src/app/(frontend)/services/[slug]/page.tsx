import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { InquirySection } from '@/components/InquirySection'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { Paragraphs } from '@/components/Paragraphs'
import { ServiceBody } from '@/components/ServiceBody'
import { serviceSchema, videoSchema } from '@/lib/jsonld'
import { getLocations, getService, getServices, getSettings, populated } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { formatMoney } from '@/lib/utils'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((s) => ({ slug: s.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [service, settings, locations] = await Promise.all([getService(slug), getSettings(), getLocations()])
  if (!service) return {}
  const city = locations.find((l) => l.isPrimary)?.name ?? settings.address?.city
  return buildMetadata({
    title: `${service.title} in ${city}`,
    description: `${service.excerpt} From ${formatMoney(service.startingPrice, settings.currency)}.`,
    path: `/services/${service.slug}`,
    image: populated(service.heroImage),
    seo: service.seo,
  })
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const [service, settings, locations] = await Promise.all([getService(slug), getSettings(), getLocations()])
  if (!service) notFound()

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Services', path: '/services' }, { name: service.title, path: `/services/${service.slug}` }]}
        eyebrow={service.tagline}
        title={service.title}
        subtitle={<>From <span className="font-semibold text-fg">{formatMoney(service.startingPrice, settings.currency)}</span></>}
        image={service.heroImage}
      >
        <Link href="#inquire" className="btn-primary">Check availability</Link>
        <Link href={`/pricing?service=${service.slug}`} className="btn-ghost">Get an instant quote</Link>
      </PageHero>

      <section className="container-x grid gap-12 py-16 lg:grid-cols-[2fr_1fr]">
        <Paragraphs text={service.intro} className="text-lg leading-relaxed text-fg/85" />
        <aside className="card h-fit p-6">
          <p className="eyebrow mb-4">Available in</p>
          <ul className="space-y-2">
            {locations.map((l) => (
              <li key={l.id}>
                <Link href={`/services/${service.slug}/${l.slug}`} className="flex justify-between text-sm text-muted hover:text-fg">
                  {service.title} in {l.name} <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <ServiceBody service={service} settings={settings} />
      <InquirySection heading={`Planning ${service.title.toLowerCase()}?`} defaultService={service.title} />
      <JsonLd
        data={[
          serviceSchema(service, settings),
          videoSchema(service.video, { name: service.title, description: service.excerpt, thumbnail: service.heroImage, uploadDate: service.createdAt }),
        ]}
      />
    </>
  )
}

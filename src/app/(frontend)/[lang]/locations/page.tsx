import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { InquirySection } from '@/components/InquirySection'
import { Media } from '@/components/Media'
import { SectionHeading } from '@/components/SectionHeading'
import { fmt } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { getLocations, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t } = await localeFromParams(params)
  const [settings, locations] = await Promise.all([getSettings(), getLocations()])
  return buildMetadata({
    title: t.locations.metaTitle,
    description: fmt(t.locations.metaDescription, { name: settings.businessName, cities: locations.map((l) => l.name).join(', ') }),
    path: '/locations',
    lang,
  })
}

export default async function LocationsPage({ params }: Props) {
  const { t, href } = await localeFromParams(params)
  const locations = await getLocations()
  return (
    <>
      <section className="container-x pt-12 pb-24">
        <Breadcrumbs items={[{ name: t.locations.crumb, path: '/locations' }]} />
        <div className="mt-8">
          <SectionHeading as="h1" eyebrow={t.locations.eyebrow} title={t.locations.title}>
            {t.locations.intro}
          </SectionHeading>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l) => (
            <Link key={l.id} href={href(`/locations/${l.slug}`)} className="group card overflow-hidden">
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

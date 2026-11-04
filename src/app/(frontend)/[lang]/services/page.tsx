import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ServiceCard } from '@/components/Cards'
import { InquirySection } from '@/components/InquirySection'
import { SectionHeading } from '@/components/SectionHeading'
import { fmt } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { getLocations, getServices, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t } = await localeFromParams(params)
  const [settings, locations] = await Promise.all([getSettings(), getLocations()])
  const city = locations.find((l) => l.isPrimary)?.name ?? settings.address?.city
  return buildMetadata({
    title: fmt(t.services.metaTitle, { city: city ?? '' }),
    description: fmt(t.services.metaDescription, { city: city ?? '', name: settings.businessName }),
    path: '/services',
    lang,
  })
}

export default async function ServicesPage({ params }: Props) {
  const { t } = await localeFromParams(params)
  const [settings, services] = await Promise.all([getSettings(), getServices()])
  return (
    <>
      <section className="container-x pt-12 pb-24">
        <Breadcrumbs items={[{ name: t.nav.services, path: '/services' }]} />
        <div className="mt-8">
          <SectionHeading as="h1" eyebrow={t.services.eyebrow} title={t.services.title}>
            {t.services.intro}
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

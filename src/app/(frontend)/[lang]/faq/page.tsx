import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Faq } from '@/components/Faq'
import { InquirySection } from '@/components/InquirySection'
import { fmt } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { getServices, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t } = await localeFromParams(params)
  const settings = await getSettings()
  return buildMetadata({
    title: t.faq.metaTitle,
    description: fmt(t.faq.metaDescription, { name: settings.businessName }),
    path: '/faq',
    lang,
  })
}

export default async function FaqPage({ params }: Props) {
  const { t } = await localeFromParams(params)
  const [settings, services] = await Promise.all([getSettings(), getServices()])
  const serviceFaqs = services.flatMap((s) => s.faqs ?? [])
  return (
    <>
      <section className="container-x pt-12">
        <Breadcrumbs items={[{ name: t.faq.crumb, path: '/faq' }]} />
        <h1 className="mt-10 text-4xl font-bold sm:text-5xl">{t.faq.title}</h1>
      </section>
      <Faq faqs={[...(settings.generalFaqs ?? []), ...serviceFaqs]} heading={t.faq.heading} />
      <InquirySection heading={t.faq.inquiry} />
    </>
  )
}

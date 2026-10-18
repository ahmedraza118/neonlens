import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Faq } from '@/components/Faq'
import { InquirySection } from '@/components/InquirySection'
import { getServices, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return buildMetadata({
    title: 'FAQ — Booking, Pricing & Delivery',
    description: `Answers to common questions about booking ${settings.businessName}: deposits, travel, delivery times, galleries and more.`,
    path: '/faq',
  })
}

export default async function FaqPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()])
  const serviceFaqs = services.flatMap((s) => s.faqs ?? [])
  return (
    <>
      <section className="container-x pt-12">
        <Breadcrumbs items={[{ name: 'FAQ', path: '/faq' }]} />
        <h1 className="mt-10 text-4xl font-bold sm:text-5xl">Questions, answered.</h1>
      </section>
      <Faq faqs={[...(settings.generalFaqs ?? []), ...serviceFaqs]} heading="Booking, pricing & delivery" />
      <InquirySection heading="Still have a question?" />
    </>
  )
}

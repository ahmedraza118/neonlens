import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { InquiryForm } from '@/components/InquiryForm'
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
    title: t.contact.metaTitle,
    description: fmt(t.contact.metaDescription, { name: settings.businessName }),
    path: '/contact',
    lang,
  })
}

export default async function ContactPage({ params }: Props) {
  const { t } = await localeFromParams(params)
  const [settings, services] = await Promise.all([getSettings(), getServices()])
  return (
    <section className="container-x pt-12 pb-24">
      <Breadcrumbs items={[{ name: t.nav.contact, path: '/contact' }]} />
      <div className="mt-10 grid gap-16 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="eyebrow mb-4">{t.contact.eyebrow}</p>
          <h1 className="text-4xl font-bold sm:text-5xl">{t.contact.title}</h1>
          <p className="mt-6 text-lg text-muted">{t.contact.intro}</p>
          <ul className="mt-10 space-y-4 text-sm">
            <li>
              <span className="label">{t.contact.email}</span>
              <a href={`mailto:${settings.email}`} className="inline-block py-1 text-lg hover:text-accent">{settings.email}</a>
            </li>
            <li>
              <span className="label">{t.contact.phone}</span>
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="inline-block py-1 text-lg hover:text-accent">{settings.phone}</a>
            </li>
            {settings.whatsapp && (
              <li>
                <span className="label">{t.contact.whatsapp}</span>
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener" className="inline-block py-1 text-lg hover:text-accent">{t.contact.message}</a>
              </li>
            )}
            <li>
              <span className="label">{t.contact.studio}</span>
              <address className="text-lg not-italic">
                {[settings.address?.street, settings.address?.city].filter(Boolean).join(', ')}
              </address>
            </li>
          </ul>
        </div>
        <div className="card p-6 sm:p-10">
          <Suspense>
            <InquiryForm services={services.map((s) => ({ title: s.title }))} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}

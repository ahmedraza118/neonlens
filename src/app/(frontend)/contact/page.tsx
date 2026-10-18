import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { InquiryForm } from '@/components/InquiryForm'
import { getServices, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return buildMetadata({
    title: 'Contact & Check Availability',
    description: `Tell ${settings.businessName} about your wedding, event or brand project. We reply within 24 hours — or message us on WhatsApp.`,
    path: '/contact',
  })
}

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()])
  return (
    <section className="container-x pt-12 pb-24">
      <Breadcrumbs items={[{ name: 'Contact', path: '/contact' }]} />
      <div className="mt-10 grid gap-16 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="eyebrow mb-4">Contact</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Let&apos;s make something beautiful.</h1>
          <p className="mt-6 text-lg text-muted">Share a few details and we&apos;ll come back with availability and a tailored quote — usually the same day.</p>
          <ul className="mt-10 space-y-4 text-sm">
            <li>
              <span className="label">Email</span>
              <a href={`mailto:${settings.email}`} className="text-lg hover:text-accent">{settings.email}</a>
            </li>
            <li>
              <span className="label">Phone</span>
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="text-lg hover:text-accent">{settings.phone}</a>
            </li>
            {settings.whatsapp && (
              <li>
                <span className="label">WhatsApp</span>
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener" className="text-lg hover:text-accent">Message us →</a>
              </li>
            )}
            <li>
              <span className="label">Studio</span>
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

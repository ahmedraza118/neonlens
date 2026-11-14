import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { InquiryForm } from '@/components/InquiryForm'
import { fmt } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { getLocations, getServices, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = { params: Promise<{ lang: string }> }

const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
type Day = (typeof WEEK)[number]

/** "Monday–Friday" for a run of consecutive days, otherwise the days listed. */
function dayRange(days: readonly Day[], names: Record<Day, string>): string {
  const sorted = [...days].sort((a, b) => WEEK.indexOf(a) - WEEK.indexOf(b))
  if (sorted.length === 0) return ''
  const consecutive = sorted.every((d, i) => i === 0 || WEEK.indexOf(d) === WEEK.indexOf(sorted[i - 1]) + 1)
  if (consecutive && sorted.length > 2) return `${names[sorted[0]]}–${names[sorted[sorted.length - 1]]}`
  return sorted.map((d) => names[d]).join(', ')
}

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
  const { t, href } = await localeFromParams(params)
  const [settings, services, locations] = await Promise.all([getSettings(), getServices(), getLocations()])
  const phoneHref = `tel:${settings.phone.replace(/[^\d+]/g, '')}`
  const hours = (settings.openingHours ?? []).filter((o) => o.days && o.days.length > 0 && o.opens && o.closes)
  const street = settings.address?.street
  // The Google Business Profile when there is one (it shows reviews and directions), else the area on the map.
  const mapUrl =
    settings.googleBusinessProfileUrl ||
    (settings.geo?.lat && settings.geo?.lng ? `https://www.google.com/maps/search/?api=1&query=${settings.geo.lat},${settings.geo.lng}` : null)

  return (
    <section className="container-x pt-12 pb-24">
      <Breadcrumbs items={[{ name: t.nav.contact, path: '/contact' }]} />
      <div className="mt-10 grid gap-16 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="eyebrow mb-4">{t.contact.eyebrow}</p>
          <h1 className="text-4xl font-bold sm:text-5xl">{t.contact.title}</h1>
          <p className="mt-6 text-lg text-muted">{t.contact.intro}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={phoneHref} className="btn-primary" data-cta="contact_call">
              {fmt(t.contact.call, { phone: settings.phone })}
            </a>
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener" className="btn-ghost" data-cta="contact_whatsapp">
                {t.contact.whatsappCta}
              </a>
            )}
          </div>

          <dl className="mt-10 space-y-6 text-sm">
            <div>
              <dt className="label">{t.contact.email}</dt>
              <dd>
                <a href={`mailto:${settings.email}`} className="inline-block py-1 text-lg break-all hover:text-accent">
                  {settings.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label">{t.contact.phone}</dt>
              <dd>
                <a href={phoneHref} className="inline-block py-1 text-lg hover:text-accent">
                  {settings.phone}
                </a>
              </dd>
            </div>
            {hours.length > 0 && (
              <div>
                <dt className="label">{t.contact.hours}</dt>
                <dd className="text-lg">
                  {hours.map((o) => (
                    <p key={o.id ?? `${o.opens}-${o.closes}`}>
                      {dayRange((o.days ?? []) as Day[], t.contact.days)}: {o.opens}–{o.closes}
                    </p>
                  ))}
                </dd>
              </div>
            )}
            <div>
              <dt className="label">{t.contact.reply}</dt>
              <dd className="text-lg">{t.contact.replyValue}</dd>
            </div>
            {street && (
              <div>
                <dt className="label">{t.contact.studio}</dt>
                <dd>
                  <address className="text-lg not-italic">{[street, settings.address?.city].filter(Boolean).join(', ')}</address>
                </dd>
              </div>
            )}
            <div>
              <dt className="label">{t.contact.area}</dt>
              <dd className="text-base leading-relaxed text-fg/85">
                {fmt(t.about.based, { city: settings.address?.city ?? '' })}
                {locations.map((l, i) => (
                  <span key={l.id}>
                    {i > 0 && (i === locations.length - 1 ? t.common.and : ', ')}
                    <Link href={href(`/locations/${l.slug}`)} className="text-fg underline decoration-accent/50 underline-offset-4 hover:decoration-accent">
                      {l.name}
                    </Link>
                  </span>
                ))}
                .
                {mapUrl && (
                  <>
                    {' '}
                    <a href={mapUrl} target="_blank" rel="noopener" className="whitespace-nowrap text-accent hover:underline" data-cta="contact_map">
                      {t.contact.map} ↗
                    </a>
                  </>
                )}
              </dd>
            </div>
          </dl>
        </div>
        <div className="card p-6 sm:p-10 lg:self-start">
          <Suspense>
            <InquiryForm services={services.map((s) => ({ title: s.title }))} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}

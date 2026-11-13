import Link from 'next/link'

import { fmt } from '@/i18n/config'
import { hasAreaPage } from '@/lib/areas'
import { ConsentSettingsButton } from './ConsentBanner'
import { getI18n } from '@/i18n/server'
import { type ContentPage, isShown } from '@/lib/site'
import type { Location, Service, SiteSetting } from '@/payload-types'

/**
 * Footer with full NAP (name, address, phone — must match Google Business Profile) and
 * internal links to every service and city page, which helps search engines discover them.
 */
export function Footer({ settings, services, locations, presence }: { settings: SiteSetting; services: Service[]; locations: Location[]; presence?: Record<ContentPage, boolean> }) {
  const social = Object.entries(settings.social ?? {}).filter(([k, v]) => k !== 'id' && typeof v === 'string' && v)
  // Links to the existing service × area landing pages (one per area, the first service that has one).
  const popular = locations
    .map((l) => ({ l, s: services.find((s) => hasAreaPage(l, s.id)) }))
    .filter((x): x is { l: Location; s: Service } => Boolean(x.s))
    .slice(0, 6)
  const { t, href } = getI18n()
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold">{settings.businessName}</p>
          <p className="mt-3 text-sm text-muted">{settings.tagline}</p>
          <address className="mt-6 space-y-1 text-sm not-italic text-muted">
            {settings.address?.street && <p>{settings.address.street}</p>}
            <p>
              {[settings.address?.postalCode, settings.address?.city, settings.address?.region !== settings.address?.city && settings.address?.region].filter(Boolean).join(', ')}
            </p>
            <p>
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-fg">
                {settings.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${settings.email}`} className="hover:text-fg">
                {settings.email}
              </a>
            </p>
          </address>
        </div>

        <div>
          <p className="eyebrow mb-4">{t.footer.services}</p>
          <ul className="space-y-1 text-sm [&_a]:inline-block [&_a]:py-1.5">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={href(`/services/${s.slug}`)} className="text-muted hover:text-fg">
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href={href('/pricing')} className="text-muted hover:text-fg">
                {t.footer.pricingLink}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">{t.footer.areas}</p>
          <ul className="space-y-1 text-sm [&_a]:inline-block [&_a]:py-1.5">
            {locations.map((l) => (
              <li key={l.id}>
                <Link href={href(`/locations/${l.slug}`)} className="text-muted hover:text-fg">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
          {popular.length > 0 && (
            <p className="mt-4 text-xs text-muted">
              {t.footer.popular}{' '}
              {popular.map(({ s, l }, i) => (
                <span key={`${s.id}-${l.id}`}>
                  {i > 0 && ' · '}
                  <Link href={href(`/services/${s.slug}/${l.slug}`)} className="hover:text-fg">
                    {fmt(t.common.in, { service: s.title, city: l.name })}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>

        <div>
          <p className="eyebrow mb-4">{t.footer.studio}</p>
          <ul className="space-y-1 text-sm [&_a]:inline-block [&_a]:py-1.5">
            {[
              ['/about', t.footer.about],
              ['/team', t.footer.team],
              ['/portfolio', t.footer.portfolio],
              ['/reviews', t.footer.reviews],
              ['/blog', t.footer.journal],
              ['/faq', t.footer.faq],
              ['/book', t.footer.book],
              ['/client', t.footer.clientLogin],
              ['/privacy', t.footer.privacy],
            ].filter(([path]) => isShown(path, presence)).map(([path, label]) => (
              <li key={path}>
                <Link href={href(path)} className="text-muted hover:text-fg">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          {social.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-3 text-sm">
              {social.map(([name, url]) => (
                <li key={name}>
                  <a href={url as string} rel="noopener me" target="_blank" className="inline-block py-1.5 capitalize text-muted hover:text-accent">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Extra bottom space on phones so the floating WhatsApp button never covers the last lines. */}
      <div className="container-x flex flex-col gap-2 border-t border-line pt-6 pb-24 text-xs text-muted sm:flex-row sm:justify-between">
        <p>
          {fmt(t.footer.copyright, { year: new Date().getFullYear(), name: settings.businessName })}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {settings.googleReviewUrl && (
            <a href={settings.googleReviewUrl} target="_blank" rel="noopener" className="hover:text-fg">
              {t.footer.review}
            </a>
          )}
          <ConsentSettingsButton label={t.consent.settings} />
        </div>
      </div>
    </footer>
  )
}

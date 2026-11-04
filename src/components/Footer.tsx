import Link from 'next/link'

import { fmt } from '@/i18n/config'
import { getI18n } from '@/i18n/server'
import type { Location, Service, SiteSetting } from '@/payload-types'

/**
 * Footer with full NAP (name, address, phone — must match Google Business Profile) and
 * internal links to every service and city page, which helps search engines discover them.
 */
export function Footer({ settings, services, locations }: { settings: SiteSetting; services: Service[]; locations: Location[] }) {
  const social = Object.entries(settings.social ?? {}).filter(([k, v]) => k !== 'id' && typeof v === 'string' && v)
  const primary = locations.find((l) => l.isPrimary) ?? locations[0]
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
              {[settings.address?.postalCode, settings.address?.city, settings.address?.region].filter(Boolean).join(', ')}
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
          <ul className="space-y-1 text-sm [&_a]:inline-block [&_a]:py-1">
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
          <ul className="space-y-1 text-sm [&_a]:inline-block [&_a]:py-1">
            {locations.map((l) => (
              <li key={l.id}>
                <Link href={href(`/locations/${l.slug}`)} className="text-muted hover:text-fg">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
          {primary && services[0] && (
            <p className="mt-4 text-xs text-muted/70">
              {t.footer.popular}{' '}
              {services.slice(0, 3).map((s, i) => (
                <span key={s.id}>
                  {i > 0 && ' · '}
                  <Link href={href(`/services/${s.slug}/${primary.slug}`)} className="hover:text-fg">
                    {fmt(t.common.in, { service: s.title, city: primary.name })}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>

        <div>
          <p className="eyebrow mb-4">{t.footer.studio}</p>
          <ul className="space-y-1 text-sm [&_a]:inline-block [&_a]:py-1">
            {[
              ['/about', t.footer.about],
              ['/portfolio', t.footer.portfolio],
              ['/reviews', t.footer.reviews],
              ['/blog', t.footer.journal],
              ['/faq', t.footer.faq],
              ['/book', t.footer.book],
              ['/client', t.footer.clientLogin],
              ['/privacy', t.footer.privacy],
            ].map(([path, label]) => (
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
                  <a href={url as string} rel="noopener me" target="_blank" className="capitalize text-muted hover:text-accent">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Extra bottom space on phones so the floating WhatsApp button never covers the last lines. */}
      <div className="container-x flex flex-col gap-2 border-t border-line pt-6 pb-24 text-xs text-muted sm:flex-row sm:justify-between sm:pb-6">
        <p>
          {fmt(t.footer.copyright, { year: new Date().getFullYear(), name: settings.businessName })}
        </p>
        {settings.googleReviewUrl && (
          <a href={settings.googleReviewUrl} target="_blank" rel="noopener" className="hover:text-fg">
            {t.footer.review}
          </a>
        )}
      </div>
    </footer>
  )
}

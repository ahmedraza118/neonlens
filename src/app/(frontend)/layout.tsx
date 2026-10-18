import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import type { ReactNode } from 'react'

import { Analytics } from '@/components/Analytics'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { localBusiness, website } from '@/lib/jsonld'
import { aggregateRating, getLocations, getServices, getSettings, getTestimonials } from '@/lib/queries'
import { fallbackOgUrl, ogImageUrl } from '@/lib/seo'
import { absoluteUrl } from '@/lib/utils'

import './globals.css'

// Plus Jakarta Sans (free, Open Font License) — one clean, readable family for everything.
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-jakarta', display: 'swap' })

export const viewport: Viewport = { themeColor: '#fbfaf7', colorScheme: 'light' }

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const og = ogImageUrl(typeof settings.defaultOgImage === 'object' ? settings.defaultOgImage : null) ?? fallbackOgUrl(settings.businessName, settings.tagline)
  return {
    metadataBase: new URL(absoluteUrl('/')),
    title: { default: `${settings.businessName} — ${settings.tagline}`, template: `%s | ${settings.businessName}` },
    description: settings.description,
    applicationName: settings.businessName,
    openGraph: { siteName: settings.businessName, type: 'website', locale: 'en_GB', images: [og] },
    twitter: { card: 'summary_large_image' },
    alternates: { types: { 'application/rss+xml': absoluteUrl('/blog/rss.xml') } },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
  }
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const [settings, services, locations, testimonials] = await Promise.all([getSettings(), getServices(), getLocations(), getTestimonials()])
  const rating = settings.googleRating?.value && settings.googleRating?.count
    ? { value: settings.googleRating.value, count: settings.googleRating.count }
    : aggregateRating(testimonials)

  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        <Header businessName={settings.businessName} />
        <main id="main">{children}</main>
        <Footer settings={settings} services={services} locations={locations} />
        <WhatsAppButton number={settings.whatsapp} businessName={settings.businessName} />
        <JsonLd data={[localBusiness(settings, { locations, services, rating }), website(settings)]} />
        <Analytics />
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { Analytics } from '@/components/Analytics'
import { ChatLauncher } from '@/components/chat/ChatLauncher'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { StayOffers } from '@/components/StayOffers'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { I18nProvider } from '@/i18n/client'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, locales, ogLocale, withLocale } from '@/i18n/config'
import { setRequestLocale } from '@/i18n/server'
import { localBusiness, website } from '@/lib/jsonld'
import { getContentPresence, getLocations, getServices, getSettings } from '@/lib/queries'
import { fallbackOgUrl, ogImageUrl } from '@/lib/seo'
import { absoluteUrl } from '@/lib/utils'

import '../globals.css'

// Plus Jakarta Sans (free, Open Font License) — one clean, readable family for everything.
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-jakarta', display: 'swap' })

// viewport-fit=cover lets fixed elements use env(safe-area-inset-*) on notched iPhones.
export const viewport: Viewport = { themeColor: '#fbfaf7', colorScheme: 'light', viewportFit: 'cover', interactiveWidget: 'resizes-content' }

type Props = { children: ReactNode; params: Promise<{ lang: string }> }

/** Pre-render every page in each language. (No `dynamicParams = false`: it would also apply to
 *  child pages, so content published after a deploy would 404 until the next build.) */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const lang = setRequestLocale((await params).lang)
  const settings = await getSettings()
  const og = ogImageUrl(typeof settings.defaultOgImage === 'object' ? settings.defaultOgImage : null) ?? fallbackOgUrl(settings.businessName, settings.tagline)
  return {
    metadataBase: new URL(absoluteUrl('/')),
    title: { default: `${settings.businessName} — ${settings.tagline}`, template: `%s | ${settings.businessName}` },
    description: settings.description,
    applicationName: settings.businessName,
    openGraph: { siteName: settings.businessName, type: 'website', locale: ogLocale[lang], images: [og] },
    twitter: { card: 'summary_large_image' },
    alternates: { types: { 'application/rss+xml': absoluteUrl(withLocale('/blog/rss.xml', lang)) } },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
    },
    formatDetection: { telephone: true, address: true, email: true },
    category: 'photography',
    // Regional targeting hints (used by Bing and some local directories): Bucharest, Romania.
    other: {
      google: 'notranslate',
      'geo.region': settings.address?.country === 'RO' ? `RO-${/ilfov/i.test(settings.address?.region ?? '') ? 'IF' : 'B'}` : (settings.address?.country ?? ''),
      'geo.placename': settings.address?.city ?? '',
      ...(settings.geo?.lat && settings.geo?.lng
        ? { 'geo.position': `${settings.geo.lat};${settings.geo.lng}`, ICBM: `${settings.geo.lat}, ${settings.geo.lng}` }
        : {}),
    },
  }
}

export default async function FrontendLayout({ children, params }: Props) {
  const raw = (await params).lang
  if (!isLocale(raw)) notFound()
  const lang = setRequestLocale(raw)
  const [settings, services, locations, presence] = await Promise.all([getSettings(), getServices(), getLocations(), getContentPresence()])
  // Structured-data stars only from the real Google rating entered in Business & SEO settings.
  // Ratings computed from the site's own testimonials count as self-serving reviews for Google.
  const rating = settings.googleRating?.value && settings.googleRating?.count
    ? { value: settings.googleRating.value, count: settings.googleRating.count }
    : null

  return (
    // translate="no": the site has its own Romanian and English. Browser translators rewrite the
    // page before React loads, which breaks hydration and undoes the language the visitor picked.
    // suppressHydrationWarning: browser extensions add attributes to these two tags before React
    // loads. It covers only the tags' own attributes, so real mismatches inside the page still show.
    <html lang={lang} translate="no" className={jakarta.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <I18nProvider lang={lang} dict={getDictionary(lang)}>
          <Header businessName={settings.businessName} phone={settings.phone} presence={presence} />
          <main id="main">{children}</main>
          <Footer settings={settings} services={services} locations={locations} presence={presence} />
          <WhatsAppButton number={settings.whatsapp} businessName={settings.businessName} />
          <ChatLauncher hasWhatsApp={Boolean(settings.whatsapp)} />
          <StayOffers hasWhatsApp={Boolean(settings.whatsapp)} />
        <JsonLd data={[localBusiness(settings, { locations, services, rating, lang }), website(settings, lang)]} />
          <Analytics />
        </I18nProvider>
      </body>
    </html>
  )
}

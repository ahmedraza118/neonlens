import type { Metadata } from 'next'

import { defaultLocale, type Locale, locales, ogLocale, withLocale } from '@/i18n/config'
import type { Media } from '@/payload-types'

import { absoluteUrl, isPlaceholderMedia } from './utils'

type SeoGroup = { title?: string | null; description?: string | null; image?: number | Media | null; noIndex?: boolean | null } | null | undefined

type BuildArgs = {
  title: string
  description: string
  /** Internal path (English route names, no language prefix), e.g. '/about'. Pages whose slug is
   *  translated pass one path per language: { ro: '/services/fotograf-nunta', en: '/services/wedding-photography' }. */
  path: string | Record<Locale, string>
  lang: Locale
  image?: Media | null
  seo?: SeoGroup
  type?: 'website' | 'article'
  /** Hide from search results but still follow the links (filtered/duplicate views). */
  noIndexFollow?: boolean
  /** Use `title` as is, without the "| Business name" suffix from the layout template. */
  absoluteTitle?: boolean
  publishedTime?: string
  noIndex?: boolean
  /** The place this page is about (area pages). Replaces the site-wide regional hints, which point at the studio's city. */
  geo?: { placename: string; region?: string | null; lat?: number | null; lng?: number | null }
}

/** Picks the 1200×630 JPEG crop generated for every upload, falling back to the original. */
export function ogImageUrl(media: Media | null | undefined): string | undefined {
  if (!media || isPlaceholderMedia(media)) return undefined
  const url = media.sizes?.og?.url || media.url
  return url ? absoluteUrl(url) : undefined
}

/**
 * Google shows ~155 characters. Longer texts end on their last complete sentence when one fits, so
 * the snippet never reads as cut off; only a single very long sentence is cut at a word, with "…".
 */
export function clampDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const head = clean.slice(0, max + 1)
  const sentenceEnd = Math.max(head.lastIndexOf('. '), head.lastIndexOf('! '), head.lastIndexOf('? '))
  if (sentenceEnd >= 60) return head.slice(0, sentenceEnd + 1)
  const cut = clean.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 100 ? cut.lastIndexOf(' ') : cut.length).replace(/[,;:—–-]+$/, '')}…`
}

/** ISO 3166-2 code for the regional hint: Ilfov County or the city of Bucharest. */
const roRegionCode = (region: string | null | undefined) => `RO-${/ilfov/i.test(region ?? '') ? 'IF' : 'B'}`

const pathFor = (path: BuildArgs['path'], lang: Locale) => (typeof path === 'string' ? path : path[lang])

/** Canonical URL for this language plus hreflang links to every translation (x-default: Romanian). */
export function languageAlternates(path: BuildArgs['path'], lang: Locale) {
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, absoluteUrl(withLocale(pathFor(path, l), l))]))
  languages['x-default'] = languages[defaultLocale]
  return { canonical: absoluteUrl(withLocale(pathFor(path, lang), lang)), languages }
}

export function fallbackOgUrl(title: string, eyebrow?: string): string {
  const params = new URLSearchParams({ title })
  if (eyebrow) params.set('eyebrow', eyebrow)
  return absoluteUrl(`/og?${params.toString()}`)
}

export function buildMetadata({ title, description, path, lang, image, seo, type = 'website', publishedTime, noIndex, absoluteTitle, noIndexFollow, geo }: BuildArgs): Metadata {
  const seoImage = seo?.image && typeof seo.image === 'object' ? seo.image : null
  const finalTitle = seo?.title || title
  const finalDescription = clampDescription(seo?.description || description)
  const ogUrl = ogImageUrl(seoImage ?? image) ?? fallbackOgUrl(finalTitle)
  const hidden = noIndex || seo?.noIndex

  return {
    // A custom SEO title from the CMS is the complete title: no "| Business name" is appended.
    // Long titles drop the brand too: Google cuts titles at ~60 characters, so the keywords stay visible.
    title: absoluteTitle || seo?.title || finalTitle.length > 50 ? { absolute: finalTitle } : finalTitle,
    description: finalDescription,
    // `types` repeats the RSS link here: a page's `alternates` replaces the layout's.
    alternates: { ...languageAlternates(path, lang), types: { 'application/rss+xml': absoluteUrl(withLocale('/blog/rss.xml', lang)) } },
    robots: hidden ? { index: false, follow: false } : noIndexFollow ? { index: false, follow: true } : undefined,
    // A page's `other` replaces the layout's, so the translate hint is repeated here.
    ...(geo
      ? {
          other: {
            google: 'notranslate',
            'geo.region': roRegionCode(geo.region),
            'geo.placename': geo.placename,
            ...(geo.lat && geo.lng ? { 'geo.position': `${geo.lat};${geo.lng}`, ICBM: `${geo.lat}, ${geo.lng}` } : {}),
          },
        }
      : {}),
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: absoluteUrl(withLocale(pathFor(path, lang), lang)),
      type,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      images: [{ url: ogUrl, width: 1200, height: 630, alt: finalTitle }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title: finalTitle, description: finalDescription, images: [ogUrl] },
  }
}

/** Per-language paths for a document with translated slugs: (slugs, s => `/blog/${s}`). */
export function localizedPaths(slugs: Record<Locale, string>, toPath: (slug: string) => string): Record<Locale, string> {
  return Object.fromEntries(locales.map((l) => [l, toPath(slugs[l])])) as Record<Locale, string>
}

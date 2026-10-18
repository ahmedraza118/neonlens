import type { Metadata } from 'next'

import type { Media } from '@/payload-types'

import { absoluteUrl } from './utils'

type SeoGroup = { title?: string | null; description?: string | null; image?: number | Media | null; noIndex?: boolean | null } | null | undefined

type BuildArgs = {
  title: string
  description: string
  path: string
  image?: Media | null
  seo?: SeoGroup
  type?: 'website' | 'article'
  publishedTime?: string
  noIndex?: boolean
}

/** Picks the 1200×630 JPEG crop generated for every upload, falling back to the original. */
export function ogImageUrl(media: Media | null | undefined): string | undefined {
  if (!media) return undefined
  const url = media.sizes?.og?.url || media.url
  return url ? absoluteUrl(url) : undefined
}

/** Text-only branded card for pages without a photo. */
export function fallbackOgUrl(title: string, eyebrow?: string): string {
  const params = new URLSearchParams({ title })
  if (eyebrow) params.set('eyebrow', eyebrow)
  return absoluteUrl(`/og?${params.toString()}`)
}

export function buildMetadata({ title, description, path, image, seo, type = 'website', publishedTime, noIndex }: BuildArgs): Metadata {
  const seoImage = seo?.image && typeof seo.image === 'object' ? seo.image : null
  const finalTitle = seo?.title || title
  const finalDescription = seo?.description || description
  const ogUrl = ogImageUrl(seoImage ?? image) ?? fallbackOgUrl(finalTitle)
  const hidden = noIndex || seo?.noIndex

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: absoluteUrl(path) },
    robots: hidden ? { index: false, follow: false } : undefined,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: absoluteUrl(path),
      type,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: finalTitle }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title: finalTitle, description: finalDescription, images: [ogUrl] },
  }
}

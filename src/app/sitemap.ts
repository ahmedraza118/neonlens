import type { MetadataRoute } from 'next'

import { getLocations, getPosts, getProjects, getServices } from '@/lib/queries'
import { absoluteUrl } from '@/lib/utils'
import type { Media } from '@/payload-types'

export const revalidate = 3600

const img = (m: Media | number | null | undefined) => (m && typeof m === 'object' && m.url ? [absoluteUrl(m.url)] : [])

/** Includes every service × city landing page and image entries for Google Images. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, locations, projects, posts] = await Promise.all([getServices(), getLocations(), getProjects(), getPosts()])
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1, lastModified: now },
    ...['/portfolio', '/services', '/pricing', '/book', '/about', '/contact', '/reviews', '/blog', '/faq', '/locations'].map((p) => ({
      url: absoluteUrl(p),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      lastModified: now,
    })),
    { url: absoluteUrl('/privacy'), changeFrequency: 'yearly', priority: 0.2 },
  ]

  return [
    ...staticPages,
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: s.updatedAt, priority: 0.9, images: img(s.heroImage) })),
    ...services.flatMap((s) =>
      locations.map((l) => ({
        url: absoluteUrl(`/services/${s.slug}/${l.slug}`),
        lastModified: [s.updatedAt, l.updatedAt].sort().at(-1),
        priority: l.isPrimary ? 0.9 : 0.7,
      })),
    ),
    ...locations.map((l) => ({ url: absoluteUrl(`/locations/${l.slug}`), lastModified: l.updatedAt, priority: 0.7, images: img(l.heroImage) })),
    ...projects.map((p) => ({
      url: absoluteUrl(`/portfolio/${p.slug}`),
      lastModified: p.updatedAt,
      priority: 0.7,
      images: [...img(p.coverImage), ...(p.gallery ?? []).flatMap((m) => img(m))].slice(0, 1000),
    })),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.updatedAt, priority: 0.6, images: img(p.coverImage) })),
  ]
}

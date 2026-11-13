import type { MetadataRoute } from 'next'

import { defaultLocale, type Locale, locales, withLocale } from '@/i18n/config'
import { getContentPresence, getLocations, getPosts, getProjects, getServices, getSlugs } from '@/lib/queries'
import { isShown } from '@/lib/site'
import { hasAreaPage } from '@/lib/areas'
import { localizedPaths } from '@/lib/seo'
import { absoluteUrl, isPlaceholderMedia } from '@/lib/utils'
import type { Media } from '@/payload-types'

export const revalidate = 3600

const img = (m: Media | number | null | undefined) => (m && typeof m === 'object' && m.url && !isPlaceholderMedia(m) ? [absoluteUrl(m.url)] : [])

type Entry = Omit<MetadataRoute.Sitemap[number], 'url'> & { path: string | Record<Locale, string> }

/**
 * Every page in every language with its translations (hreflang + x-default → Romanian),
 * including every service × area landing page and image entries for Google Images.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, locations, projects, posts, presence] = await Promise.all([
    getServices(defaultLocale),
    getLocations(defaultLocale),
    getProjects({ locale: defaultLocale }),
    getPosts(1000, defaultLocale),
    getContentPresence(),
  ])
  const slugs = async (collection: Parameters<typeof getSlugs>[0], id: number) => getSlugs(collection, id)
  const [serviceSlugs, locationSlugs, projectSlugs, postSlugs] = await Promise.all([
    Promise.all(services.map((s) => slugs('services', s.id))),
    Promise.all(locations.map((l) => slugs('locations', l.id))),
    Promise.all(projects.map((p) => slugs('projects', p.id))),
    Promise.all(posts.map((p) => slugs('posts', p.id))),
  ])

  const pages: Entry[] = [
    // No lastModified on fixed pages: a date that is always "now" teaches Google to ignore it.
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    ...['/services', '/portfolio', '/pricing', '/book', '/locations', '/about', '/contact', '/reviews', '/blog', '/faq'].filter((path) => isShown(path, presence)).map((path) => ({
      path,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 },
    ...services.map((s, i) => ({
      path: localizedPaths(serviceSlugs[i], (x) => `/services/${x}`),
      lastModified: s.updatedAt,
      priority: 0.9,
      images: img(s.heroImage),
    })),
    // Only the service × area pages that exist (see hasAreaPage).
    ...services.flatMap((s, i) =>
      locations.flatMap((l, j) => (hasAreaPage(l, s.id) ? [{
        path: Object.fromEntries(locales.map((lang) => [lang, `/services/${serviceSlugs[i][lang]}/${locationSlugs[j][lang]}`])) as Record<Locale, string>,
        lastModified: [s.updatedAt, l.updatedAt].sort().at(-1),
        priority: 0.8,
      }] : [])),
    ),
    ...locations.map((l, i) => ({
      path: localizedPaths(locationSlugs[i], (x) => `/locations/${x}`),
      lastModified: l.updatedAt,
      priority: l.isPrimary ? 0.9 : 0.7,
      images: img(l.heroImage),
    })),
    ...projects.map((p, i) => ({
      path: localizedPaths(projectSlugs[i], (x) => `/portfolio/${x}`),
      lastModified: p.updatedAt,
      priority: 0.7,
      images: [...img(p.coverImage), ...(p.gallery ?? []).flatMap((m) => img(m))].slice(0, 1000),
    })),
    ...posts.map((p, i) => ({
      path: localizedPaths(postSlugs[i], (x) => `/blog/${x}`),
      lastModified: p.updatedAt,
      priority: 0.6,
      images: img(p.coverImage),
    })),
  ]

  return pages.flatMap(({ path, ...entry }) => {
    const urlFor = (l: Locale) => absoluteUrl(withLocale(typeof path === 'string' ? path : path[l], l))
    const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, urlFor(l)]))
    languages['x-default'] = urlFor(defaultLocale)
    return locales.map((l) => ({ ...entry, url: urlFor(l), alternates: { languages } }))
  })
}

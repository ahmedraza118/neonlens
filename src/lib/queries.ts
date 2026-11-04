import 'server-only'

import type { DataFromCollectionSlug, Where } from 'payload'
import { cache } from 'react'

import { type Locale, locales, otherLocale } from '@/i18n/config'
import { getRequestLocale } from '@/i18n/server'
import type { Location, Post, Project, Service, SiteSetting, Testimonial } from '@/payload-types'

import { getPayloadClient } from './payload'

export { asMedia, populated } from './populated'

/**
 * Every query reads content in the language of the current request (or `locale`, which is needed
 * outside page rendering: route handlers, generateStaticParams). Fields that have not been
 * translated yet fall back to the other language.
 */
const lang = (locale?: Locale) => {
  const current = locale ?? getRequestLocale()
  return { locale: current, fallbackLocale: otherLocale(current) }
}

/**
 * Fallbacks for a brand-new (empty) database, so the site still builds and renders before the
 * settings have been filled in at /admin → Business & SEO settings.
 */
const SETTINGS_DEFAULTS = {
  businessName: 'Your Studio',
  tagline: 'Photography & videography',
  description: 'Photography and videography studio.',
  email: 'hello@example.com',
  phone: '',
  currency: 'EUR',
}

/** `locale` is only needed outside page rendering (route handlers), where the request locale is unknown. */
export const getSettings = cache(async (locale?: Locale): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'site-settings', depth: 1, ...lang(locale) })
  const filled = Object.fromEntries(
    Object.entries(SETTINGS_DEFAULTS).map(([key, fallback]) => [key, (doc as unknown as Record<string, unknown>)[key] || fallback]),
  )
  return {
    ...doc,
    ...filled,
    address: { ...doc.address, city: doc.address?.city || '', country: doc.address?.country || 'RO' },
  } as SiteSetting
})

export const getHomepage = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'homepage', depth: 2, ...lang() })
})

export const getPricing = cache(async () => {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'pricing', depth: 1, ...lang() })
  return { ...doc, depositPercent: doc.depositPercent ?? 30 }
})

export const getAvailability = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'availability', depth: 0, ...lang() })
})

export const getServices = cache(async (locale?: Locale): Promise<Service[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'services', limit: 100, sort: 'order', depth: 1, ...lang(locale) })
  return res.docs
})

type SluggedCollection = 'services' | 'locations' | 'projects' | 'posts'
const PUBLISHED: Where = { _status: { equals: 'published' } }

/**
 * Finds a document by its URL slug in the current language. Slugs are translated, so when the
 * slug belongs to the other language (or this one has no translation yet) the document is still
 * found; the page then redirects to its proper URL. Returns the doc in the requested language.
 */
async function findBySlug<C extends SluggedCollection>(collection: C, slug: string, depth: number, locale?: Locale, extra: Where[] = []) {
  const payload = await getPayloadClient()
  const current = locale ?? getRequestLocale()
  for (const l of [current, otherLocale(current)]) {
    const res = await payload.find({ collection, where: { and: [{ slug: { equals: slug } }, ...extra] }, limit: 1, depth: 0, locale: l, select: {} })
    const id = (res.docs[0] as { id?: number } | undefined)?.id
    if (id) return payload.findByID({ collection, id, depth, ...lang(current) }) as Promise<DataFromCollectionSlug<C>>
  }
  return null
}

/** The document's slug in every language, e.g. { ro: 'fotograf-nunta', en: 'wedding-photography' }. */
export const getSlugs = cache(async (collection: SluggedCollection, id: number): Promise<Record<Locale, string>> => {
  const payload = await getPayloadClient()
  const doc = await payload.findByID({ collection, id, depth: 0, locale: 'all', select: { slug: true } })
  const slug = (doc as unknown as { slug?: Partial<Record<Locale, string | null>> | string | null }).slug
  const all = typeof slug === 'object' && slug ? slug : {}
  const fallback = (typeof slug === 'string' ? slug : null) ?? all.ro ?? all.en ?? ''
  return Object.fromEntries(locales.map((l) => [l, all[l] || fallback])) as Record<Locale, string>
})

export const getService = cache(async (slug: string, locale?: Locale): Promise<Service | null> => findBySlug('services', slug, 1, locale))

export const getLocations = cache(async (locale?: Locale): Promise<Location[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'locations', limit: 100, sort: '-isPrimary', depth: 1, ...lang(locale) })
  return res.docs
})

export const getLocation = cache(async (slug: string): Promise<Location | null> => findBySlug('locations', slug, 1))

type ProjectFilter = { serviceId?: number; locationId?: number; featured?: boolean; limit?: number; exclude?: number; locale?: Locale }

export const getProjects = cache(async (filter: ProjectFilter = {}): Promise<Project[]> => {
  const payload = await getPayloadClient()
  const and: Where[] = [
    PUBLISHED,
    ...(filter.serviceId ? [{ service: { equals: filter.serviceId } }] : []),
    ...(filter.locationId ? [{ location: { equals: filter.locationId } }] : []),
    ...(filter.featured ? [{ featured: { equals: true } }] : []),
    ...(filter.exclude ? [{ id: { not_equals: filter.exclude } }] : []),
  ]
  const res = await payload.find({
    collection: 'projects',
    where: { and },
    limit: filter.limit ?? 100,
    sort: '-date',
    depth: 1,
    ...lang(filter.locale),
  })
  return res.docs
})

export const getProject = cache(async (slug: string): Promise<Project | null> => findBySlug('projects', slug, 2, undefined, [PUBLISHED]))

export const getPosts = cache(async (limit = 100, locale?: Locale): Promise<Post[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'posts',
    where: PUBLISHED,
    limit,
    sort: '-publishedAt',
    depth: 1,
    ...lang(locale),
  })
  return res.docs
})

export const getPost = cache(async (slug: string): Promise<Post | null> => findBySlug('posts', slug, 2, undefined, [PUBLISHED]))

export const getTestimonials = cache(async (opts: { serviceId?: number; featured?: boolean } = {}): Promise<Testimonial[]> => {
  const payload = await getPayloadClient()
  const and: Where[] = [
    ...(opts.serviceId ? [{ service: { equals: opts.serviceId } }] : []),
    ...(opts.featured ? [{ featured: { equals: true } }] : []),
  ]
  const res = await payload.find({
    collection: 'testimonials',
    where: and.length ? { and } : undefined,
    limit: 50,
    sort: '-date',
    depth: 0,
    ...lang(),
  })
  return res.docs
})

/** Aggregate rating across site testimonials (used when no Google rating is configured). */
export function aggregateRating(testimonials: Testimonial[]) {
  if (testimonials.length === 0) return null
  const total = testimonials.reduce((sum, t) => sum + t.rating, 0)
  return { value: Math.round((total / testimonials.length) * 10) / 10, count: testimonials.length }
}

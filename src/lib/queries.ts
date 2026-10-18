import 'server-only'

import type { Where } from 'payload'
import { cache } from 'react'

import type { Location, Post, Project, Service, SiteSetting, Testimonial } from '@/payload-types'

import { getPayloadClient } from './payload'

export { asMedia, populated } from './populated'

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

export const getSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
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
  return payload.findGlobal({ slug: 'homepage', depth: 2 })
})

export const getPricing = cache(async () => {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'pricing', depth: 1 })
  return { ...doc, depositPercent: doc.depositPercent ?? 30 }
})

export const getAvailability = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'availability', depth: 0 })
})

export const getServices = cache(async (): Promise<Service[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'services', limit: 100, sort: 'order', depth: 1 })
  return res.docs
})

export const getService = cache(async (slug: string): Promise<Service | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return res.docs[0] ?? null
})

export const getLocations = cache(async (): Promise<Location[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'locations', limit: 100, sort: '-isPrimary', depth: 1 })
  return res.docs
})

export const getLocation = cache(async (slug: string): Promise<Location | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'locations', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return res.docs[0] ?? null
})

type ProjectFilter = { serviceId?: number; locationId?: number; featured?: boolean; limit?: number; exclude?: number }

export const getProjects = cache(async (filter: ProjectFilter = {}): Promise<Project[]> => {
  const payload = await getPayloadClient()
  const and: Where[] = [
    { _status: { equals: 'published' } },
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
  })
  return res.docs
})

export const getProject = cache(async (slug: string): Promise<Project | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'projects',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
})

export const getPosts = cache(async (limit = 100): Promise<Post[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit,
    sort: '-publishedAt',
    depth: 1,
  })
  return res.docs
})

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
})

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
  })
  return res.docs
})

/** Aggregate rating across site testimonials (used when no Google rating is configured). */
export function aggregateRating(testimonials: Testimonial[]) {
  if (testimonials.length === 0) return null
  const total = testimonials.reduce((sum, t) => sum + t.rating, 0)
  return { value: Math.round((total / testimonials.length) * 10) / 10, count: testimonials.length }
}

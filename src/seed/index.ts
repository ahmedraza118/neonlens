/**
 * Seeds the CMS with demo content: `npm run seed`
 *
 * ⚠️  Destructive: it deletes existing content (projects, services, posts, media, galleries…) first.
 * Placeholder photos are downloaded from picsum.photos — replace them with your own work.
 */
import config from '@payload-config'
import { sql } from '@payloadcms/db-sqlite'
import { getPayload, type Payload } from 'payload'

import { slugify } from '@/lib/utils'
import type { Media } from '@/payload-types'

import * as data from './data'
import { markdownToLexical } from './lexical'

const ctx = { disableRevalidate: true }

async function download(seed: string, width: number, height: number): Promise<Buffer> {
  const url = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return Buffer.from(await res.arrayBuffer())
    } catch (err) {
      if (attempt === 3) throw new Error(`Could not download ${url}: ${(err as Error).message}`)
      await new Promise((r) => setTimeout(r, 1000 * attempt))
    }
  }
  throw new Error('unreachable')
}

/**
 * Saves uploads one at a time. Payload picks a free filename by checking the database first, so
 * parallel uploads to a remote database (Turso) can both claim the same name and fail.
 */
let uploadQueue: Promise<unknown> = Promise.resolve()
function oneAtATime<T>(task: () => Promise<T>): Promise<T> {
  const run = uploadQueue.then(task, task)
  uploadQueue = run.catch(() => undefined)
  return run
}

async function image(payload: Payload, seed: string, alt: string, size: [number, number] = [2000, 1333], extra: Partial<Media> = {}) {
  const buffer = await download(`neonlens-${seed}`, size[0], size[1])
  return oneAtATime(() =>
    payload.create({
      collection: 'media',
      context: ctx,
      data: { alt, altNeedsReview: true, ...extra },
      file: { data: buffer, mimetype: 'image/jpeg', name: `${slugify(alt).slice(0, 55)}-${slugify(seed)}.jpg`, size: buffer.length },
    }),
  )
}

/** Runs async jobs with limited concurrency so we don't hammer the image service. */
async function pool<T, R>(items: readonly T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++
        results[i] = await fn(items[i], i)
      }
    }),
  )
  return results
}

async function wipe(payload: Payload) {
  // Globals point at services and media through required fields, which blocks deleting those.
  // Remove the global rows first (their child tables cascade); the seed recreates them below.
  for (const table of ['site_settings', 'homepage', 'pricing', 'availability']) {
    await payload.db.drizzle.run(sql.raw(`DELETE FROM "${table}"`))
  }
  const order = ['client-media', 'client-galleries', 'projects', 'posts', 'testimonials', 'locations', 'services', 'inquiries', 'bookings', 'media'] as const
  for (const collection of order) {
    const res = await payload.delete({ collection, where: { id: { exists: true } }, context: ctx, overrideAccess: true })
    if (res.errors.length > 0) {
      throw new Error(`Could not clear "${collection}": ${res.errors[0].message}`)
    }
  }
}

async function seed() {
  if (process.env.NODE_ENV === 'production' && !process.env.SEED_FORCE) {
    throw new Error('Refusing to seed in production. Set SEED_FORCE=1 if you really mean it.')
  }
  const dbUrl = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || ''
  const remoteDb = dbUrl.startsWith('libsql:') || dbUrl.startsWith('https:')
  if (remoteDb && process.env.PAYLOAD_MIGRATING !== 'true') {
    throw new Error('Seeding a remote database: use `npm run seed:prod` so the schema is not switched to development mode.')
  }
  if (remoteDb && !process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Set BLOB_READ_WRITE_TOKEN (Vercel → Storage → Blob → .env.local tab) so photos are uploaded to Vercel Blob, not your disk.')
  }

  const payload = await getPayload({ config })
  const log = (msg: string) => payload.logger.info(`🌱 ${msg}`)

  log('Clearing existing content…')
  await wipe(payload)

  // Admin user
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (email && password) {
    const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
    if (existing.docs.length === 0) {
      await payload.create({ collection: 'users', data: { email, password, name: 'Studio Admin' } })
      log(`Created admin user ${email} (password from SEED_ADMIN_PASSWORD in .env)`)
    }
  }

  log('Downloading placeholder photos (≈90 images, takes a minute)…')

  // Services
  const serviceIds: Record<string, number> = {}
  const serviceDocs = await pool(data.services, 3, async (s) => {
    const hero = await image(payload, `svc-${s.key}`, `${s.title} by NeonLens Studio in Cluj-Napoca`)
    return payload.create({
      collection: 'services',
      context: ctx,
      data: {
        title: s.title,
        category: s.category,
        order: s.order,
        tagline: s.tagline,
        excerpt: s.excerpt,
        intro: s.intro,
        heroImage: hero.id,
        highlights: s.highlights.map((h) => ({ ...h })),
        process: s.process.map((p) => ({ ...p })),
        startingPrice: s.startingPrice,
        packages: s.packages.map((p) => ({ ...p, includes: [...p.includes] })),
        faqs: s.faqs.map((f) => ({ ...f })),
        keywords: [...s.keywords],
        video: { provider: 'none' },
      },
    })
  })
  data.services.forEach((s, i) => (serviceIds[s.key] = serviceDocs[i].id))
  log(`Created ${serviceDocs.length} services`)

  // Locations
  const locationIds: Record<string, number> = {}
  const locationDocs = await pool(data.locations, 3, async (l) => {
    const hero = await image(payload, `loc-${l.key}`, `Photography and videography in ${l.name}, ${l.region}`)
    return payload.create({
      collection: 'locations',
      context: ctx,
      data: {
        name: l.name,
        region: l.region,
        isPrimary: l.isPrimary,
        travelFee: l.travelFee,
        geo: { ...l.geo },
        intro: l.intro,
        heroImage: hero.id,
        venues: l.venues.map((v) => ({ ...v })),
        nearbyAreas: [...l.nearbyAreas],
        faqs: l.faqs.map((f) => ({ ...f })),
      },
    })
  })
  data.locations.forEach((l, i) => (locationIds[l.key] = locationDocs[i].id))
  log(`Created ${locationDocs.length} locations`)

  // Testimonials
  const testimonialIds: Record<string, number> = {}
  for (const [i, t] of data.testimonials.entries()) {
    const doc = await payload.create({
      collection: 'testimonials',
      context: ctx,
      data: {
        name: t.name,
        role: t.role,
        quote: t.quote,
        rating: t.rating,
        featured: t.featured,
        service: serviceIds[t.service],
        source: 'direct',
        date: new Date(Date.UTC(2026, 8 - i, 10)).toISOString(),
      },
    })
    testimonialIds[t.key] = doc.id
  }
  log(`Created ${data.testimonials.length} testimonials`)

  // Projects
  const projectDocs = await pool(data.projects, 2, async (p) => {
    const locName = data.locations.find((l) => l.key === p.location)?.name ?? ''
    const svcName = data.services.find((s) => s.key === p.service)?.title ?? ''
    const cover = await image(payload, `prj-${p.key}-cover`, `${p.title.split('—')[0].trim()} — ${svcName.toLowerCase()} at ${p.venue}`, [1600, 2000])
    const gallery = await pool([0, 1, 2, 3, 4, 5], 3, (n) =>
      image(payload, `prj-${p.key}-${n}`, `${svcName} in ${locName}: ${p.tags[n % p.tags.length]} moment at ${p.venue} (${n + 1})`, n % 3 === 1 ? [1400, 2100] : [2100, 1400]),
    )
    return payload.create({
      collection: 'projects',
      context: ctx,
      draft: false,
      data: {
        _status: 'published',
        title: p.title,
        service: serviceIds[p.service],
        location: locationIds[p.location],
        venue: p.venue,
        clientType: p.clientType,
        date: new Date(p.date).toISOString(),
        featured: p.featured,
        excerpt: p.excerpt,
        brief: p.brief,
        approach: markdownToLexical(p.approach),
        result: p.result,
        deliverables: [...p.deliverables],
        tags: [...p.tags],
        coverImage: cover.id,
        gallery: gallery.map((g) => g.id),
        testimonial: p.testimonial ? testimonialIds[p.testimonial] : undefined,
        video: { provider: 'none' },
      },
    })
  })
  log(`Created ${projectDocs.length} projects`)

  // Posts
  const postDocs = await pool(data.posts, 3, async (p) => {
    const cover = await image(payload, `post-${p.key}`, p.title.replace(/\?.*$/, ''))
    return payload.create({
      collection: 'posts',
      context: ctx,
      draft: false,
      data: {
        _status: 'published',
        title: p.title,
        category: p.category,
        publishedAt: new Date(p.publishedAt).toISOString(),
        excerpt: p.excerpt,
        coverImage: cover.id,
        content: markdownToLexical(p.content),
        relatedServices: p.services.map((k) => serviceIds[k]),
        relatedLocation: p.location ? locationIds[p.location] : undefined,
        faqs: p.faqs.map((f) => ({ ...f })),
        author: 'NeonLens Studio',
      },
    })
  })
  log(`Created ${postDocs.length} blog posts`)

  // Globals
  const [heroImage, aboutImage, ogImage] = await Promise.all([
    image(payload, 'home-hero', 'Couple walking through Transylvanian hills at sunset, wedding photography Cluj-Napoca', [2400, 1600]),
    image(payload, 'about', 'The NeonLens Studio team with cameras in Cluj-Napoca', [1600, 2000]),
    image(payload, 'og-default', 'NeonLens Studio — wedding and brand photography and film', [1200, 630]),
  ])

  await payload.updateGlobal({
    slug: 'site-settings',
    context: ctx,
    data: {
      ...data.settings,
      openingHours: data.settings.openingHours.map((o) => ({ ...o, days: [...o.days] })),
      stats: data.settings.stats.map((s) => ({ ...s })),
      generalFaqs: data.settings.generalFaqs.map((f) => ({ ...f })),
      about: { ...data.settings.about, image: aboutImage.id },
      defaultOgImage: ogImage.id,
      social: { ...data.settings.social },
    },
  })

  await payload.updateGlobal({
    slug: 'homepage',
    context: ctx,
    data: {
      ...data.homepage,
      heroImage: heroImage.id,
      process: data.homepage.process.map((p) => ({ ...p })),
      featuredProjects: projectDocs.filter((p) => p.featured).slice(0, 6).map((p) => p.id),
    },
  })

  await payload.updateGlobal({
    slug: 'pricing',
    context: ctx,
    data: {
      depositPercent: data.pricing.depositPercent,
      estimateSpreadPercent: data.pricing.estimateSpreadPercent,
      rates: data.pricing.rates.map((r) => ({ ...r, service: serviceIds[r.service] })),
      addOns: data.pricing.addOns.map((a) => ({ ...a, services: a.services.map((k) => serviceIds[k]) })),
    },
  })

  const today = new Date()
  const blocked = [21, 35, 36, 49, 63].map((d) => {
    const date = new Date(today)
    date.setUTCDate(date.getUTCDate() + d)
    return { date: date.toISOString(), reason: 'Booked (demo)' }
  })
  await payload.updateGlobal({
    slug: 'availability',
    context: ctx,
    data: { bookingWindowDays: 540, minNoticeDays: 7, blockedDates: blocked },
  })
  log('Updated globals')

  // Demo client gallery
  const galleryPassword = process.env.SEED_GALLERY_PASSWORD
  if (galleryPassword) {
    const gallery = await payload.create({
      collection: 'client-galleries',
      context: ctx,
      data: {
        title: 'Ana & Mihai — Wedding proofing',
        slug: 'demo-wedding',
        clientName: 'Ana & Mihai',
        clientEmail: 'ana.mihai@example.com',
        newPassword: galleryPassword,
        status: 'proofing',
        selectionLimit: 30,
        allowDownloads: true,
        eventDate: new Date('2026-06-14').toISOString(),
        message: 'Hi both! Here is your full gallery. Tap ♥ on the photos you want in your album (up to 30), add any notes, then press Submit.',
      },
    })
    await pool(Array.from({ length: 12 }, (_, i) => i), 4, async (i) => {
      const buffer = await download(`neonlens-client-${i}`, i % 3 === 0 ? 1400 : 2100, i % 3 === 0 ? 2100 : 1400)
      return oneAtATime(() =>
        payload.create({
          collection: 'client-media',
          context: ctx,
          data: { gallery: gallery.id },
          file: { data: buffer, mimetype: 'image/jpeg', name: `ana-mihai-wedding-${String(i + 1).padStart(3, '0')}.jpg`, size: buffer.length },
        }),
      )
    })
    log('Created demo client gallery at /client/demo-wedding (password: SEED_GALLERY_PASSWORD in .env)')
  }

  log('Done ✨  Run `npm run dev` and open http://localhost:3000')
}

try {
  await seed()
  process.exit(0)
} catch (err) {
  console.error(err)
  process.exit(1)
}

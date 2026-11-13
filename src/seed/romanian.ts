/**
 * Fills the Romanian ("ro") version of the demo content from data.ro.ts — text, Romanian URL
 * slugs and SEO titles — matching documents by their English slugs from data.ts. Nothing is deleted: only the Romanian text of existing documents
 * is written, so it is safe to run on a database that was seeded earlier (`npm run seed:ro`).
 *
 * Array rows (packages, FAQs, highlights…) keep their ids and non-translated values (prices,
 * hours, links); only the translated fields change.
 */
import type { DataFromCollectionSlug, Payload } from 'payload'

import * as en from './data'
import * as ro from './data.ro'
import { markdownToLexical } from './lexical'

// Spread into every call (`{ ...ctx }`), never shared: the cloud-storage plugin keeps the file being
// uploaded on the context object, so one shared object made every upload after the first one skip Blob.
const ctx = { disableRevalidate: true }
const locale = 'ro' as const

type Row = { id?: string | null } & Record<string, unknown>

/** Existing rows with the translated fields of the matching Romanian row laid over them. */
function merge<T extends Row>(existing: T[] | null | undefined, translated: ReadonlyArray<Record<string, unknown>>, fields: string[]): T[] {
  return (existing ?? []).map((row, i) => {
    const next: Record<string, unknown> = { ...row }
    for (const f of fields) {
      const value = translated[i]?.[f]
      if (value !== undefined) next[f] = Array.isArray(value) ? [...value] : value
    }
    return next as T
  })
}

async function findBySlug<C extends 'services' | 'locations' | 'projects' | 'posts'>(payload: Payload, collection: C, slug: string) {
  const res = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0, locale: 'en', draft: false })
  return (res.docs[0] ?? null) as DataFromCollectionSlug<C> | null
}

export async function applyRomanian(
  payload: Payload,
  log: (msg: string) => void = (m) => payload.logger.info(m),
  // The launch seed replaces the demo "about" story with the real one from business.ts.
  about: { heading: string; body: string } = ro.settings.about,
) {
  let count = 0

  for (const [i, s] of en.services.entries()) {
    const t = ro.services[i]
    const doc = await findBySlug(payload, 'services', s.slug)
    if (!doc) continue
    await payload.update({
      collection: 'services',
      id: doc.id,
      locale,
      context: { ...ctx },
      data: {
        title: t.title,
        slug: t.slug,
        seo: { ...doc.seo, title: t.seo.title, description: t.seo.description },
        tagline: t.tagline,
        excerpt: t.excerpt,
        intro: t.intro,
        highlights: merge(doc.highlights, t.highlights, ['title', 'description']),
        process: merge(doc.process, t.process, ['title', 'description']),
        packages: merge(doc.packages, t.packages, ['name', 'description', 'includes']),
        faqs: merge(doc.faqs, t.faqs, ['question', 'answer']),
      },
    })
    count++
  }

  for (const [i, l] of en.locations.entries()) {
    const t = ro.locations[i]
    const doc = await findBySlug(payload, 'locations', l.slug)
    if (!doc) continue
    await payload.update({
      collection: 'locations',
      id: doc.id,
      locale,
      context: { ...ctx },
      data: {
        name: t.name,
        slug: t.slug,
        region: t.region,
        intro: t.intro,
        venues: merge(doc.venues, t.venues, ['name', 'description']),
        serviceNotes: merge(doc.serviceNotes, t.serviceNotes, ['content']),
        nearbyAreas: [...t.nearbyAreas],
        faqs: merge(doc.faqs, t.faqs, ['question', 'answer']),
      },
    })
    count++
  }

  for (const [i, tm] of en.testimonials.entries()) {
    const t = ro.testimonials[i]
    const res = await payload.find({ collection: 'testimonials', where: { name: { equals: tm.name } }, limit: 1, depth: 0 })
    const doc = res.docs[0]
    if (!doc) continue
    await payload.update({ collection: 'testimonials', id: doc.id, locale, context: { ...ctx }, data: { quote: t.quote, role: t.role } })
    count++
  }

  for (const [i, p] of en.projects.entries()) {
    const t = ro.projects[i]
    const doc = await findBySlug(payload, 'projects', p.slug)
    if (!doc) continue
    await payload.update({
      collection: 'projects',
      id: doc.id,
      locale,
      context: { ...ctx },
      data: {
        _status: 'published',
        title: t.title,
        slug: t.slug,
        excerpt: t.excerpt,
        brief: t.brief,
        approach: markdownToLexical(t.approach),
        result: t.result,
        clientType: t.clientType,
        venue: t.venue,
        deliverables: [...t.deliverables],
      },
    })
    count++
  }

  for (const [i, p] of en.posts.entries()) {
    const t = ro.posts[i]
    const doc = await findBySlug(payload, 'posts', p.slug)
    if (!doc) continue
    await payload.update({
      collection: 'posts',
      id: doc.id,
      locale,
      context: { ...ctx },
      data: {
        _status: 'published',
        title: t.title,
        slug: t.slug,
        excerpt: t.excerpt,
        content: markdownToLexical(t.content),
        faqs: merge(doc.faqs, t.faqs, ['question', 'answer']),
      },
    })
    count++
  }

  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0, locale: 'en' })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale,
    context: { ...ctx },
    data: {
      tagline: ro.settings.tagline,
      description: ro.settings.description,
      about: { ...settings.about, heading: about.heading, body: about.body, founderRole: settings.about?.founderName ? ro.settings.about.founderRole : undefined },
      stats: merge(settings.stats, ro.settings.stats, ['value', 'label']),
      generalFaqs: merge(settings.generalFaqs, ro.settings.generalFaqs, ['question', 'answer']),
    },
  })

  const home = await payload.findGlobal({ slug: 'homepage', depth: 0, locale: 'en' })
  await payload.updateGlobal({
    slug: 'homepage',
    locale,
    context: { ...ctx },
    data: {
      heroEyebrow: ro.homepage.heroEyebrow,
      heroHeading: ro.homepage.heroHeading,
      heroSubheading: ro.homepage.heroSubheading,
      process: merge(home.process, ro.homepage.process, ['title', 'description']),
    },
  })

  const pricing = await payload.findGlobal({ slug: 'pricing', depth: 0, locale: 'en' })
  await payload.updateGlobal({
    slug: 'pricing',
    locale,
    context: { ...ctx },
    data: { addOns: merge(pricing.addOns, ro.pricing.addOns, ['name', 'description']) },
  })

  log(`🇷🇴 Romanian text added to ${count} documents and the site settings, homepage and pricing`)
}

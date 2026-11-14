/**
 * One-off content corrections from the 14 Nov 2026 SEO audit. Safe to re-run: each step only
 * touches documents that still have the old value.
 *
 *   npm run seo:content-fixes
 *
 * 1. Blog posts dated before the site existed get the launch date (Google distrusts a
 *    datePublished older than the first time it saw the page).
 * 2. The christening service repeated a general FAQ question with a different answer; it gets its
 *    own wording so the FAQ page never lists the same question twice.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const LAUNCH = '2026-11-13T09:00:00.000Z'
const payload = await getPayload({ config })
const ctx = { disableRevalidate: true }

const posts = await payload.find({ collection: 'posts', where: { publishedAt: { less_than: LAUNCH } }, limit: 100, depth: 0 })
for (const post of posts.docs) {
  await payload.update({ collection: 'posts', id: post.id, context: { ...ctx }, data: { publishedAt: LAUNCH } })
}
console.log(`Blog posts re-dated to ${LAUNCH.slice(0, 10)}: ${posts.docs.length}`)

const renames = {
  ro: ['Când primim fotografiile și filmul?', 'Când primim fotografiile și filmul de la botez?'],
  en: ['When will we receive the photos and the film?', 'When will we receive the christening photos and film?'],
} as const

const christening = (await payload.find({ collection: 'services', where: { slug: { equals: 'fotograf-botez' } }, locale: 'ro', limit: 1, depth: 0 })).docs[0]
if (!christening) {
  console.log('Christening service not found: FAQ left as is.')
} else {
  for (const locale of ['ro', 'en'] as const) {
    const [from, to] = renames[locale]
    const doc = await payload.findByID({ collection: 'services', id: christening.id, locale, depth: 0 })
    const faqs = doc.faqs ?? []
    if (!faqs.some((f) => f.question === from)) {
      console.log(`FAQ (${locale}): already fixed.`)
      continue
    }
    await payload.update({
      collection: 'services',
      id: christening.id,
      locale,
      context: { ...ctx },
      data: { faqs: faqs.map((f) => (f.question === from ? { ...f, question: to } : f)) },
    })
    console.log(`FAQ (${locale}): renamed to "${to}"`)
  }
}

process.exit(0)

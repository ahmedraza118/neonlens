/**
 * AI alt text, captions and tags for the media library: `npm run alt-text`
 *
 *   npm run alt-text           → images that have no tags yet
 *   npm run alt-text -- --all  → every image (overwrites alt/caption/tags)
 *
 * Each image is downscaled to 1024px and sent to Claude, which returns descriptive, location-aware
 * alt text. Results are marked "altNeedsReview" so a human can check them in the admin.
 * Needs ANTHROPIC_API_KEY (or an `ant auth login` profile).
 */
import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import config from '@payload-config'
import fs from 'fs/promises'
import path from 'path'
import { getPayload } from 'payload'
import sharp from 'sharp'
import { z } from 'zod'

import type { Media } from '@/payload-types'

// Romanian is the site's main language; English is the second version of each text.
const ImageSeo = z.object({
  altRo: z.string().describe('Romanian alt text (with diacritics), max 125 characters: what is in the photo and where.'),
  altEn: z.string().describe('The same alt text in English.'),
  captionRo: z.string().describe('One short, natural Romanian caption for display under the photo.'),
  captionEn: z.string().describe('The same caption in English.'),
  tags: z.array(z.string()).describe('5-8 lowercase search keywords, mostly Romanian as people search in Bucharest.'),
})

async function loadImage(doc: Media): Promise<Buffer> {
  const local = path.resolve(process.cwd(), 'media', doc.filename ?? '')
  const raw = await fs.readFile(local).catch(async () => {
    // Remote storage (e.g. Vercel Blob): fetch through the public site.
    const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const res = await fetch(new URL(doc.url!, base))
    if (!res.ok) throw new Error(`Could not load ${doc.url}: HTTP ${res.status}`)
    return Buffer.from(await res.arrayBuffer())
  })
  // Smaller image = fewer input tokens; 1024px is plenty to describe a photo.
  return sharp(raw).resize({ width: 1024, height: 1024, fit: 'inside' }).jpeg({ quality: 80 }).toBuffer()
}

async function run() {
  const all = process.argv.includes('--all')
  const payload = await getPayload({ config })
  const client = new Anthropic()
  const settings = await payload.findGlobal({ slug: 'site-settings', locale: 'en' })

  const { docs } = await payload.find({
    collection: 'media',
    where: all ? undefined : { tags: { exists: false } },
    limit: 1000,
    depth: 0,
    locale: 'en',
  })
  payload.logger.info(`Generating alt text for ${docs.length} image(s)…`)

  let done = 0
  for (const doc of docs) {
    try {
      const image = await loadImage(doc)
      const response = await client.messages.parse({
        model: 'claude-opus-5-5',
        max_tokens: 2000,
        // Describing a photo is a simple task, so low effort keeps it fast and cheap.
        output_config: { effort: 'low', format: zodOutputFormat(ImageSeo) },
        system: `You write image SEO metadata for ${settings.businessName}, a photography and videography studio in ${settings.address?.city} serving Bucharest and Ilfov county, Romania. Describe only what is visible. Use the existing description for facts you cannot see (venue, city, people's roles) but never invent names or places.`,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image.toString('base64') } },
              { type: 'text', text: `Existing description: "${doc.alt}"\n\nWrite Romanian and English alt text, captions and tags for this photo.` },
            ],
          },
        ],
      })

      if (response.stop_reason === 'refusal' || !response.parsed_output) {
        payload.logger.warn(`Skipped ${doc.filename} (stop reason: ${response.stop_reason})`)
        continue
      }
      const { altRo, altEn, captionRo, captionEn, tags } = response.parsed_output
      const keepCaption = !all && Boolean(doc.caption)
      for (const [locale, alt, caption] of [
        ['ro', altRo, captionRo],
        ['en', altEn, captionEn],
      ] as const) {
        await payload.update({
          collection: 'media',
          id: doc.id,
          locale,
          context: { disableRevalidate: true },
          data: {
            alt: alt.slice(0, 160),
            ...(keepCaption ? {} : { caption }),
            tags: tags.map((t) => t.toLowerCase().trim()).filter(Boolean).slice(0, 10),
            altNeedsReview: true,
          },
        })
      }
      done++
      payload.logger.info(`✓ ${doc.filename}: ${altRo}`)
    } catch (err) {
      if (err instanceof Anthropic.AuthenticationError) {
        throw new Error('No valid Anthropic credentials. Set ANTHROPIC_API_KEY in .env.')
      }
      if (err instanceof Anthropic.RateLimitError) {
        payload.logger.warn('Rate limited — waiting 30s')
        await new Promise((r) => setTimeout(r, 30_000))
        continue
      }
      payload.logger.error(`✗ ${doc.filename}: ${(err as Error).message}`)
    }
  }
  payload.logger.info(`Done: ${done}/${docs.length} updated. Review them in Admin → Media (filter "altNeedsReview").`)
}

try {
  await run()
  process.exit(0)
} catch (err) {
  console.error(err)
  process.exit(1)
}

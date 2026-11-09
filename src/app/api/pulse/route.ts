import { after } from 'next/server'
import { z } from 'zod'

import { channelFrom, cleanPath, deviceFrom, isBot, isEventType, referrerHost } from '@/lib/analytics-core'
import { clientIp, dailyVisitorHash, isSameOrigin, rateLimit } from '@/lib/request-guard'
import { getPayloadClient } from '@/lib/payload'

const MAX_BODY = 8_000

const eventSchema = z.object({
  t: z.string().refine(isEventType),
  p: z.string().max(300),
  v: z.number().finite().optional(),
  l: z.string().max(80).optional(),
})
const bodySchema = z.object({
  e: z.array(eventSchema).min(1).max(20),
  /** Page-load context, sent with every batch. */
  r: z.string().max(500).optional(),
  u: z.record(z.string(), z.string().max(100)).optional(),
  lang: z.string().max(5).optional(),
  /** Long-lived visitor id: only present after the visitor accepted analytics. */
  id: z.string().max(40).optional(),
})

/**
 * Receives page and interaction events from the site's own tracker. Cookie-free by default: the
 * raw IP address is only hashed (with a salt that changes daily) and never stored. Bots and logged
 * in studio staff are ignored, so your own visits do not distort the numbers.
 */
export async function POST(req: Request) {
  const ua = req.headers.get('user-agent')
  const host = req.headers.get('host')
  if (!isSameOrigin(req)) return new Response(null, { status: 403 })
  if (isBot(ua) || (req.headers.get('cookie') ?? '').includes('payload-token=')) return new Response(null, { status: 204 })

  const ip = clientIp(req)
  if (!rateLimit(`pulse:${ip}`, 300, 60 * 60 * 1000)) return new Response(null, { status: 429 })

  const raw = await req.text()
  if (raw.length > MAX_BODY) return new Response(null, { status: 413 })
  let parsed
  try {
    parsed = bodySchema.safeParse(JSON.parse(raw))
  } catch {
    return new Response(null, { status: 400 })
  }
  if (!parsed.success) return new Response(null, { status: 400 })
  const { e: events, r, u, lang, id } = parsed.data

  const session = dailyVisitorHash(ip, ua as string)
  const refHost = referrerHost(r, host)
  const context = {
    session,
    visitor: id,
    channel: channelFrom({ utmSource: u?.utm_source, utmMedium: u?.utm_medium, referrerHost: refHost }),
    source: u?.utm_source ?? refHost ?? undefined,
    campaign: u?.utm_campaign,
    referrer: refHost ?? undefined,
    device: deviceFrom(ua as string),
    locale: lang,
    country: req.headers.get('x-vercel-ip-country') ?? undefined,
  }

  // Reply at once; the visitor's page never waits for the database.
  after(async () => {
    const payload = await getPayloadClient()
    await Promise.allSettled(
      events.map(async (ev) => {
        const path = cleanPath(ev.p)
        if (!path) return
        await payload.create({
          collection: 'analytics-events',
          data: { ...context, type: ev.t as never, path, value: ev.v, label: ev.l },
        })
      }),
    )
  })
  return new Response(null, { status: 204 })
}

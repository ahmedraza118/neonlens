import { z } from 'zod'

import { toLocale } from '@/i18n/config'
import { createLead } from '@/lib/leads'
import { getPayloadClient } from '@/lib/payload'
import { clientIp, isSameOrigin, rateLimit } from '@/lib/request-guard'

const schema = z.object({
  token: z.string().regex(/^[a-f0-9]{48}$/),
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  phone: z.string().trim().max(40).optional(),
  service: z.string().trim().max(120).optional(),
  eventDate: z.string().trim().max(20).optional(),
  location: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
  lang: z.string().max(5).optional(),
  page: z.string().max(300).optional(),
  company_website: z.string().max(200).optional(),
})

/** The chat's contact form: only the visitor's own submission can create a lead. */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return Response.json({ ok: false }, { status: 403 })
  if (!rateLimit(`chat-lead:${clientIp(req)}`, 5, 60 * 60 * 1000)) return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 })

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ ok: false, errors: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), true])) }, { status: 400 })
  const { token, lang: rawLang, page, company_website: honeypot, ...details } = parsed.data
  // Bots that fill the hidden field get a normal-looking reply and create nothing.
  if (honeypot) return Response.json({ ok: true })

  const payload = await getPayloadClient()
  const chat = (await payload.find({ collection: 'chat-conversations', where: { token: { equals: token } }, limit: 1, depth: 0 })).docs[0]
  if (!chat) return Response.json({ ok: false }, { status: 404 })
  if (chat.leadCaptured) return Response.json({ ok: true })

  const transcript = (Array.isArray(chat.messages) ? (chat.messages as Array<{ role: string; text: string }>) : []).slice(-10).map((m) => `${m.role === 'user' ? 'Client' : 'Assistant'}: ${m.text}`).join('\n').slice(0, 3000)
  const lead = await createLead(
    { ...details, message: [details.message, transcript && `Chat:\n${transcript}`].filter(Boolean).join('\n\n'), sourcePage: page, source: 'chat' },
    toLocale(rawLang),
  )
  await payload.update({ collection: 'chat-conversations', id: chat.id, data: { leadCaptured: true, inquiry: lead.id } })
  return Response.json({ ok: true })
}

import { randomBytes } from 'crypto'
import { z } from 'zod'

import { toLocale } from '@/i18n/config'
import { isBot } from '@/lib/analytics-core'
import { answerWithClaude, type ChatTurn } from '@/lib/chat/agent'
import { answerWithRules, type ChatAnswer } from '@/lib/chat/rules'
import { aiMessagesToday, checkDate, loadKnowledge } from '@/lib/chat/service'
import { getPayloadClient } from '@/lib/payload'
import { clientIp, ipHash, isSameOrigin, rateLimit } from '@/lib/request-guard'

export const maxDuration = 60

const MAX_MESSAGES_PER_CHAT = 30
const MAX_NEW_CHATS_PER_HOUR = 8
const HISTORY_SENT = 20
const dailyAiLimit = () => Number(process.env.CHAT_DAILY_LIMIT || 500)

const schema = z.object({
  token: z.string().regex(/^[a-f0-9]{48}$/).optional(),
  message: z.string().trim().min(1).max(1000),
  lang: z.string().max(5).optional(),
  page: z.string().max(300).optional(),
})

type Stored = ChatTurn & { at: string }

export async function POST(req: Request) {
  if (!isSameOrigin(req) || isBot(req.headers.get('user-agent'))) return Response.json({ error: 'forbidden' }, { status: 403 })
  const ip = clientIp(req)
  if (!rateLimit(`chat:${ip}`, 60, 10 * 60 * 1000)) return Response.json({ error: 'rate_limited' }, { status: 429 })

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'invalid' }, { status: 400 })
  const { token: givenToken, message, page } = parsed.data
  const lang = toLocale(parsed.data.lang)

  const payload = await getPayloadClient()
  const hash = ipHash(ip)
  const found = givenToken ? (await payload.find({ collection: 'chat-conversations', where: { token: { equals: givenToken } }, limit: 1, depth: 0 })).docs[0] : undefined

  if (!found) {
    const hourAgo = new Date(Date.now() - 3600000).toISOString()
    const { totalDocs } = await payload.count({ collection: 'chat-conversations', where: { and: [{ ipHash: { equals: hash } }, { createdAt: { greater_than: hourAgo } }] } })
    if (totalDocs >= MAX_NEW_CHATS_PER_HOUR) return Response.json({ error: 'rate_limited' }, { status: 429 })
  }

  const token = found?.token ?? randomBytes(24).toString('hex')
  // History comes from our database, never from the browser, so a visitor cannot forge the assistant's past replies.
  const stored: Stored[] = Array.isArray(found?.messages) ? (found.messages as Stored[]) : []
  const userCount = stored.filter((m) => m.role === 'user').length
  if (userCount >= MAX_MESSAGES_PER_CHAT) return Response.json({ token, reply: { text: lang === 'ro' ? 'Am ajuns la limita acestei conversații. Lasă-ne datele tale și te contactăm direct.' : 'We have reached the limit for this chat. Leave your details and we will contact you directly.', actions: [{ type: 'lead_form' }] } })

  const now = new Date().toISOString()
  const history: Stored[] = [...stored, { role: 'user', text: message, at: now }]
  const knowledge = await loadKnowledge(lang)

  let mode: 'ai' | 'rules' = 'rules'
  let answer: ChatAnswer | undefined
  if (process.env.ANTHROPIC_API_KEY && (await aiMessagesToday()) < dailyAiLimit()) {
    try {
      answer = await answerWithClaude({ knowledge, lang, history: history.slice(-HISTORY_SENT).map(({ role, text }) => ({ role, text })), checkDate })
      mode = 'ai'
    } catch (err) {
      console.error('[chat] Claude unavailable, using built-in answers:', (err as Error).message)
    }
  }
  answer ??= await answerWithRules({ message, knowledge, lang, checkDate })

  const updated: Stored[] = [...history, { role: 'assistant', text: answer.text, at: new Date().toISOString() }]
  const topics = [...new Set([...(Array.isArray(found?.topics) ? (found.topics as string[]) : []), answer.topic])]
  const fields = {
    messages: updated,
    messageCount: userCount + 1,
    unanswered: (found?.unanswered ?? 0) + (answer.answered ? 0 : 1),
    topics,
    mode,
  }
  if (found) await payload.update({ collection: 'chat-conversations', id: found.id, data: fields })
  else await payload.create({ collection: 'chat-conversations', data: { ...fields, token, ipHash: hash, locale: lang, startPage: page, preview: message.slice(0, 80) } })

  return Response.json({ token, reply: { text: answer.text, actions: answer.actions } })
}

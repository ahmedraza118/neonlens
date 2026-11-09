import { loadReport } from '@/lib/growth'
import { notifyStudio } from '@/lib/notify'
import { getPayloadClient } from '@/lib/payload'
import { safeEqual } from '@/lib/request-guard'

export const maxDuration = 60

const EVENT_RETENTION_DAYS = 400
const CHAT_RETENTION_DAYS = 365

/**
 * Daily at 06:00 UTC (vercel.json): sends the studio its growth summary and deletes data past its
 * retention period. Vercel calls it with `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return new Response('CRON_SECRET is not set', { status: 501 })
  if (!safeEqual(req.headers.get('authorization') ?? '', `Bearer ${secret}`)) return new Response('Unauthorized', { status: 401 })

  const payload = await getPayloadClient()
  const [day, week] = await Promise.all([loadReport(payload, 1), loadReport(payload, 30)])
  const urgent = week.findings.filter((f) => f.severity === 'high').slice(0, 3)

  await notifyStudio(`📈 Yesterday: ${day.totals.sessions} visits, ${day.totals.conversions} leads`, [
    ['Stayed', `${day.totals.stayRate}%`],
    ['Conversion', `${day.totals.conversionRate}%`],
    ['Chats', String(day.chat.conversations)],
    ['New leads', String(day.pipeline.total)],
    ['Waiting over 24h', week.pipeline.stale.map((s) => `${s.name} (${s.hoursWaiting}h)`).join(', ') || 'None'],
    ['Pending bookings', String(week.booking.pending)],
    ...urgent.map((f, i): [string, string] => [`Fix ${i + 1}`, `${f.title}. ${f.fix}`]),
  ])

  const cutoff = (days: number) => new Date(Date.now() - days * 86400000).toISOString()
  const [events, chats] = await Promise.all([
    payload.delete({ collection: 'analytics-events', where: { createdAt: { less_than: cutoff(EVENT_RETENTION_DAYS) } } }),
    payload.delete({ collection: 'chat-conversations', where: { and: [{ updatedAt: { less_than: cutoff(CHAT_RETENTION_DAYS) } }, { leadCaptured: { not_equals: true } }] } }),
  ])
  return Response.json({ ok: true, deletedEvents: events.docs.length, deletedChats: chats.docs.length })
}

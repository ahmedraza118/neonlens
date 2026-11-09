import { checkDate } from '@/lib/chat/service'
import { clientIp, rateLimit } from '@/lib/request-guard'

/** One date at a time, for the "check your date" widget. The full calendar is only on the booking page. */
export async function GET(req: Request) {
  if (!rateLimit(`availability:${clientIp(req)}`, 60, 10 * 60 * 1000)) return Response.json({ error: 'rate_limited' }, { status: 429 })
  const date = new URL(req.url).searchParams.get('date') ?? ''
  return Response.json({ date, status: await checkDate(date) }, { headers: { 'Cache-Control': 'no-store' } })
}

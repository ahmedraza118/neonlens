import type { Payload } from 'payload'

import { type BookingRow, buildReport, type ChatRow, type EventRow, type LeadRow, type Report } from './insights'

/** No `server-only` here: the same loader is used by the admin view and by `npm run growth:report`. */
export async function loadReport(payload: Payload, days: number, now = new Date()) {
  const since = new Date(now.getTime() - days * 86400000).toISOString()
  const recent = { createdAt: { greater_than_equal: since } }
  const [events, leads, openLeads, bookings, chats] = await Promise.all([
    payload.find({
      collection: 'analytics-events',
      where: recent,
      limit: 200_000,
      pagination: false,
      depth: 0,
      sort: '-createdAt', // If the cap is ever reached, the oldest rows are the ones left out.
      select: { createdAt: true, type: true, path: true, session: true, visitor: true, channel: true, source: true, device: true, locale: true, country: true, value: true, label: true },
    }),
    payload.find({ collection: 'inquiries', where: recent, limit: 5000, pagination: false, depth: 0, select: { createdAt: true, status: true, source: true, contactedAt: true, name: true, service: true } }),
    // Unanswered leads stay on the list however old they are, unlike the period's totals.
    payload.find({ collection: 'inquiries', where: { status: { equals: 'new' } }, limit: 5000, pagination: false, depth: 0, select: { createdAt: true, status: true, name: true, service: true } }),
    payload.find({ collection: 'bookings', where: recent, limit: 5000, pagination: false, depth: 0, select: { createdAt: true, status: true, packagePrice: true, depositAmount: true, name: true, date: true } }),
    payload.find({ collection: 'chat-conversations', where: recent, limit: 5000, pagination: false, depth: 0, select: { createdAt: true, messageCount: true, mode: true, leadCaptured: true, unanswered: true, topics: true } }),
  ])
  return {
    ...buildReport({
      events: events.docs as unknown as EventRow[],
      leads: leads.docs as unknown as LeadRow[],
      openLeads: openLeads.docs as unknown as LeadRow[],
      bookings: bookings.docs as unknown as BookingRow[],
      chats: chats.docs as unknown as ChatRow[],
      now,
      days,
    }),
    hasDemoData: (events.docs as unknown as EventRow[]).some((e) => e.session.startsWith('demo-')),
  }
}

const table = (head: string[], rows: Array<Array<string | number>>) =>
  rows.length ? [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n') : '_No data yet._'

/** The report as Markdown, for the growth agents and for reading in a terminal. */
export function reportToMarkdown(r: Report & { hasDemoData?: boolean }): string {
  return [
    `# Growth report: last ${r.days} days`,
    r.hasDemoData ? '\n> ⚠️ This database contains generated demo traffic. Do not draw business conclusions from it.\n' : '',
    `Generated ${r.generatedAt}`,
    '\n## Headline numbers',
    table(['Metric', 'Value'], [
      ['Visits', r.totals.sessions], ['Stayed', `${r.totals.stayRate}%`], ['Left immediately', `${r.totals.bounceRate}%`],
      ['Average engaged time', `${r.totals.avgEngaged}s`], ['Pages per visit', r.totals.pagesPerSession], ['Returning visits (consenting)', `${r.totals.returningShare}%`],
      ['Visits that became a lead or tried to book', `${r.totals.conversions} (${r.totals.conversionRate}%)`],
    ]),
    '\n## What to fix first',
    r.findings.length ? r.findings.map((f) => `- **[${f.severity}] ${f.area}: ${f.title}.** ${f.evidence} Fix: ${f.fix}`).join('\n') : 'No weaknesses detected.',
    '\n## Funnel',
    table(['Step', 'Visits', '% of all', '% of previous'], r.funnel.map((s) => [s.step, s.sessions, `${s.ofTotal}%`, `${s.ofPrevious}%`])),
    '\n## Pages',
    table(['Page', 'Views', 'Avg time', 'Scroll', 'Exit rate', 'Landings', 'Bounce', 'Landing conv.'], r.pages.slice(0, 25).map((p) => [p.path, p.views, `${p.avgSeconds}s`, `${p.avgScroll}%`, `${p.exitRate}%`, p.landings, `${p.bounceRate}%`, `${p.landingConversion}%`])),
    '\n## Channels',
    table(['Channel', 'Visits', 'Bounce', 'Conversion'], r.channels.map((c) => [c.key, c.sessions, `${c.bounceRate}%`, `${c.conversionRate}%`])),
    '\n## Devices',
    table(['Device', 'Visits', 'Bounce', 'Conversion'], r.devices.map((c) => [c.key, c.sessions, `${c.bounceRate}%`, `${c.conversionRate}%`])),
    '\n## Real-user speed (75th percentile)',
    table(['Metric', 'Value', 'Rating', 'Samples'], r.vitals.map((v) => [v.name, `${v.p75}${v.unit}`, v.rating, v.samples])),
    '\n## Leads',
    `Total ${r.pipeline.total}. ${Object.entries(r.pipeline.statusCounts).map(([k, v]) => `${k}: ${v}`).join(', ')}. Median first reply: ${r.pipeline.medianResponseHours}h. Win rate of closed leads: ${r.pipeline.winRate}%.`,
    r.pipeline.stale.length ? `Waiting over 24h: ${r.pipeline.stale.map((s) => `${s.name} (${s.hoursWaiting}h)`).join(', ')}` : '',
    `By source: ${r.pipeline.sources.map((s) => `${s.key} ${s.leads}`).join(', ') || 'none'}`,
    '\n## Bookings',
    `Started ${r.booking.total}, paid ${r.booking.paid}, pending ${r.booking.pending}, cancelled ${r.booking.cancelled}. Revenue booked €${r.booking.revenueBooked}, deposits €${r.booking.depositsTaken}.`,
    '\n## Chat assistant',
    `Conversations ${r.chat.conversations}, leads ${r.chat.leads} (${r.chat.leadRate}%), unanswered ${r.chat.unanswered}. Topics: ${r.chat.topics.map((t) => `${t.key} ${t.n}`).join(', ') || 'none'}`,
  ].filter(Boolean).join('\n')
}

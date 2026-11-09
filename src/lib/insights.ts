/**
 * Turns raw analytics rows, leads and bookings into the growth report: who stays, who leaves, where
 * the funnel leaks and what to fix first. Pure (no database), so every number here is unit tested.
 */
import { CONVERSION_EVENTS, ENGAGEMENT_EVENTS, type EventType } from './analytics-core'

export type EventRow = {
  createdAt: string
  type: EventType
  path?: string | null
  session: string
  visitor?: string | null
  channel?: string | null
  source?: string | null
  device?: string | null
  locale?: string | null
  country?: string | null
  value?: number | null
  label?: string | null
}

export type LeadRow = { createdAt: string; status?: string | null; source?: string | null; contactedAt?: string | null; name: string; service?: string | null }
export type BookingRow = { createdAt: string; status?: string | null; packagePrice: number; depositAmount: number; name: string; date: string }
export type ChatRow = { createdAt: string; messageCount?: number | null; mode?: string | null; leadCaptured?: boolean | null; unanswered?: number | null; topics?: unknown }

export type Finding = { severity: 'high' | 'medium' | 'low'; area: string; title: string; evidence: string; fix: string }

const SESSION_GAP_MS = 30 * 60 * 1000
const BOUNCE_SECONDS = 10
/** Below this many observations a percentage is noise, so no finding is raised from it. */
const MIN_SAMPLE = 30

type Session = {
  key: string
  events: EventRow[]
  views: EventRow[]
  landing: string
  exit: string
  channel: string
  source: string
  device: string
  engaged: number
  bounced: boolean
  converted: boolean
  returning: boolean
}

const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0)
const avg = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0)
const round = (n: number) => Math.round(n * 10) / 10

export function percentile(values: number[], p: number): number {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)]
}

/** Splits each visitor's events into visits: 30 quiet minutes starts a new one. */
export function buildSessions(rows: EventRow[]): Session[] {
  const byVisitor = new Map<string, EventRow[]>()
  for (const r of rows) {
    const list = byVisitor.get(r.session)
    if (list) list.push(r)
    else byVisitor.set(r.session, [r])
  }
  const sessions: Session[] = []
  for (const [id, list] of byVisitor) {
    list.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    let current: EventRow[] = []
    const flush = () => {
      if (current.length) sessions.push(toSession(`${id}:${sessions.length}`, current))
      current = []
    }
    let last = 0
    for (const e of list) {
      const at = Date.parse(e.createdAt)
      if (last && at - last > SESSION_GAP_MS) flush()
      current.push(e)
      last = at
    }
    flush()
  }
  return sessions.filter((s) => s.views.length > 0)
}

function toSession(key: string, events: EventRow[]): Session {
  const views = events.filter((e) => e.type === 'pageview')
  const engaged = events.filter((e) => e.type === 'engage').reduce((sum, e) => sum + (e.value ?? 0), 0)
  const interacted = events.some((e) => ENGAGEMENT_EVENTS.includes(e.type))
  const first = views[0]
  return {
    key,
    events,
    views,
    landing: first?.path ?? '/',
    exit: views.at(-1)?.path ?? '/',
    channel: first?.channel ?? 'direct',
    source: first?.source ?? '',
    device: first?.device ?? 'desktop',
    engaged,
    bounced: views.length <= 1 && !interacted && engaged < BOUNCE_SECONDS,
    converted: events.some((e) => CONVERSION_EVENTS.includes(e.type)),
    returning: events.some((e) => e.label === 'returning' && e.type === 'pageview'),
  }
}

function breakdown(sessions: Session[], keyOf: (s: Session) => string) {
  const groups = new Map<string, Session[]>()
  for (const s of sessions) {
    const k = keyOf(s) || '(none)'
    groups.set(k, [...(groups.get(k) ?? []), s])
  }
  return [...groups.entries()]
    .map(([key, list]) => {
      const converted = list.filter((s) => s.converted).length
      return {
        key,
        sessions: list.length,
        bounceRate: pct(list.filter((s) => s.bounced).length, list.length),
        avgEngaged: Math.round(avg(list.map((s) => s.engaged))),
        conversions: converted,
        conversionRate: pct(converted, list.length),
      }
    })
    .sort((a, b) => b.sessions - a.sessions)
}

const VITAL_LIMITS: Record<string, { good: number; poor: number; unit: string }> = {
  LCP: { good: 2500, poor: 4000, unit: 'ms' },
  INP: { good: 200, poor: 500, unit: 'ms' },
  CLS: { good: 0.1, poor: 0.25, unit: '' },
  FCP: { good: 1800, poor: 3000, unit: 'ms' },
  TTFB: { good: 800, poor: 1800, unit: 'ms' },
}

type Input = {
  events: EventRow[]
  leads: LeadRow[]
  /** Every lead still unanswered, including ones older than the period. Defaults to `leads`. */
  openLeads?: LeadRow[]
  bookings: BookingRow[]
  chats: ChatRow[]
  now?: Date
  days: number
}

function summarize({ events, leads, openLeads = leads, bookings, chats, now = new Date(), days }: Input) {
  const sessions = buildSessions(events)
  const total = sessions.length
  const count = (type: EventType) => events.filter((e) => e.type === type).length
  const sessionsWith = (...types: EventType[]) => sessions.filter((s) => s.events.some((e) => types.includes(e.type))).length

  const totals = {
    visitors: new Set(sessions.map((s) => s.key.split(':')[0])).size,
    sessions: total,
    pageviews: count('pageview'),
    pagesPerSession: total ? round(count('pageview') / total) : 0,
    bounceRate: pct(sessions.filter((s) => s.bounced).length, total),
    stayRate: pct(sessions.filter((s) => !s.bounced).length, total),
    avgEngaged: Math.round(avg(sessions.map((s) => s.engaged))),
    returningShare: pct(sessions.filter((s) => s.returning).length, sessions.filter((s) => s.events.some((e) => e.visitor)).length),
    conversions: sessions.filter((s) => s.converted).length,
    conversionRate: pct(sessions.filter((s) => s.converted).length, total),
  }

  // Daily trend (Bucharest days, oldest first), with empty days kept so gaps are visible.
  const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest', year: 'numeric', month: '2-digit', day: '2-digit' })
  const daily = Array.from({ length: days }, (_, i) => {
    const key = dayKey.format(new Date(now.getTime() - (days - 1 - i) * 86400000))
    return { day: key, sessions: 0, conversions: 0 }
  })
  const dayIndex = new Map(daily.map((d) => [d.day, d]))
  for (const s of sessions) {
    const d = dayIndex.get(dayKey.format(new Date(s.events[0].createdAt)))
    if (!d) continue
    d.sessions++
    if (s.converted) d.conversions++
  }

  const isInterest = (p?: string | null) => !!p && /(servicii|services|preturi|pricing|portofoliu|portfolio|rezervare|book|zone|locations)/.test(p)
  const funnel = [
    { step: 'Visited the site', sessions: total },
    { step: 'Stayed (did not bounce)', sessions: sessions.filter((s) => !s.bounced).length },
    { step: 'Viewed services, prices or work', sessions: sessions.filter((s) => !s.bounced && s.views.some((v) => isInterest(v.path))).length },
    { step: 'Started a form, chat or booking', sessions: sessionsWith('form_start', 'booking_start', 'chat_open', 'date_check', 'quote_used') },
    { step: 'Became a lead or tried to book', sessions: totals.conversions },
    { step: 'Deposit paid', sessions: bookings.filter((b) => b.status === 'paid' || b.status === 'completed').length },
  ].map((step, i, all) => ({ ...step, ofTotal: pct(step.sessions, total), ofPrevious: i ? pct(step.sessions, all[i - 1].sessions) : 100 }))

  // Per page: attention (time, scroll) and where visits end.
  const pageMap = new Map<string, { views: number; times: number[]; scrolls: number[]; exits: number; landings: number; bounces: number; converted: number }>()
  const page = (path: string) => {
    let p = pageMap.get(path)
    if (!p) pageMap.set(path, (p = { views: 0, times: [], scrolls: [], exits: 0, landings: 0, bounces: 0, converted: 0 }))
    return p
  }
  // A visitor who switches tabs reports a page in several parts: add them up, one figure per visit.
  const attention = new Map<string, { path: string; seconds: number; scroll: number }>()
  for (const e of events) {
    if (!e.path) continue
    if (e.type === 'pageview') page(e.path).views++
    if (e.type === 'engage') {
      const key = `${e.session}|${e.path}`
      const entry = attention.get(key) ?? { path: e.path, seconds: 0, scroll: 0 }
      entry.seconds += e.value ?? 0
      const scroll = Number(e.label)
      if (Number.isFinite(scroll)) entry.scroll = Math.max(entry.scroll, scroll)
      attention.set(key, entry)
    }
  }
  for (const a of attention.values()) {
    page(a.path).times.push(a.seconds)
    page(a.path).scrolls.push(a.scroll)
  }
  for (const s of sessions) {
    page(s.exit).exits++
    const land = page(s.landing)
    land.landings++
    if (s.bounced) land.bounces++
    if (s.converted) land.converted++
  }
  const pages = [...pageMap.entries()]
    .map(([path, p]) => ({
      path,
      views: p.views,
      avgSeconds: Math.round(avg(p.times)),
      avgScroll: Math.round(avg(p.scrolls)),
      exits: p.exits,
      exitRate: pct(p.exits, p.views),
      landings: p.landings,
      bounceRate: pct(p.bounces, p.landings),
      landingConversion: pct(p.converted, p.landings),
    }))
    .filter((p) => p.views > 0)
    .sort((a, b) => b.views - a.views)

  const vitalNames = ['LCP', 'INP', 'CLS', 'FCP', 'TTFB']
  const vitals = vitalNames.map((name) => {
    const rows = events.filter((e) => e.type === 'vital' && e.label === name && typeof e.value === 'number')
    const value = percentile(rows.map((r) => r.value as number), 75)
    const limit = VITAL_LIMITS[name]
    return { name, p75: name === 'CLS' ? Math.round(value * 1000) / 1000 : Math.round(value), samples: rows.length, unit: limit.unit, rating: !rows.length ? 'none' : value <= limit.good ? 'good' : value <= limit.poor ? 'needs work' : 'poor' }
  })

  // Lead pipeline.
  const contacted = leads.filter((l) => l.contactedAt)
  const responseHours = contacted.map((l) => (Date.parse(l.contactedAt as string) - Date.parse(l.createdAt)) / 3600000).filter((h) => h >= 0)
  const staleCutoff = now.getTime() - 24 * 3600000
  const stale = openLeads.filter((l) => (l.status ?? 'new') === 'new' && Date.parse(l.createdAt) < staleCutoff)
  const statusCounts = Object.fromEntries(['new', 'contacted', 'quoted', 'booked', 'lost'].map((st) => [st, leads.filter((l) => (l.status ?? 'new') === st).length]))
  const leadSources = [...new Set(leads.map((l) => l.source ?? 'form'))].map((key) => ({ key, leads: leads.filter((l) => (l.source ?? 'form') === key).length })).sort((a, b) => b.leads - a.leads)
  const closed = statusCounts.booked + statusCounts.lost
  const pipeline = {
    total: leads.length,
    statusCounts,
    sources: leadSources,
    stale: stale.map((l) => ({ name: l.name, service: l.service ?? '', hoursWaiting: Math.round((now.getTime() - Date.parse(l.createdAt)) / 3600000) })),
    medianResponseHours: round(percentile(responseHours, 50)),
    winRate: pct(statusCounts.booked, closed),
  }

  const paid = bookings.filter((b) => b.status === 'paid' || b.status === 'completed')
  const booking = {
    total: bookings.length,
    paid: paid.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    revenueBooked: paid.reduce((sum, b) => sum + b.packagePrice, 0),
    depositsTaken: paid.reduce((sum, b) => sum + b.depositAmount, 0),
    completionRate: pct(paid.length, bookings.length),
  }

  const topics = new Map<string, number>()
  for (const c of chats) if (Array.isArray(c.topics)) for (const t of c.topics) if (typeof t === 'string') topics.set(t, (topics.get(t) ?? 0) + 1)
  const chat = {
    conversations: chats.length,
    messages: chats.reduce((sum, c) => sum + (c.messageCount ?? 0), 0),
    leads: chats.filter((c) => c.leadCaptured).length,
    leadRate: pct(chats.filter((c) => c.leadCaptured).length, chats.length),
    unanswered: chats.reduce((sum, c) => sum + (c.unanswered ?? 0), 0),
    topics: [...topics.entries()].map(([key, n]) => ({ key, n })).sort((a, b) => b.n - a.n),
  }

  const clicks = (['click_call', 'click_whatsapp', 'click_email'] as const).map((type) => ({ key: type.replace('click_', ''), n: count(type) }))
  const ctaMap = new Map<string, number>()
  for (const e of events) if (e.type === 'cta' && e.label) ctaMap.set(e.label, (ctaMap.get(e.label) ?? 0) + 1)

  return {
    generatedAt: now.toISOString(),
    days,
    totals,
    daily,
    funnel,
    pages,
    channels: breakdown(sessions, (s) => s.channel),
    sources: breakdown(sessions, (s) => s.source).slice(0, 10),
    devices: breakdown(sessions, (s) => s.device),
    landings: breakdown(sessions, (s) => s.landing).slice(0, 15),
    exits: breakdown(sessions, (s) => s.exit).slice(0, 10),
    vitals,
    pipeline,
    booking,
    chat,
    contactClicks: clicks,
    ctas: [...ctaMap.entries()].map(([key, n]) => ({ key, n })).sort((a, b) => b.n - a.n).slice(0, 12),
    actions: { dateChecks: count('date_check'), quotesUsed: count('quote_used'), formStarts: count('form_start'), leaveOffers: count('leave_offer') },
  }
}

type ReportBase = ReturnType<typeof summarize>
export type Report = ReportBase & { findings: Finding[] }

export function buildReport(input: Input): Report {
  const base = summarize(input)
  return { ...base, findings: findWeaknesses(base) }
}

/**
 * The website analyst: compares the numbers with sensible benchmarks and says what to fix first.
 * Never raises a finding from too few visits, so a quiet week does not produce false alarms.
 */
export function findWeaknesses(r: ReportBase): Finding[] {
  const out: Finding[] = []
  const add = (severity: Finding['severity'], area: string, title: string, evidence: string, fix: string) => out.push({ severity, area, title, evidence, fix })

  // Leads waiting: needs no traffic sample, every lead is money.
  if (r.pipeline.stale.length > 0) {
    const longest = Math.max(...r.pipeline.stale.map((s) => s.hoursWaiting))
    add('high', 'Leads', `${r.pipeline.stale.length} lead(s) have had no reply for over 24 hours`, `Longest wait: ${longest} hours. Couples usually book the first studio that answers personally.`, 'Reply today, then set their status to Contacted in Admin → Inquiries so response time is measured.')
  }
  if (r.booking.pending >= 3 && r.booking.completionRate < 50) {
    add('medium', 'Bookings', 'Many bookings start but are never paid', `${r.booking.pending} pending, ${r.booking.paid} paid of ${r.booking.total}.`, 'Call pending clients within the hour. Check Stripe is configured and that the deposit terms are clear on /book.')
  }
  if (r.chat.conversations >= 10 && r.chat.unanswered / Math.max(r.chat.messages, 1) > 0.25) {
    add('medium', 'Chatbot', 'The assistant cannot answer many questions', `${r.chat.unanswered} unanswered of ${r.chat.messages} messages.`, 'Read Admin → Chat conversations and add the missing answers to the FAQ in Business & SEO settings.')
  }

  for (const v of r.vitals) {
    if (v.samples < MIN_SAMPLE || v.rating === 'good') continue
    add(v.rating === 'poor' ? 'high' : 'medium', 'Speed', `${v.name} ${v.rating === 'poor' ? 'is poor' : 'needs work'} (${v.p75}${v.unit} at the 75th percentile)`, `${v.samples} real visits measured.`, v.name === 'LCP' ? 'Compress the first hero image and avoid a video on the first slide for phones.' : v.name === 'INP' ? 'Find slow click handlers; remove heavy third-party scripts.' : v.name === 'CLS' ? 'Give every image and embed fixed dimensions.' : 'Check hosting region and database latency (Turso region should be in the EU).')
  }

  if (r.totals.sessions < MIN_SAMPLE) {
    if (out.length === 0) add('low', 'Data', 'Not enough visits for reliable conclusions yet', `${r.totals.sessions} visits in the last ${r.days} days; ${MIN_SAMPLE} are needed.`, 'Share the site, submit the sitemap in Search Console and link it from your Google Business Profile.')
    return sortFindings(out)
  }

  if (r.totals.bounceRate > 60) add('high', 'Retention', `${r.totals.bounceRate}% of visitors leave immediately`, `Benchmark for service sites is roughly 40–55%. Average engaged time is ${r.totals.avgEngaged}s.`, 'Check the landing pages below: show real work, price and a date check above the fold.')
  if (r.totals.conversionRate < 1.5) add('high', 'Conversion', `Only ${r.totals.conversionRate}% of visits become a lead`, `${r.totals.conversions} of ${r.totals.sessions} visits. A healthy local service site converts 2–5%.`, 'Promote the date checker and chat, add a recent review near every form, and test a shorter form.')

  const mobile = r.devices.find((d) => d.key === 'mobile')
  const desktop = r.devices.find((d) => d.key === 'desktop')
  if (mobile && desktop && mobile.sessions >= MIN_SAMPLE && desktop.sessions >= MIN_SAMPLE && mobile.conversionRate < desktop.conversionRate * 0.5) {
    add('high', 'Mobile', 'Phone visitors convert at less than half the desktop rate', `Mobile ${mobile.conversionRate}% vs desktop ${desktop.conversionRate}%.`, 'Test the booking and inquiry forms on a real phone; shorten them and promote WhatsApp.')
  }

  for (const p of r.pages.filter((x) => x.landings >= MIN_SAMPLE && x.bounceRate > 70).slice(0, 3)) {
    add('medium', 'Landing page', `${p.path} loses ${p.bounceRate}% of arrivals`, `${p.landings} visits started here; average ${p.avgSeconds}s, ${p.avgScroll}% scrolled.`, 'Match the page headline to the search or ad that brings people here, and put a photo and price in the first screen.')
  }
  for (const p of r.pages.filter((x) => x.views >= MIN_SAMPLE && /pret|pricing|rezervare|book/.test(x.path) && x.exitRate > 50).slice(0, 2)) {
    add('high', 'Funnel', `${p.exitRate}% of visitors leave from ${p.path}`, `${p.views} views. People here are close to buying.`, 'Add reassurance by the price (what is included, deposit terms, a review) and a low-commitment "ask a question" option.')
  }
  const started = r.funnel[3]
  const converted = r.funnel[4]
  if (started.sessions >= MIN_SAMPLE && converted.ofPrevious < 25) add('medium', 'Funnel', 'Most people who start a form or chat do not finish', `${started.sessions} started, ${converted.sessions} finished (${converted.ofPrevious}%).`, 'Reduce required fields and check for validation errors on phones.')

  const organic = r.channels.find((c) => c.key === 'organic')
  if (!organic || organic.sessions / r.totals.sessions < 0.2) add('medium', 'SEO', 'Search brings under 20% of visits', `${organic?.sessions ?? 0} of ${r.totals.sessions} visits are from search.`, 'Complete Google Business Profile, ask each client for a review, and publish one venue case study per shoot.')

  return sortFindings(out)
}

const sortFindings = (list: Finding[]) => {
  const rank = { high: 0, medium: 1, low: 2 }
  return list.sort((a, b) => rank[a.severity] - rank[b.severity])
}

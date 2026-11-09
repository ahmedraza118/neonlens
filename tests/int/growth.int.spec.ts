import { describe, expect, it, vi } from 'vitest'

import { parsePublicPath, withLocale } from '@/i18n/config'
import { channelFrom, cleanPath, deviceFrom, isBot, referrerHost } from '@/lib/analytics-core'
import { answerWithClaude } from '@/lib/chat/agent'
import { answerWithRules, type Knowledge, matchFaq, parseDate } from '@/lib/chat/rules'
import { buildReport, buildSessions, type EventRow, percentile } from '@/lib/insights'

const at = (min: number) => new Date(Date.UTC(2026, 10, 1, 10, min)).toISOString()
const ev = (session: string, min: number, type: EventRow['type'], extra: Partial<EventRow> = {}): EventRow => ({ session, createdAt: at(min), type, path: '/', device: 'mobile', channel: 'organic', ...extra })
const now = new Date(Date.UTC(2026, 10, 2))

describe('language paths', () => {
  it('maps public and internal paths to the same page', () => {
    expect(parsePublicPath('/preturi')).toEqual({ lang: 'ro', path: '/pricing' })
    expect(parsePublicPath('/ro/pricing')).toEqual({ lang: 'ro', path: '/pricing' })
    expect(parsePublicPath('/ro')).toEqual({ lang: 'ro', path: '/' })
    expect(parsePublicPath('/en/pricing')).toEqual({ lang: 'en', path: '/pricing' })
    expect(parsePublicPath('/rezervare/confirmare')).toEqual({ lang: 'ro', path: '/book/success' })
    expect(withLocale('/pricing', 'ro')).toBe('/preturi')
    expect(withLocale('/pricing', 'en')).toBe('/en/pricing')
  })
})

describe('analytics helpers', () => {
  it('classifies channels', () => {
    expect(channelFrom({ referrerHost: 'google.ro' })).toBe('organic')
    expect(channelFrom({ referrerHost: 'instagram.com' })).toBe('social')
    expect(channelFrom({ referrerHost: 'chatgpt.com' })).toBe('ai')
    expect(channelFrom({ utmMedium: 'cpc', referrerHost: 'google.ro' })).toBe('paid')
    expect(channelFrom({})).toBe('direct')
    expect(channelFrom({ referrerHost: 'nunti.ro' })).toBe('referral')
  })
  it('ignores the site itself as a referrer and bad URLs', () => {
    expect(referrerHost('https://www.neon.ro/x', 'neon.ro')).toBeNull()
    expect(referrerHost('not a url', 'neon.ro')).toBeNull()
    expect(referrerHost('https://google.ro/', 'neon.ro')).toBe('google.ro')
  })
  it('never stores query strings or private gallery names', () => {
    expect(cleanPath('/preturi?email=a@b.ro')).toBe('/preturi')
    expect(cleanPath('/galerie-client/ana-si-mihai')).toBe('/galerie-client/*')
    expect(cleanPath('/en/client/ana')).toBe('/en/client/*')
    expect(cleanPath('https://evil.test')).toBeNull()
  })
  it('detects devices and bots', () => {
    expect(deviceFrom('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)')).toBe('mobile')
    expect(deviceFrom('Mozilla/5.0 (iPad; CPU OS 17_0)')).toBe('tablet')
    expect(deviceFrom('Mozilla/5.0 (Macintosh; Intel Mac OS X)')).toBe('desktop')
    expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true)
    expect(isBot('Mozilla/5.0 (iPhone)')).toBe(false)
    expect(isBot(null)).toBe(true)
    expect(isBot('Mozilla/5.0 (Linux; Android 12; CUBOT X50) Mobile')).toBe(false)
  })
})

describe('sessions and report', () => {
  it('starts a new visit after 30 quiet minutes', () => {
    expect(buildSessions([ev('a', 0, 'pageview'), ev('a', 10, 'pageview'), ev('a', 45, 'pageview')])).toHaveLength(2)
  })
  it('counts a quick single page as a bounce, but not one with an interaction', () => {
    const [bounced] = buildSessions([ev('a', 0, 'pageview'), ev('a', 0, 'engage', { value: 3 })])
    const [kept] = buildSessions([ev('b', 0, 'pageview'), ev('b', 0, 'date_check')])
    expect(bounced.bounced).toBe(true)
    expect(kept.bounced).toBe(false)
  })
  it('computes rates, funnel and exits', () => {
    const r = buildReport({
      now, days: 2, leads: [], bookings: [], chats: [],
      events: [
        ev('a', 0, 'pageview'), ev('a', 0, 'engage', { value: 2, label: '20' }),
        ev('b', 0, 'pageview'), ev('b', 1, 'pageview', { path: '/preturi' }), ev('b', 2, 'generate_lead', { path: '/preturi' }),
      ],
    })
    expect(r.totals.sessions).toBe(2)
    expect(r.totals.bounceRate).toBe(50)
    expect(r.totals.conversionRate).toBe(50)
    expect(r.funnel[4].sessions).toBe(1)
    expect(r.pages.find((p) => p.path === '/preturi')?.exitRate).toBe(100)
  })
  it('flags unanswered leads even with little traffic, and no rate findings from a small sample', () => {
    const r = buildReport({ now, days: 7, bookings: [], chats: [], events: [ev('a', 0, 'pageview')], leads: [{ createdAt: new Date(now.getTime() - 40 * 3600000).toISOString(), status: 'new', name: 'Ana' }] })
    expect(r.findings[0].area).toBe('Leads')
    expect(r.findings.some((f) => f.area === 'Conversion')).toBe(false)
  })
  it('flags low conversion once there is enough data', () => {
    const events = Array.from({ length: 40 }, (_, i) => ev(`s${i}`, 0, 'pageview'))
    const r = buildReport({ now, days: 7, bookings: [], chats: [], leads: [], events })
    expect(r.findings.some((f) => f.area === 'Conversion')).toBe(true)
    expect(r.findings.some((f) => f.area === 'Retention')).toBe(true)
  })
  it('keeps every funnel step within the one before it', () => {
    const events = [ev('a', 0, 'pageview', { path: '/preturi' }), ev('b', 0, 'pageview'), ev('b', 1, 'pageview', { path: '/preturi' })]
    const r = buildReport({ now, days: 2, leads: [], bookings: [], chats: [], events })
    expect(r.funnel[1].sessions).toBe(1)
    expect(r.funnel[2].sessions).toBe(1)
  })
  it('keeps long-unanswered leads on the alert list and measures a page once per visit', () => {
    const old = { createdAt: new Date(now.getTime() - 240 * 3600000).toISOString(), status: 'new', name: 'Ana' }
    const r = buildReport({
      now, days: 7, bookings: [], chats: [], leads: [], openLeads: [old],
      events: [ev('a', 0, 'pageview'), ev('a', 1, 'engage', { value: 10, label: '20' }), ev('a', 2, 'engage', { value: 30, label: '60' })],
    })
    expect(r.pipeline.stale).toHaveLength(1)
    expect(r.pages[0].avgSeconds).toBe(40)
    expect(r.pages[0].avgScroll).toBe(60)
  })
  it('takes percentiles', () => {
    expect(percentile([1, 2, 3, 4], 75)).toBe(3)
    expect(percentile([], 75)).toBe(0)
  })
})

const knowledge: Knowledge = {
  business: { name: 'NeonLens', phone: '+40 700', email: 'a@b.ro', currency: 'EUR', depositPercent: 30, city: 'București' },
  services: [{ slug: 'fotograf-nunta', title: 'Fotografie de nuntă', excerpt: 'Povești reale.', startingPrice: 1200, packages: [{ name: 'Esențial', price: 1200, hours: 8, includes: [] }], faqs: [] }],
  locations: [{ slug: 'snagov', name: 'Snagov', travelFee: 0, isPrimary: false }],
  faqs: [{ question: 'Când primim fotografiile finale?', answer: 'În 6 săptămâni.' }],
  rates: [{ serviceId: 1, serviceSlug: 'fotograf-nunta', baseFee: 600, hourlyRate: 100, minHours: 6, maxHours: 12 }],
  addOns: [],
}
const today = new Date(Date.UTC(2026, 10, 8))
const ask = (message: string, lang: 'ro' | 'en' = 'ro', status: 'available' | 'unavailable' = 'available') =>
  answerWithRules({ message, knowledge, lang, today, checkDate: async () => status })

describe('assistant rules', () => {
  it('reads dates in Romanian and English', () => {
    expect(parseDate('12 iunie 2027', today)).toBe('2027-06-12')
    expect(parseDate('nunta e pe 12.06.2027', today)).toBe('2027-06-12')
    expect(parseDate('June 12th, 2027', today)).toBe('2027-06-12')
    expect(parseDate('3 martie', today)).toBe('2027-03-03')
    expect(parseDate('31.02.2027', today)).toBeNull()
    expect(parseDate('avem 120 de invitati', today)).toBeNull()
  })
  it('does not mistake hours or everyday words for dates', () => {
    expect(parseDate('cât costă 8.5 ore?', today)).toBeNull()
    expect(parseDate('vrem 2 mai multe pachete', today)).toBeNull()
    expect(parseDate('suntem 2 noi', today)).toBeNull()
    expect(parseDate('2 mai 2027', today)).toBe('2027-05-02')
    expect(parseDate('nunta e pe 12.06', today)).toBe('2027-06-12')
  })
  it('does not treat words that contain "rate" as a price question', async () => {
    expect((await ask('Do you do corporate events in Snagov?', 'en')).topic).not.toBe('price')
  })
  it('answers prices only from the CMS', async () => {
    const a = await ask('Cât costă fotografie de nuntă?')
    expect(a.text).toContain('1.200')
    expect(a.topic).toBe('price')
  })
  it('checks dates and offers booking', async () => {
    const free = await ask('E liberă data de 12 iunie 2027?')
    expect(free.actions.some((x) => x.type === 'link' && x.href.includes('date=2027-06-12'))).toBe(true)
    const taken = await ask('12 iunie 2027', 'ro', 'unavailable')
    expect(taken.actions[0].type).toBe('lead_form')
  })
  it('matches FAQs but does not answer from one common word', async () => {
    expect((await ask('Când primim fotografiile?')).text).toBe('În 6 săptămâni.')
    expect(matchFaq('fotografiile', knowledge.faqs)).toBeNull()
  })
  it('picks the video service when video is asked for', async () => {
    const k: Knowledge = { ...knowledge, services: [knowledge.services[0], { ...knowledge.services[0], slug: 'videograf-nunta', title: 'Film de nuntă', startingPrice: 1500, packages: [{ name: 'Film', price: 1500, hours: 8, includes: [] }] }] }
    const a = await answerWithRules({ message: 'Cât costă videograf pentru nuntă?', knowledge: k, lang: 'ro', today, checkDate: async () => 'available' })
    expect(a.text).toContain('Film de nuntă')
    const photo = await answerWithRules({ message: 'Cât costă o nuntă?', knowledge: k, lang: 'ro', today, checkDate: async () => 'available' })
    expect(photo.text).toContain('Fotografie de nuntă')
  })
  it('treats asking for a person as contact even when a place is named', async () => {
    const a = await ask('Vreau să vorbesc cu cineva despre o nuntă la Snagov')
    expect(a.topic).toBe('contact')
    expect(a.actions[0]).toMatchObject({ type: 'lead_form', location: 'Snagov' })
  })
  it('answers about a named area directly', async () => {
    expect((await ask('Lucrați și în Snagov?')).text).toContain('Snagov, fără taxă')
  })
  it('admits what it does not know and offers a person', async () => {
    const a = await ask('Faceți reduceri pentru pompieri?')
    expect(a.answered).toBe(false)
    expect(a.actions[0].type).toBe('lead_form')
  })
})

describe('assistant with Claude', () => {
  const response = (content: unknown[], stop_reason: string) => ({ content, stop_reason })

  it('runs tools, returns actions and labels the turn', async () => {
    const create = vi.fn()
      .mockResolvedValueOnce(response([{ type: 'tool_use', id: '1', name: 'check_date', input: { date: '2027-06-12' } }], 'tool_use'))
      .mockResolvedValueOnce(response([
        { type: 'text', text: 'Data este liberă.' },
        { type: 'tool_use', id: '2', name: 'show_booking_button', input: { service_slug: null, date: '2027-06-12' } },
        { type: 'tool_use', id: '3', name: 'record_outcome', input: { topic: 'availability', answered: true } },
      ], 'tool_use'))
      .mockResolvedValue(response([{ type: 'text', text: 'Data este liberă.' }], 'end_turn'))
    const checkDate = vi.fn().mockResolvedValue('available')
    const a = await answerWithClaude({ knowledge, lang: 'ro', history: [{ role: 'user', text: '12 iunie?' }], checkDate, client: { messages: { create } } as never, today })
    expect(checkDate).toHaveBeenCalledWith('2027-06-12')
    expect(a.text).toBe('Data este liberă.')
    expect(a.topic).toBe('availability')
    expect(a.actions).toEqual([{ type: 'link', label: 'Rezervă data', href: '/rezervare?date=2027-06-12' }])
  })
  it('always starts the conversation with a user turn', async () => {
    const create = vi.fn().mockResolvedValue(response([{ type: 'text', text: 'Bună.' }], 'end_turn'))
    await answerWithClaude({ knowledge, lang: 'ro', history: [{ role: 'assistant', text: 'vechi' }, { role: 'user', text: 'salut' }], checkDate: vi.fn(), client: { messages: { create } } as never, today })
    expect(create.mock.calls[0][0].messages[0]).toEqual({ role: 'user', content: 'salut' })
  })
  it('survives an impossible date from the model', async () => {
    const create = vi.fn()
      .mockResolvedValueOnce(response([{ type: 'tool_use', id: '1', name: 'check_date', input: { date: '2027-13-45' } }], 'tool_use'))
      .mockResolvedValue(response([{ type: 'text', text: 'Alege altă dată.' }], 'end_turn'))
    const a = await answerWithClaude({ knowledge, lang: 'ro', history: [{ role: 'user', text: 'x' }], checkDate: vi.fn().mockResolvedValue('invalid'), client: { messages: { create } } as never, today })
    expect(a.text).toBe('Alege altă dată.')
  })
  it('throws on refusal so the route can use the built-in answers', async () => {
    const create = vi.fn().mockResolvedValue(response([], 'refusal'))
    await expect(answerWithClaude({ knowledge, lang: 'ro', history: [{ role: 'user', text: 'x' }], checkDate: vi.fn(), client: { messages: { create } } as never, today })).rejects.toThrow()
  })
})

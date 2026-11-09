/**
 * Fills a LOCAL database with labelled demo visits so the Growth dashboard can be explored before
 * real traffic arrives: `npm run growth:demo`. Remove them with `npm run growth:demo -- --clear`.
 * Refuses to run against anything but a local SQLite file. Never use demo numbers for decisions.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import type { EventType } from '@/lib/analytics-core'

const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || 'file:./neonlens.db'
if (!url.startsWith('file:')) {
  console.error('Refusing to run: DATABASE_URL is not a local file.')
  process.exit(1)
}

const payload = await getPayload({ config })

if (process.argv.includes('--clear')) {
  const events = await payload.delete({ collection: 'analytics-events', where: { session: { like: 'demo-' } } })
  const leads = await payload.delete({ collection: 'inquiries', where: { email: { like: '.test' } } })
  const bookings = await payload.delete({ collection: 'bookings', where: { email: { like: '.test' } } })
  console.log(`Removed ${events.docs.length} demo events, ${leads.docs.length} test leads, ${bookings.docs.length} test bookings.`)
  process.exit(0)
}

// Deterministic, so two runs produce the same picture.
let seed = 20261108
const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296
const pick = <T,>(items: Array<[T, number]>) => {
  let roll = rnd() * items.reduce((s, [, w]) => s + w, 0)
  for (const [item, weight] of items) if ((roll -= weight) <= 0) return item
  return items[0][0]
}

const LANDINGS: Array<[string, number]> = [['/', 40], ['/servicii/fotograf-nunta', 22], ['/preturi', 10], ['/zone/snagov', 8], ['/portofoliu', 8], ['/en', 7], ['/blog', 5]]
const NEXT = ['/portofoliu', '/servicii/fotograf-nunta', '/preturi', '/recenzii', '/despre-noi', '/rezervare', '/contact']
const CHANNELS: Array<[[string, string], number]> = [[['organic', 'google.com'], 45], [['direct', ''], 25], [['social', 'instagram.com'], 18], [['referral', 'nunta-bucuresti.ro'], 8], [['paid', 'google'], 4]]
const DEVICES: Array<[string, number]> = [['mobile', 68], ['desktop', 27], ['tablet', 5]]

const rows: Array<Record<string, unknown>> = []
for (let day = 13; day >= 0; day--) {
  const visits = 12 + Math.floor(rnd() * 14)
  for (let v = 0; v < visits; v++) {
    const [channel, source] = pick(CHANNELS)
    const device = pick(DEVICES)
    const session = `demo-${day}-${v}`
    let at = Date.now() - day * 86400000 - Math.floor(rnd() * 72000000) - 3600000
    const base = { session, channel, source, device, locale: 'ro' }
    const add = (type: EventType, path: string, value?: number, label?: string) => {
      at += 4000 + Math.floor(rnd() * 25000)
      rows.push({ ...base, type, path, value, label, createdAt: new Date(at).toISOString() })
    }
    const landing = pick(LANDINGS)
    const stays = rnd() > (device === 'mobile' ? 0.5 : 0.32)
    add('pageview', landing)
    add('vital', landing, device === 'mobile' ? 2200 + rnd() * 2600 : 1200 + rnd() * 1200, 'LCP')
    add('vital', landing, rnd() * 0.08, 'CLS')
    add('vital', landing, 80 + rnd() * 260, 'INP')
    if (!stays) {
      add('engage', landing, Math.floor(rnd() * 8), String(10 + Math.floor(rnd() * 25)))
      continue
    }
    add('engage', landing, 20 + Math.floor(rnd() * 90), String(45 + Math.floor(rnd() * 50)))
    const pages = 1 + Math.floor(rnd() * 3)
    let last = landing
    for (let p = 0; p < pages; p++) {
      last = NEXT[Math.floor(rnd() * NEXT.length)]
      add('pageview', last)
      add('engage', last, 10 + Math.floor(rnd() * 70), String(30 + Math.floor(rnd() * 70)))
    }
    if (rnd() < 0.3) add('date_check', last, undefined, 'available')
    if (rnd() < 0.18) add('chat_open', last)
    if (rnd() < 0.25) add('form_start', '/contact', undefined, 'inquiry')
    if (rnd() < 0.09) add('generate_lead', '/contact', undefined, 'inquiry')
    if (rnd() < 0.06) add('click_whatsapp', last)
    if (rnd() < 0.04) add('click_call', last)
    if (last === '/rezervare') {
      add('booking_start', last)
      if (rnd() < 0.3) add('begin_checkout', last, 450, 'fotograf-nunta')
    }
  }
}

for (let i = 0; i < rows.length; i += 50) {
  await Promise.all(rows.slice(i, i + 50).map((data) => payload.create({ collection: 'analytics-events', data: data as never })))
}
console.log(`Created ${rows.length} labelled demo events over 14 days.`)
process.exit(0)

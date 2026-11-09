import 'server-only'

import type { Locale } from '@/i18n/config'
import { getAvailabilityRules, isDateBookable, isRealDate } from '@/lib/availability'
import { getPayloadClient } from '@/lib/payload'
import { getLocations, getPricing, getServices, getSettings, populated } from '@/lib/queries'
import type { Service } from '@/payload-types'

import type { DateStatus, Knowledge } from './rules'

export async function checkDate(iso: string): Promise<DateStatus> {
  if (!isRealDate(iso)) return 'invalid'
  return isDateBookable(await getAvailabilityRules(), iso) ? 'available' : 'unavailable'
}

/** Everything the assistant may say comes from here: the studio's live CMS content. */
export async function loadKnowledge(lang: Locale): Promise<Knowledge> {
  const [settings, services, locations, pricing] = await Promise.all([getSettings(lang), getServices(lang), getLocations(lang), getPricing(lang)])
  const idOf = (v: Service | number | null | undefined) => (typeof v === 'object' && v ? v.id : (v ?? 0))
  return {
    business: {
      name: settings.businessName,
      phone: settings.phone,
      email: settings.email,
      whatsapp: settings.whatsapp,
      currency: settings.currency,
      depositPercent: pricing.depositPercent,
      city: settings.address?.city ?? '',
    },
    services: services.map((s) => ({
      slug: s.slug ?? '',
      title: s.title,
      excerpt: s.excerpt,
      startingPrice: s.startingPrice,
      packages: (s.packages ?? []).map((p) => ({ name: p.name, price: p.price, hours: p.hours, includes: p.includes ?? [] })),
      faqs: (s.faqs ?? []).map((f) => ({ question: f.question, answer: f.answer })),
    })),
    locations: locations.map((l) => ({ slug: l.slug ?? '', name: l.name, travelFee: l.travelFee ?? 0, isPrimary: Boolean(l.isPrimary) })),
    faqs: (settings.generalFaqs ?? []).map((f) => ({ question: f.question, answer: f.answer })),
    rates: (pricing.rates ?? []).map((r) => {
      const serviceId = idOf(r.service)
      return { serviceId, serviceSlug: services.find((s) => s.id === serviceId)?.slug ?? '', baseFee: r.baseFee, hourlyRate: r.hourlyRate, minHours: r.minHours, maxHours: r.maxHours }
    }),
    addOns: (pricing.addOns ?? []).map((a, i) => ({
      id: a.id ?? String(i),
      name: a.name,
      price: a.price,
      unit: a.unit === 'perHour' ? 'perHour' : 'flat',
      serviceIds: (a.services ?? []).map((s) => idOf(populated<Service>(s) ?? (s as number))),
    })),
  }
}

/** Messages the assistant answered with Claude today, to cap API spend per day. */
export async function aiMessagesToday(): Promise<number> {
  const payload = await getPayloadClient()
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  const res = await payload.find({
    collection: 'chat-conversations',
    where: { and: [{ updatedAt: { greater_than_equal: start.toISOString() } }, { mode: { equals: 'ai' } }] },
    limit: 2000,
    depth: 0,
    select: { messageCount: true },
  })
  return res.docs.reduce((sum, d) => sum + (d.messageCount ?? 0), 0)
}

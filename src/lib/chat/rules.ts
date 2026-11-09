/**
 * Built-in answers for the website assistant, used when no Claude API key is set or the API fails.
 * Everything comes from the studio's own CMS data, so it can never invent a price or a promise.
 */
import { type Locale, withLocale } from '@/i18n/config'
import { formatMoney } from '@/lib/utils'

export type Knowledge = {
  business: { name: string; phone: string; email: string; whatsapp?: string | null; currency: string; depositPercent: number; city: string }
  services: Array<{
    slug: string
    title: string
    excerpt: string
    startingPrice: number
    packages: Array<{ name: string; price: number; hours?: number | null; includes: string[] }>
    faqs: Array<{ question: string; answer: string }>
  }>
  locations: Array<{ slug: string; name: string; travelFee: number; isPrimary: boolean }>
  faqs: Array<{ question: string; answer: string }>
  rates: Array<{ serviceSlug: string; baseFee: number; hourlyRate: number; minHours: number; maxHours: number; serviceId: number }>
  addOns: Array<{ id: string; name: string; price: number; unit: 'flat' | 'perHour'; serviceIds: number[] }>
}

export type DateStatus = 'available' | 'unavailable' | 'invalid'
export type ChatAction =
  | { type: 'lead_form'; service?: string; date?: string; location?: string }
  | { type: 'link'; label: string; href: string }
export type ChatAnswer = { text: string; actions: ChatAction[]; topic: string; answered: boolean }

export const normalize = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()

const MONTHS: Record<string, number> = {
  ianuarie: 1, ian: 1, january: 1, jan: 1, februarie: 2, feb: 2, february: 2, martie: 3, mar: 3, march: 3, aprilie: 4, apr: 4, april: 4,
  mai: 5, may: 5, iunie: 6, iun: 6, june: 6, jun: 6, iulie: 7, iul: 7, july: 7, jul: 7, august: 8, aug: 8, septembrie: 9, sept: 9, sep: 9, september: 9,
  // Not "noi": it is also Romanian for "we".
  octombrie: 10, oct: 10, october: 10, noiembrie: 11, november: 11, nov: 11, decembrie: 12, dec: 12, december: 12,
}

const iso = (y: number, m: number, d: number) => {
  const out = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const check = new Date(`${out}T12:00:00Z`)
  return check.getUTCMonth() + 1 === m && check.getUTCDate() === d ? out : null
}

/** Finds a date in free text: 2027-06-12, 12.06.2027, 12/06, "12 iunie 2027", "June 12". */
export function parseDate(text: string, today = new Date()): string | null {
  const t = normalize(text)
  const nextOccurrence = (m: number, d: number) => {
    const thisYear = iso(today.getUTCFullYear(), m, d)
    if (thisYear && thisYear >= today.toISOString().slice(0, 10)) return thisYear
    return iso(today.getUTCFullYear() + 1, m, d)
  }
  let m = t.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/)
  if (m) return iso(+m[1], +m[2], +m[3])
  m = t.match(/\b(\d{1,2})[./-](\d{1,2})[./-](20\d{2})\b/)
  if (m) return iso(+m[3], +m[2], +m[1])
  // Not "8.5 ore" / "2.5 hours".
  m = t.match(/\b(\d{1,2})[./](\d{1,2})\b(?!\s*(?:ore|ora|h\b|hours?|euro|eur|€|%))/)
  if (m) return nextOccurrence(+m[2], +m[1])
  const names = Object.keys(MONTHS).sort((a, b) => b.length - a.length).join('|')
  // "mai" is also Romanian for "more": "2 mai multe pachete" is not 2 May.
  m = t.match(new RegExp(`\\b(\\d{1,2})\\s*(?:of\\s+)?(${names})\\b(?!\\s+(?:mult|multe|multi|putin|putine|bine|ales))\\.?(?:\\s+(20\\d{2}))?`))
  if (m) return m[3] ? iso(+m[3], MONTHS[m[2]], +m[1]) : nextOccurrence(MONTHS[m[2]], +m[1])
  m = t.match(new RegExp(`\\b(${names})\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b(?:,?\\s+(20\\d{2}))?`))
  if (m) return m[3] ? iso(+m[3], MONTHS[m[1]], +m[2]) : nextOccurrence(MONTHS[m[1]], +m[2])
  return null
}

const has = (t: string, words: RegExp) => words.test(t)
const STOP = new Set('care este sunt pentru cum cand unde cat cate din la de si sau the what when where how much many for are you your can do does with and'.split(' '))
const tokens = (s: string) => normalize(s).split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w))

/** Best FAQ by shared words; demands at least two so a single common word cannot answer wrongly. */
export function matchFaq(question: string, faqs: Knowledge['faqs']) {
  const asked = new Set(tokens(question))
  let best: { faq: Knowledge['faqs'][number]; score: number } | null = null
  for (const faq of faqs) {
    const score = tokens(faq.question).filter((w) => asked.has(w)).length
    if (score >= 2 && (!best || score > best.score)) best = { faq, score }
  }
  return best?.faq ?? null
}

const SERVICE_TOPICS: RegExp[] = [/nunt|wedding|mire|mireasa|cununi/, /botez|baptism|christening/, /eveniment|event|corporate|petrecere|party/, /brand|companie|company|business/, /produs|product/, /portret|portrait|sedinta|familie|family/]
const VIDEO = /video|film|clip/

/** The service the visitor means: its topic must match, and "video" picks the video variant. */
export function findService(k: Knowledge, t: string) {
  const score = (s: Knowledge['services'][number]) => {
    const name = normalize(`${s.title} ${s.slug}`)
    let points = 0
    for (const topic of SERVICE_TOPICS) if (topic.test(t) && topic.test(name)) points += 3
    if (points && VIDEO.test(t)) points += VIDEO.test(name) ? 2 : -1
    if (!points && VIDEO.test(t) && VIDEO.test(name)) points = 1
    return points
  }
  let best: { service: Knowledge['services'][number]; points: number } | null = null
  for (const service of k.services) {
    const points = score(service)
    if (points > 0 && (!best || points > best.points)) best = { service, points }
  }
  return best?.service ?? null
}

const L = {
  ro: {
    hello: (n: string) => `Bună! Sunt asistentul virtual ${n}. Te pot ajuta cu prețuri, cu verificarea unei date sau cu zonele în care lucrăm. Cu ce începem?`,
    from: (s: string, p: string) => `${s}: de la ${p}`,
    pricesIntro: 'Iată prețurile de pornire:',
    pkgIntro: (s: string) => `Pachetele pentru ${s}:`,
    pkgLine: (n: string, p: string, h?: number | null) => `• ${n}: ${p}${h ? ` (${h} ore)` : ''}`,
    calc: 'Calculează un preț exact',
    book: 'Rezervă data',
    bookDate: 'Rezervă această dată',
    free: (d: string) => `Vești bune: ${d} este liberă în calendar acum. Data nu este blocată până nu o rezervi, așa că îți recomand să nu amâni.`,
    busy: (d: string) => `Din păcate, ${d} nu este disponibilă online. Lasă-ne datele tale și vedem dacă găsim o soluție sau o dată apropiată.`,
    askDate: 'Sigur! Pentru ce dată? Scrie-mi, de exemplu, 12 iunie 2027.',
    badDate: 'Nu am putut citi data. Încearcă, de exemplu, 12 iunie 2027.',
    deposit: (p: number) => `Pentru a rezerva data cerem un avans de ${p}%, pe care îl poți plăti online cu cardul. Restul se achită înainte de eveniment.`,
    areas: (a: string) => `Lucrăm în ${a}. Taxele de deplasare, unde există, apar în calculatorul de preț.`,
    placeFree: (p: string) => `Da, lucrăm în ${p}, fără taxă de deplasare.`,
    placeFee: (p: string, f: string) => `Da, lucrăm în ${p}. Taxa de deplasare este ${f}.`,
    contact: (b: Knowledge['business']) => `Îți răspundem cu drag personal. Ne găsești la ${b.phone} sau ${b.email}. Dacă preferi, lasă-ne datele aici și te contactăm noi.`,
    unknown: 'Nu am un răspuns sigur la asta și prefer să nu ghicesc. Lasă-ne datele tale și îți răspunde direct cineva din echipă, de obicei în aceeași zi.',
    portfolio: 'Vezi portofoliul',
    pricing: 'Vezi prețurile',
  },
  en: {
    hello: (n: string) => `Hi! I'm the ${n} virtual assistant. I can help with prices, checking a date or the areas we cover. Where shall we start?`,
    from: (s: string, p: string) => `${s}: from ${p}`,
    pricesIntro: 'Here are our starting prices:',
    pkgIntro: (s: string) => `Packages for ${s}:`,
    pkgLine: (n: string, p: string, h?: number | null) => `• ${n}: ${p}${h ? ` (${h} hours)` : ''}`,
    calc: 'Calculate an exact price',
    book: 'Book a date',
    bookDate: 'Book this date',
    free: (d: string) => `Good news: ${d} is free in the calendar right now. It is not held until you book it, so I would not wait too long.`,
    busy: (d: string) => `Sorry, ${d} is not available online. Leave your details and we will see if we can make it work or suggest a nearby date.`,
    askDate: 'Of course! Which date? For example: 12 June 2027.',
    badDate: "I couldn't read that date. Try, for example, 12 June 2027.",
    deposit: (p: number) => `We take a ${p}% deposit to reserve your date, which you can pay online by card. The rest is due before the event.`,
    areas: (a: string) => `We work across ${a}. Any travel fee appears in the quote calculator.`,
    placeFree: (p: string) => `Yes, we work in ${p}, with no travel fee.`,
    placeFee: (p: string, f: string) => `Yes, we work in ${p}. The travel fee is ${f}.`,
    contact: (b: Knowledge['business']) => `Happy to talk in person. Reach us at ${b.phone} or ${b.email}, or leave your details here and we will contact you.`,
    unknown: "I don't have a reliable answer to that and would rather not guess. Leave your details and someone from the team will reply directly, usually the same day.",
    portfolio: 'See the portfolio',
    pricing: 'See prices',
  },
} as const

export const humanDate = (isoDate: string, lang: Locale) =>
  new Intl.DateTimeFormat(lang === 'ro' ? 'ro-RO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${isoDate}T12:00:00Z`))

export async function answerWithRules(opts: {
  message: string
  knowledge: Knowledge
  lang: Locale
  checkDate: (iso: string) => Promise<DateStatus>
  today?: Date
}): Promise<ChatAnswer> {
  const { message, knowledge: k, lang, checkDate, today } = opts
  const l = L[lang]
  const t = normalize(message)
  const href = (p: string) => withLocale(p, lang)
  const money = (n: number) => formatMoney(n, k.business.currency, lang)
  const service = findService(k, t)
  const pricingLink: ChatAction = { type: 'link', label: l.calc, href: href(service ? `/pricing?service=${service.slug}` : '/pricing') }

  const date = parseDate(message, today)
  const wantsDate = has(t, /liber|disponibil|ocupat|avail|free on|\bfree\b|data mea|data de|check.*date/)
  if (date) {
    const status = await checkDate(date)
    if (status === 'available') {
      return { text: l.free(humanDate(date, lang)), topic: 'availability', answered: true, actions: [{ type: 'link', label: l.bookDate, href: href(`/book?date=${date}${service ? `&service=${service.slug}` : ''}`) }, { type: 'lead_form', date, service: service?.title }] }
    }
    if (status === 'unavailable') return { text: l.busy(humanDate(date, lang)), topic: 'availability', answered: true, actions: [{ type: 'lead_form', date, service: service?.title }] }
    return { text: l.badDate, topic: 'availability', answered: false, actions: [] }
  }
  if (wantsDate) return { text: l.askDate, topic: 'availability', answered: true, actions: [] }

  if (has(t, /avans|garantie|deposit|arvun/)) return { text: l.deposit(k.business.depositPercent), topic: 'deposit', answered: true, actions: [{ type: 'link', label: l.book, href: href('/book') }] }

  if (has(t, /pret|\bcost|tarif|pachet|price|how much|cat e\b|cat este|package|\brates?\b/)) {
    if (service?.packages.length) {
      return { text: [l.pkgIntro(service.title), ...service.packages.map((p) => l.pkgLine(p.name, money(p.price), p.hours))].join('\n'), topic: 'price', answered: true, actions: [pricingLink, { type: 'link', label: l.book, href: href(`/book?service=${service.slug}`) }] }
    }
    return { text: [l.pricesIntro, ...k.services.map((s) => `• ${l.from(s.title, money(s.startingPrice))}`)].join('\n'), topic: 'price', answered: true, actions: [pricingLink] }
  }

  const faq = matchFaq(message, [...(service?.faqs ?? []), ...k.services.flatMap((s) => s.faqs), ...k.faqs])
  if (faq) return { text: faq.answer, topic: 'faq', answered: true, actions: [{ type: 'lead_form', service: service?.title }] }

  const place = k.locations.find((p) => t.includes(normalize(p.name)))
  if (has(t, /telefon|\bsun|whatsapp|email|contact|vorbesc|vorbi|om real|persoana|human|person|\bcall\b|talk to|speak to/)) {
    return { text: l.contact(k.business), topic: 'contact', answered: true, actions: [{ type: 'lead_form', service: service?.title, location: place?.name }] }
  }
  if (place) return { text: place.travelFee ? l.placeFee(place.name, money(place.travelFee)) : l.placeFree(place.name), topic: 'areas', answered: true, actions: [pricingLink, { type: 'link', label: l.book, href: href('/book') }] }
  if (has(t, /zona|zone|deplasar|ilfov|bucuresti|travel|area|location|unde lucrati/)) {
    return { text: l.areas(k.locations.map((p) => p.name).join(', ')), topic: 'areas', answered: true, actions: [pricingLink] }
  }
  if (has(t, /rezerv|\bbook|programez/)) return { text: l.askDate, topic: 'booking', answered: true, actions: [{ type: 'link', label: l.book, href: href(`/book${service ? `?service=${service.slug}` : ''}`) }] }
  if (has(t, /portofoliu|portfolio|exemple|examples|poze|lucrari/)) return { text: service ? service.excerpt : k.services.map((s) => s.title).join(', '), topic: 'portfolio', answered: true, actions: [{ type: 'link', label: l.portfolio, href: href('/portfolio') }] }
  if (service) return { text: `${service.excerpt}\n${l.from(service.title, money(service.startingPrice))}`, topic: 'service', answered: true, actions: [pricingLink, { type: 'link', label: l.book, href: href(`/book?service=${service.slug}`) }] }
  if (has(t, /^(buna|salut|hello|hi|hey|neata|servus)\b/)) return { text: l.hello(k.business.name), topic: 'greeting', answered: true, actions: [] }

  return { text: l.unknown, topic: 'unknown', answered: false, actions: [{ type: 'lead_form' }] }
}

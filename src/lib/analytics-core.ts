/** Pure helpers for first-party analytics (no server-only imports, so they can be unit tested). */

/** Every event the site may report. Anything else is rejected by /api/pulse. */
export const EVENT_TYPES = [
  'pageview',
  'engage', // value = engaged seconds, label = max scroll %
  'cta',
  'click_call',
  'click_email',
  'click_whatsapp',
  'form_start',
  'generate_lead',
  'booking_start',
  'booking_step',
  'begin_checkout',
  'quote_used',
  'date_check',
  'chat_open',
  'chat_message',
  'chat_lead',
  'leave_offer',
  'vital', // value = metric value, label = LCP | INP | CLS | TTFB | FCP
] as const
export type EventType = (typeof EVENT_TYPES)[number]

export const isEventType = (v: unknown): v is EventType => typeof v === 'string' && (EVENT_TYPES as readonly string[]).includes(v)

/** Events that mean "this visitor became a lead or tried to book". */
export const CONVERSION_EVENTS: readonly EventType[] = ['generate_lead', 'chat_lead', 'begin_checkout']
/** Interactions that show a visitor did not bounce, even on a single page. */
export const ENGAGEMENT_EVENTS: readonly EventType[] = [
  'cta', 'click_call', 'click_email', 'click_whatsapp', 'form_start', 'generate_lead', 'booking_start', 'booking_step',
  'begin_checkout', 'quote_used', 'date_check', 'chat_open', 'chat_message', 'chat_lead',
]

const BOT_RE = /(?<!cu)bot|crawl|spider|slurp|facebookexternalhit|whatsapp\/|preview|lighthouse|pagespeed|headless|phantom|puppeteer|playwright|curl|wget|python-requests|axios|node-fetch/i

export const isBot = (ua: string | null | undefined) => !ua || BOT_RE.test(ua)

export type Device = 'mobile' | 'tablet' | 'desktop'

export function deviceFrom(ua: string): Device {
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) return 'tablet'
  if (/mobi|iphone|ipod|android/i.test(ua)) return 'mobile'
  return 'desktop'
}

export type Channel = 'direct' | 'organic' | 'social' | 'paid' | 'email' | 'referral' | 'ai'

const SEARCH_RE = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|yandex|brave)\./i
const AI_RE = /(chatgpt|openai|perplexity|claude|gemini|copilot)\./i
const SOCIAL_RE = /(facebook|fb|instagram|tiktok|youtube|pinterest|linkedin|twitter|x|threads|vimeo|whatsapp)\.(com|me|net)$/i

/** Where a visit came from, from its UTM tags and referrer (the site's own host counts as none). */
export function channelFrom(input: { utmSource?: string | null; utmMedium?: string | null; referrerHost?: string | null }): Channel {
  const medium = (input.utmMedium ?? '').toLowerCase()
  const source = (input.utmSource ?? '').toLowerCase()
  if (/cpc|ppc|paid|display|ads?$/.test(medium)) return 'paid'
  if (medium === 'email' || source === 'newsletter') return 'email'
  if (/social/.test(medium) || /instagram|facebook|tiktok|pinterest/.test(source)) return 'social'
  if (medium === 'organic') return 'organic'
  const host = (input.referrerHost ?? '').toLowerCase()
  if (!host) return source ? 'referral' : 'direct'
  if (AI_RE.test(host)) return 'ai'
  if (SEARCH_RE.test(host)) return 'organic'
  if (SOCIAL_RE.test(host.replace(/^(www|m|l|lm)\./, ''))) return 'social'
  return 'referral'
}

/** Hostname of a referrer URL, or null when it is missing, invalid or this site itself. */
export function referrerHost(referrer: string | null | undefined, ownHost: string | null | undefined): string | null {
  if (!referrer) return null
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '')
    return ownHost && host === ownHost.replace(/^www\./, '').split(':')[0] ? null : host
  } catch {
    return null
  }
}

/** Keeps only a clean path: no query string (it may hold tokens or emails) and no private areas. */
export function cleanPath(raw: unknown): string | null {
  if (typeof raw !== 'string' || !raw.startsWith('/') || raw.length > 300) return null
  const path = raw.split(/[?#]/)[0].replace(/\/+$/, '') || '/'
  // Private client galleries carry the client's name in the URL.
  if (/^\/(en\/client|galerie-client)\/.+/.test(path)) return path.startsWith('/en') ? '/en/client/*' : '/galerie-client/*'
  return path
}

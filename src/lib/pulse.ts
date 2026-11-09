import type { EventType } from './analytics-core'

/** Browser side of the first-party analytics: batches events and sends them to /api/pulse. */

type Queued = { t: EventType; p: string; v?: number; l?: string }

const CONSENT_RE = /(?:^|; )nl_consent=granted/
const queue: Queued[] = []
let timer: ReturnType<typeof setTimeout> | undefined
let referrer: string | undefined
let utm: Record<string, string> | undefined
let captured = false

/** Campaign and referrer of the landing page; kept for the whole page life. */
function capture() {
  if (captured) return
  captured = true
  referrer = document.referrer.slice(0, 500) || undefined
  // Only the tags the report uses, trimmed: an over-long ad tag must not lose the visit.
  const entries = [...new URLSearchParams(location.search).entries()].filter(([k]) => ['utm_source', 'utm_medium', 'utm_campaign'].includes(k)).map(([k, v]) => [k, v.slice(0, 100)])
  if (entries.length) utm = Object.fromEntries(entries)
}

/** The long-lived visitor id exists only after the visitor accepted analytics. */
function visitorId(): string | undefined {
  if (!CONSENT_RE.test(document.cookie)) return undefined
  try {
    let id = localStorage.getItem('nl_vid') ?? undefined
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('nl_vid', id)
    }
    return id
  } catch {
    return undefined
  }
}

/** True on a new visit by someone we have seen before (consenting visitors only). */
export function isReturningVisit(): boolean {
  if (!CONSENT_RE.test(document.cookie)) return false
  try {
    const last = Number(localStorage.getItem('nl_last') || 0)
    localStorage.setItem('nl_last', String(Date.now()))
    return last > 0 && Date.now() - last > 30 * 60 * 1000
  } catch {
    return false
  }
}

export function flushPulse() {
  clearTimeout(timer)
  timer = undefined
  if (!queue.length) return
  const body = JSON.stringify({ e: queue.splice(0, 20), r: referrer, u: utm, lang: document.documentElement.lang, id: visitorId() })
  const sent = navigator.sendBeacon?.('/api/pulse', new Blob([body], { type: 'application/json' }))
  if (!sent) fetch('/api/pulse', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => undefined)
  if (queue.length) flushPulse()
}

export function pulse(type: EventType, opts: { value?: number; label?: string; path?: string } = {}) {
  if (typeof window === 'undefined') return
  capture()
  queue.push({ t: type, p: opts.path ?? location.pathname, v: opts.value, l: opts.label?.slice(0, 80) })
  timer ??= setTimeout(flushPulse, 1000)
}

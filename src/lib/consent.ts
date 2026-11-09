import { isEventType } from './analytics-core'
import { pulse } from './pulse'

/** Cookie storing the visitor's analytics choice ("granted" | "denied"), read before GA loads. */
export const CONSENT_COOKIE = 'nl_consent'
/** Window event that reopens the cookie banner (footer "Cookie settings" link). */
export const CONSENT_OPEN_EVENT = 'nl:consent-open'

type Gtag = (...args: unknown[]) => void

/** Reports an event to the studio's own analytics and, when configured and allowed, to GA4. */
export function track(event: string, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === 'undefined') return
  if (isEventType(event)) pulse(event, { value: typeof params.value === 'number' ? params.value : undefined, label: params.label != null ? String(params.label) : undefined })
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  gtag?.('event', event, params)
}

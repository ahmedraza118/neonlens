/** Cookie storing the visitor's analytics choice ("granted" | "denied"), read before GA loads. */
export const CONSENT_COOKIE = 'nl_consent'
/** Window event that reopens the cookie banner (footer "Cookie settings" link). */
export const CONSENT_OPEN_EVENT = 'nl:consent-open'

type Gtag = (...args: unknown[]) => void

/** Sends a GA4 event; a no-op when analytics is not configured or blocked. */
export function track(event: string, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  gtag?.('event', event, params)
}

import 'server-only'

import { createHash, timingSafeEqual } from 'crypto'

/** The last hop is the one our own proxy added; earlier entries can be set by the visitor. */
export function clientIp(req: Pick<Request, 'headers'>): string {
  return req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() || req.headers.get('x-real-ip') || 'unknown'
}

/** True unless the browser says the request came from another site. Never throws on `Origin: null`. */
export function isSameOrigin(req: Pick<Request, 'headers'>): boolean {
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (!origin || !host) return true
  return URL.canParse(origin) && new URL(origin).host === host
}

const secret = () => process.env.PAYLOAD_SECRET || 'dev-secret'

/**
 * Identifies a visitor for one day only, without storing their IP: the hash changes at midnight UTC
 * and cannot be reversed or linked to the previous day's hash.
 */
export function dailyVisitorHash(ip: string, ua: string, day = new Date().toISOString().slice(0, 10)): string {
  return createHash('sha256').update(`${secret()}|${day}|${ip}|${ua}`).digest('hex').slice(0, 24)
}

/** One-way hash of an IP for abuse limits. */
export function ipHash(ip: string): string {
  return createHash('sha256').update(`${secret()}|ip|${ip}`).digest('hex').slice(0, 24)
}

const buckets = new Map<string, { count: number; resetAt: number }>()

/**
 * Fixed-window limiter in this server instance's memory. On serverless it is per instance, so it
 * stops bursts rather than giving an exact global limit; the chat also has a database-backed cap.
 */
export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  if (buckets.size > 10_000) for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  bucket.count++
  return bucket.count <= limit
}

/** Constant-time comparison for secrets such as the cron token. */
export function safeEqual(a: string, b: string): boolean {
  const x = createHash('sha256').update(a).digest()
  const y = createHash('sha256').update(b).digest()
  return timingSafeEqual(x, y)
}

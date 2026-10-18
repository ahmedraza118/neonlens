import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Signed cookie that unlocks private client galleries. Stateless: it lists the gallery IDs the
 * visitor has entered a correct password for, plus an expiry, signed with PAYLOAD_SECRET.
 */
export const CLIENT_COOKIE = 'nl_client'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30

type SessionPayload = { g: Array<number | string>; exp: number }

function sign(value: string): string {
  return createHmac('sha256', process.env.PAYLOAD_SECRET || 'dev-secret').update(value).digest('base64url')
}

export function encodeClientSession(galleryIds: Array<number | string>): string {
  const payload: SessionPayload = { g: galleryIds, exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS }
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${sign(body)}`
}

export function decodeClientSession(token: string | undefined | null): Array<string> {
  if (!token) return []
  const [body, signature] = token.split('.')
  if (!body || !signature) return []
  const expected = Buffer.from(sign(body))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return []
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as SessionPayload
    if (payload.exp < Date.now() / 1000) return []
    return payload.g.map(String)
  } catch {
    return []
  }
}

/** Reads the cookie straight from a raw Cookie header (used inside Payload access control). */
export function galleryIdsFromCookieHeader(header: string | null | undefined): Array<string> {
  if (!header) return []
  const match = header.split(/;\s*/).find((c) => c.startsWith(`${CLIENT_COOKIE}=`))
  return decodeClientSession(match ? decodeURIComponent(match.slice(CLIENT_COOKIE.length + 1)) : null)
}

export const clientCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MAX_AGE_SECONDS,
}

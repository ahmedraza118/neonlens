import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Signed cookie that unlocks private client galleries. Stateless: it lists the galleries the
 * visitor entered a correct password for, plus an expiry, signed with PAYLOAD_SECRET.
 *
 * Each entry carries a short fingerprint of the gallery's password hash, so changing the password
 * in the admin locks out every visitor who unlocked it with the old one (validateGalleryAccess).
 */
export const CLIENT_COOKIE = 'nl_client'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export type GalleryEntry = { id: string; v: string }
type SessionPayload = { g: GalleryEntry[]; exp: number }

function secret(): string {
  const value = process.env.PAYLOAD_SECRET
  if (!value && process.env.NODE_ENV === 'production') throw new Error('PAYLOAD_SECRET must be set in production')
  return value || 'dev-secret'
}

function sign(value: string): string {
  return createHmac('sha256', secret()).update(value).digest('base64url')
}

/** Fingerprint of a gallery's current password (changes when the password changes). */
export function passwordVersion(passwordHash: string | null | undefined): string {
  return sign(`pw:${passwordHash ?? ''}`).slice(0, 16)
}

export function encodeClientSession(entries: GalleryEntry[]): string {
  const payload: SessionPayload = { g: entries, exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS }
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${sign(body)}`
}

export function decodeClientSession(token: string | undefined | null): GalleryEntry[] {
  if (!token) return []
  const [body, signature] = token.split('.')
  if (!body || !signature) return []
  const expected = Buffer.from(sign(body))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return []
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as SessionPayload
    if (payload.exp < Date.now() / 1000 || !Array.isArray(payload.g)) return []
    return payload.g.filter((e) => e && typeof e === 'object' && e.id && e.v).map((e) => ({ id: String(e.id), v: String(e.v) }))
  } catch {
    return []
  }
}

/** Reads the cookie straight from a raw Cookie header (used inside Payload access control). */
export function galleryEntriesFromCookieHeader(header: string | null | undefined): GalleryEntry[] {
  if (!header) return []
  const match = header.split(/;\s*/).find((c) => c.startsWith(`${CLIENT_COOKIE}=`))
  return decodeClientSession(match ? decodeURIComponent(match.slice(CLIENT_COOKIE.length + 1)) : null)
}

type GalleryForCheck = { id: number | string; passwordHash?: string | null; expiresAt?: string | null }

/** Ids of the galleries this cookie still grants: right password version and not expired. */
export function validGalleryIds(entries: GalleryEntry[], galleries: GalleryForCheck[]): string[] {
  const now = Date.now()
  return galleries
    .filter((g) => !(g.expiresAt && new Date(g.expiresAt).getTime() < now))
    .filter((g) => entries.some((e) => e.id === String(g.id) && e.v === passwordVersion(g.passwordHash)))
    .map((g) => String(g.id))
}

export const clientCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MAX_AGE_SECONDS,
}

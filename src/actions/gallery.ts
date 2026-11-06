'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { fmt, type Locale, toLocale, withLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { CLIENT_COOKIE, clientCookieOptions, encodeClientSession, passwordVersion } from '@/lib/client-session'
import { findGalleryBySlug, getUnlockedGallery, isExpired, sessionEntries } from '@/lib/galleries'
import { notifyStudio } from '@/lib/notify'
import { getPayloadClient } from '@/lib/payload'
import { verifyPassword } from '@/lib/password'
import { slugify } from '@/lib/utils'

export type UnlockState = { message: string }

/**
 * Password-guessing throttle, keyed by visitor IP + gallery so a stranger cannot lock a real
 * client out. In-memory, so on serverless it only slows guessing per instance: the real
 * protection is that gallery passwords are required to be long (see ClientGalleries).
 */
const attempts = new Map<string, { count: number; until: number }>()
const MAX_ATTEMPTS = 5

async function visitorIp(): Promise<string> {
  const h = await headers()
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

export async function unlockGallery(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const locale = toLocale(formData.get('lang'))
  const t = getDictionary(locale)
  const slug = slugify(String(formData.get('slug') ?? ''))
  const password = String(formData.get('password') ?? '')
  if (!slug || !password) return { message: t.actions.enterCode }

  const key = `${await visitorIp()}:${slug}`
  const throttle = attempts.get(key)
  const blocked = throttle && throttle.until > Date.now()
  if (blocked && throttle.count >= MAX_ATTEMPTS) {
    return { message: t.actions.tooMany }
  }

  const gallery = await findGalleryBySlug(slug)
  if (!gallery || !verifyPassword(password, gallery.passwordHash)) {
    attempts.set(key, { count: (blocked ? throttle.count : 0) + 1, until: Date.now() + 15 * 60 * 1000 })
    if (attempts.size > 10_000) attempts.clear() // bound memory
    return { message: t.actions.noMatch }
  }
  if (isExpired(gallery)) return { message: t.actions.galleryExpired }

  attempts.delete(key)
  const others = (await sessionEntries()).filter((e) => e.id !== String(gallery.id))
  const entries = [...others, { id: String(gallery.id), v: passwordVersion(gallery.passwordHash) }]
  ;(await cookies()).set(CLIENT_COOKIE, encodeClientSession(entries), clientCookieOptions)
  redirect(withLocale(`/client/${gallery.slug}`, locale))
}

export async function toggleFavourite(slug: string, mediaId: number, lang: Locale = 'en'): Promise<{ favourites: number[]; error?: string }> {
  const t = getDictionary(toLocale(lang))
  const gallery = await getUnlockedGallery(slug)
  if (!gallery) return { favourites: [], error: t.actions.sessionExpired }
  if (gallery.status === 'submitted' || gallery.status === 'delivered') {
    return { favourites: (gallery.favourites ?? []) as number[], error: t.actions.alreadySubmitted }
  }

  const payload = await getPayloadClient()
  const photo = await payload.findByID({ collection: 'client-media', id: mediaId, depth: 0, overrideAccess: true }).catch(() => null)
  const photoGallery = typeof photo?.gallery === 'object' ? photo?.gallery?.id : photo?.gallery
  if (!photo || photoGallery !== gallery.id) return { favourites: [], error: t.actions.photoNotFound }

  const current = ((gallery.favourites ?? []) as Array<number | { id: number }>).map((f) => (typeof f === 'object' ? f.id : f))
  const isFav = current.includes(mediaId)
  if (!isFav && gallery.selectionLimit && current.length >= gallery.selectionLimit) {
    return { favourites: current, error: fmt(t.actions.limit, { limit: gallery.selectionLimit }) }
  }
  const favourites = isFav ? current.filter((id) => id !== mediaId) : [...current, mediaId]
  await payload.update({ collection: 'client-galleries', id: gallery.id, data: { favourites }, context: { disableRevalidate: true } })
  return { favourites }
}

export async function submitSelection(slug: string, rawNotes: unknown, lang: Locale = 'en'): Promise<{ ok: boolean; error?: string }> {
  const t = getDictionary(toLocale(lang))
  const gallery = await getUnlockedGallery(slug)
  if (!gallery) return { ok: false, error: t.actions.sessionExpired }
  // Only while proofing: a delivered gallery cannot be sent back, and repeat submits do not re-notify.
  if (gallery.status !== 'proofing') return { ok: false, error: t.actions.alreadySubmitted }
  const notes = typeof rawNotes === 'string' ? rawNotes.slice(0, 5000) : ''
  const payload = await getPayloadClient()
  await payload.update({
    collection: 'client-galleries',
    id: gallery.id,
    data: { status: 'submitted', clientNotes: notes, submittedAt: new Date().toISOString() },
  })
  await notifyStudio(`📸 Selection submitted: ${gallery.title}`, [
    ['Client', gallery.clientName],
    ['Favourites', String((gallery.favourites ?? []).length)],
    ['Notes', notes],
  ])
  revalidatePath(withLocale(`/client/${slug}`, toLocale(lang)))
  return { ok: true }
}

export async function lockGalleries(formData: FormData) {
  ;(await cookies()).delete(CLIENT_COOKIE)
  redirect(withLocale('/client', toLocale(formData.get('lang'))))
}

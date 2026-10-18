'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { CLIENT_COOKIE, clientCookieOptions, encodeClientSession } from '@/lib/client-session'
import { findGalleryBySlug, getUnlockedGallery, isExpired, unlockedGalleryIds } from '@/lib/galleries'
import { notifyStudio } from '@/lib/notify'
import { getPayloadClient } from '@/lib/payload'
import { verifyPassword } from '@/lib/password'
import { slugify } from '@/lib/utils'

export type UnlockState = { message: string }

// Naive in-memory throttle against password guessing (per server instance).
const attempts = new Map<string, { count: number; until: number }>()

export async function unlockGallery(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const slug = slugify(String(formData.get('slug') ?? ''))
  const password = String(formData.get('password') ?? '')
  if (!slug || !password) return { message: 'Enter your gallery code and password.' }

  const throttle = attempts.get(slug)
  if (throttle && throttle.count >= 5 && throttle.until > Date.now()) {
    return { message: 'Too many attempts. Please wait 15 minutes or contact us.' }
  }

  const gallery = await findGalleryBySlug(slug)
  if (!gallery || !verifyPassword(password, gallery.passwordHash)) {
    attempts.set(slug, { count: (throttle?.count ?? 0) + 1, until: Date.now() + 15 * 60 * 1000 })
    return { message: 'That code and password combination did not match.' }
  }
  if (isExpired(gallery)) return { message: 'This gallery has expired. Contact us and we will reopen it.' }

  attempts.delete(slug)
  const ids = new Set([...(await unlockedGalleryIds()), String(gallery.id)])
  ;(await cookies()).set(CLIENT_COOKIE, encodeClientSession([...ids]), clientCookieOptions)
  redirect(`/client/${gallery.slug}`)
}

export async function toggleFavourite(slug: string, mediaId: number): Promise<{ favourites: number[]; error?: string }> {
  const gallery = await getUnlockedGallery(slug)
  if (!gallery) return { favourites: [], error: 'Session expired — please log in again.' }
  if (gallery.status === 'submitted' || gallery.status === 'delivered') {
    return { favourites: (gallery.favourites ?? []) as number[], error: 'Your selection is already submitted.' }
  }

  const payload = await getPayloadClient()
  const photo = await payload.findByID({ collection: 'client-media', id: mediaId, depth: 0, overrideAccess: true }).catch(() => null)
  const photoGallery = typeof photo?.gallery === 'object' ? photo?.gallery?.id : photo?.gallery
  if (!photo || photoGallery !== gallery.id) return { favourites: [], error: 'Photo not found.' }

  const current = ((gallery.favourites ?? []) as Array<number | { id: number }>).map((f) => (typeof f === 'object' ? f.id : f))
  const isFav = current.includes(mediaId)
  if (!isFav && gallery.selectionLimit && current.length >= gallery.selectionLimit) {
    return { favourites: current, error: `You can pick up to ${gallery.selectionLimit} photos.` }
  }
  const favourites = isFav ? current.filter((id) => id !== mediaId) : [...current, mediaId]
  await payload.update({ collection: 'client-galleries', id: gallery.id, data: { favourites }, context: { disableRevalidate: true } })
  return { favourites }
}

export async function submitSelection(slug: string, notes: string): Promise<{ ok: boolean; error?: string }> {
  const gallery = await getUnlockedGallery(slug)
  if (!gallery) return { ok: false, error: 'Session expired — please log in again.' }
  const payload = await getPayloadClient()
  await payload.update({
    collection: 'client-galleries',
    id: gallery.id,
    data: { status: 'submitted', clientNotes: notes.slice(0, 5000), submittedAt: new Date().toISOString() },
  })
  await notifyStudio(`📸 Selection submitted: ${gallery.title}`, [
    ['Client', gallery.clientName],
    ['Favourites', String((gallery.favourites ?? []).length)],
    ['Notes', notes],
  ])
  revalidatePath(`/client/${slug}`)
  return { ok: true }
}

export async function lockGalleries() {
  ;(await cookies()).delete(CLIENT_COOKIE)
  redirect('/client')
}

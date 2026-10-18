import 'server-only'

import { cookies } from 'next/headers'

import { CLIENT_COOKIE, decodeClientSession } from './client-session'
import { getPayloadClient } from './payload'

export async function unlockedGalleryIds(): Promise<string[]> {
  const jar = await cookies()
  return decodeClientSession(jar.get(CLIENT_COOKIE)?.value)
}

export async function findGalleryBySlug(slug: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'client-galleries', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  return res.docs[0] ?? null
}

export function isExpired(gallery: { expiresAt?: string | null }): boolean {
  return Boolean(gallery.expiresAt && new Date(gallery.expiresAt) < new Date())
}

/** Returns the gallery only when the visitor has unlocked it (or null). */
export async function getUnlockedGallery(slug: string) {
  const gallery = await findGalleryBySlug(slug)
  if (!gallery) return null
  const ids = await unlockedGalleryIds()
  return ids.includes(String(gallery.id)) ? gallery : null
}

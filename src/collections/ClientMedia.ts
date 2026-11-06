import { randomBytes } from 'crypto'
import path from 'path'
import type { Access, CollectionBeforeOperationHook, CollectionConfig } from 'payload'

import { galleryEntriesFromCookieHeader, validGalleryIds } from '@/lib/client-session'

/**
 * Private client photos. Not readable publicly: the visitor needs either an admin login or the
 * signed gallery cookie for the gallery the photo belongs to (current password, not expired).
 * File URLs go through Payload, so this applies to the image files too.
 */
const readClientMedia: Access = async ({ req }) => {
  if (req.user) return true
  const entries = galleryEntriesFromCookieHeader(req.headers.get('cookie'))
  if (entries.length === 0) return false
  const galleries = await req.payload.find({
    collection: 'client-galleries',
    where: { id: { in: entries.map((e) => e.id) } },
    depth: 0,
    limit: entries.length,
    overrideAccess: true,
    select: { passwordHash: true, expiresAt: true },
    req,
  })
  const ids = validGalleryIds(entries, galleries.docs)
  return ids.length > 0 ? { gallery: { in: ids } } : false
}

/**
 * Unguessable file names. With cloud storage the files themselves sit at public storage URLs, so
 * names like "ana-mihai-001.jpg" could be guessed; a random suffix makes every URL a secret.
 */
const randomFilename: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if ((operation === 'create' || operation === 'update') && req.file) {
    const ext = path.extname(req.file.name).toLowerCase()
    const base = path.basename(req.file.name, path.extname(req.file.name)).slice(0, 60)
    req.file.name = `${base}-${randomBytes(12).toString('hex')}${ext}`
  }
  return args
}

export const ClientMedia: CollectionConfig = {
  slug: 'client-media',
  labels: { singular: 'Client photo', plural: 'Client photos' },
  admin: { group: 'Clients', defaultColumns: ['filename', 'gallery', 'createdAt'] },
  access: {
    read: readClientMedia,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: { beforeOperation: [randomFilename] },
  fields: [
    { name: 'gallery', type: 'relationship', relationTo: 'client-galleries', required: true, index: true },
    { name: 'alt', type: 'text' },
  ],
  upload: {
    staticDir: 'client-media',
    mimeTypes: ['image/*'],
    // Private photos must never be stored by shared caches/CDNs or kept after logout.
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'private, no-store')
      headers.set('X-Robots-Tag', 'noindex, nofollow')
      return headers
    },
    imageSizes: [
      { name: 'thumb', width: 640, formatOptions: { format: 'webp', options: { quality: 75 } } },
      { name: 'preview', width: 1800, formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
  },
}

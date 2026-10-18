import type { Access, CollectionConfig } from 'payload'

import { galleryIdsFromCookieHeader } from '@/lib/client-session'

/**
 * Private client photos. Not readable publicly: the visitor needs either an admin login or the
 * signed gallery cookie for the gallery the photo belongs to. File URLs go through Payload,
 * so this applies to the image files too.
 */
const readClientMedia: Access = ({ req }) => {
  if (req.user) return true
  const ids = galleryIdsFromCookieHeader(req.headers.get('cookie'))
  if (ids.length === 0) return false
  return { gallery: { in: ids } }
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
  fields: [
    { name: 'gallery', type: 'relationship', relationTo: 'client-galleries', required: true, index: true },
    { name: 'alt', type: 'text' },
  ],
  upload: {
    staticDir: 'client-media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumb', width: 640, formatOptions: { format: 'webp', options: { quality: 75 } } },
      { name: 'preview', width: 1800, formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
  },
}

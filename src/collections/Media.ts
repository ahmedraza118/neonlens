import path from 'path'
import type { CollectionBeforeOperationHook, CollectionConfig } from 'payload'

import { anyone, isAdmin } from '@/lib/access'
import { isGenericFilename, slugify } from '@/lib/utils'

/**
 * Renames camera-default file names (IMG_4021.jpg) to a descriptive slug built from the alt
 * text, e.g. "miri-la-apus-palatul-mogosoaia.jpg". Google Images uses file names.
 */
const descriptiveFilename: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (operation !== 'create' && operation !== 'update') return args
  const file = req.file
  const data = (args as { data?: Record<string, unknown> }).data
  const alt = (data?.alt as string | undefined) ?? (req.data?.alt as string | undefined)
  if (file && alt && isGenericFilename(file.name)) {
    file.name = `${slugify(alt).slice(0, 60)}${path.extname(file.name).toLowerCase()}`
  }
  return args
}

/** Tiny base64 preview used as the blur-up placeholder by next/image. */
const blurPlaceholder: NonNullable<CollectionConfig['hooks']>['beforeChange'] = [
  async ({ data, req }) => {
    if (!req.file?.data || !req.file.mimetype?.startsWith('image/')) return data
    try {
      const sharp = (await import('sharp')).default
      const buffer = await sharp(req.file.data).resize(16).blur().jpeg({ quality: 40 }).toBuffer()
      data.blurDataURL = `data:image/jpeg;base64,${buffer.toString('base64')}`
    } catch (err) {
      req.payload.logger.warn({ err, msg: 'Could not generate blur placeholder' })
    }
    return data
  },
]

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'tags'],
    description:
      'Upload photos at full resolution (JPEG/PNG/WebP/AVIF/HEIC, any size) and videos (MP4 H.264 or WebM; MP4 H.265 for 4K). Originals are kept untouched; the site serves sharp, right-sized versions to each screen automatically.',
  },
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: { beforeOperation: [descriptiveFilename], beforeChange: blurPlaceholder },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description:
          'Describe what is in the photo + where. E.g. "Miri la apus în grădina Palatului Mogoșoaia" (switch the editor to English for the English text). Run `npm run alt-text` to generate these with AI.',
      },
    },
    { name: 'caption', type: 'text', localized: true },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: {
        condition: (data) => typeof data?.mimeType === 'string' && data.mimeType.startsWith('video/'),
        description: 'Still image shown before the video loads (recommended: a frame from the video, 1920px wide).',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: { description: 'Keywords used for search and filtering (AI can fill these).' },
    },
    {
      name: 'altNeedsReview',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Set by the AI alt-text script — check and untick.' },
    },
    { name: 'blurDataURL', type: 'text', admin: { hidden: true } },
  ],
  upload: {
    // Images plus web-playable video. Large films are best streamed through Mux (video field).
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'video/quicktime'],
    focalPoint: true,
    crop: true,
    // No `formatOptions` on purpose: the original upload is stored exactly as sent (no lossy
    // re-encode). next/image generates the responsive AVIF/WebP versions from it on demand.
    imageSizes: [
      { name: 'thumb', width: 480, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 960, formatOptions: { format: 'webp', options: { quality: 85 } } },
      { name: 'large', width: 1920, formatOptions: { format: 'webp', options: { quality: 88 } } },
      // Social cards must be JPEG/PNG: many platforms (and next/og) can't read WebP.
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'jpeg', options: { quality: 80 } },
      },
    ],
  },
}

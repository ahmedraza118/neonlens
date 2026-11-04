import type { Field, FieldHook } from 'payload'

import { slugify } from '@/lib/utils'

const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    const source = data?.[fallback] ?? originalDoc?.[fallback]
    return typeof source === 'string' ? slugify(source) : value
  }

/**
 * URL slug, auto-generated from `fallback` (usually the title) when left empty. Translated: each
 * language has its own slug (/servicii/fotograf-nunta vs /en/services/wedding-photography).
 */
export const slugField = (fallback = 'title', { localized = true }: { localized?: boolean } = {}): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  localized,
  admin: {
    position: 'sidebar',
    description:
      'URL segment for this language. Leave empty to generate it from the title. Use the words people search for (e.g. "fotograf-nunta"). Changing it later breaks existing links.',
  },
  hooks: { beforeValidate: [formatSlug(fallback)] },
})

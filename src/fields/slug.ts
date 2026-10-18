import type { Field, FieldHook } from 'payload'

import { slugify } from '@/lib/utils'

const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    const source = data?.[fallback] ?? originalDoc?.[fallback]
    return typeof source === 'string' ? slugify(source) : value
  }

/** URL slug, auto-generated from `fallback` (usually the title) when left empty. */
export const slugField = (fallback = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'URL segment. Leave empty to generate from the title. Changing it breaks existing links.',
  },
  hooks: { beforeValidate: [formatSlug(fallback)] },
})

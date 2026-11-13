import type { Field } from 'payload'

/** Per-document SEO overrides. Everything is optional — sensible defaults are derived from content. */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  admin: { position: 'sidebar' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: { description: 'The complete title shown in Google (used as is). Max ~60 characters: main keyword + area first, brand last, e.g. "Fotograf nuntă București și Ilfov | Lumenza".' },
      maxLength: 70,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: '140–160 characters. Shown in Google results — write it like an ad.' },
      maxLength: 170,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Social share image. Defaults to the cover image.' },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Hide this page from search engines.' },
    },
  ],
}

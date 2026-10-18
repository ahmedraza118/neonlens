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
      admin: { description: 'Max ~60 characters. Put the main keyword + city first.' },
      maxLength: 70,
    },
    {
      name: 'description',
      type: 'textarea',
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

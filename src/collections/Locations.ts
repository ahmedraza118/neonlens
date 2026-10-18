import type { CollectionConfig } from 'payload'

import { faqsField } from '@/fields/faqs'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidateHooks } from '@/hooks/revalidate'
import { anyone, isAdmin } from '@/lib/access'

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'region', 'isPrimary'],
    description:
      'Cities you work in. Each location × service combination gets its own landing page — write unique local content so the pages are not thin duplicates.',
  },
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'region', type: 'text', admin: { description: 'County / state.' } },
    { name: 'isPrimary', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      admin: { description: 'Why you love shooting here, how you know the area. Unique per city.' },
    },
    {
      name: 'venues',
      type: 'array',
      admin: { description: 'Venues and photo spots you know — great for local search.' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'serviceNotes',
      type: 'array',
      admin: { description: 'Optional extra copy for a specific service in this city.' },
      fields: [
        { name: 'service', type: 'relationship', relationTo: 'services', required: true },
        { name: 'content', type: 'textarea', required: true },
      ],
    },
    { name: 'nearbyAreas', type: 'text', hasMany: true },
    {
      name: 'geo',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    { name: 'travelFee', type: 'number', defaultValue: 0, admin: { description: 'Added to quotes.' } },
    faqsField,
    seoField,
  ],
}

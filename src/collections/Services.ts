import type { CollectionConfig } from 'payload'

import { faqsField } from '@/fields/faqs'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { videoField } from '@/fields/video'
import { revalidateHooks } from '@/hooks/revalidate'
import { anyone, isAdmin } from '@/lib/access'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'startingPrice', 'order'],
    description: 'Each service gets its own page plus one page per location (e.g. /services/wedding-photography/cluj-napoca).',
  },
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  defaultSort: 'order',
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'e.g. "Wedding Photography"' } },
    slugField(),
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'photo',
      options: [
        { label: 'Photography', value: 'photo' },
        { label: 'Videography', value: 'video' },
        { label: 'Photo + Video', value: 'hybrid' },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'tagline', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea', required: true, admin: { description: 'Short summary for cards.' } },
    { name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      admin: { description: 'Opening paragraphs. Separate paragraphs with a blank line.' },
    },
    {
      name: 'highlights',
      type: 'array',
      admin: { description: 'What is included / why choose us.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'process',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'startingPrice',
      type: 'number',
      required: true,
      admin: { description: 'Lowest package price. Shown as "from €X" and in structured data.' },
    },
    {
      name: 'packages',
      type: 'array',
      admin: { description: 'Bookable packages. Clients pay a deposit online via Stripe.' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'price', type: 'number', required: true },
        { name: 'hours', type: 'number', admin: { description: 'Coverage hours (optional).' } },
        { name: 'description', type: 'textarea' },
        { name: 'includes', type: 'text', hasMany: true },
        { name: 'popular', type: 'checkbox', defaultValue: false },
      ],
    },
    videoField,
    faqsField,
    {
      name: 'keywords',
      type: 'text',
      hasMany: true,
      admin: { position: 'sidebar', description: 'Search phrases this page should rank for.' },
    },
    seoField,
  ],
}

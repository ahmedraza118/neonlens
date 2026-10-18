import type { CollectionConfig } from 'payload'

import { faqsField } from '@/fields/faqs'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidateHooks } from '@/hooks/revalidate'
import { isAdmin, publishedOrAdmin } from '@/lib/access'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    description: 'Answer the questions buyers search for: prices, venues, how-tos, checklists.',
  },
  access: { read: publishedOrAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  versions: { drafts: true },
  defaultSort: '-publishedAt',
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'category',
      type: 'select',
      defaultValue: 'guides',
      options: [
        { label: 'Pricing', value: 'pricing' },
        { label: 'Guides', value: 'guides' },
        { label: 'Venues & locations', value: 'venues' },
        { label: 'Behind the scenes', value: 'bts' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
    { name: 'author', type: 'text', defaultValue: 'NeonLens Studio', admin: { position: 'sidebar' } },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'content', type: 'richText', required: true },
    { name: 'relatedServices', type: 'relationship', relationTo: 'services', hasMany: true },
    { name: 'relatedLocation', type: 'relationship', relationTo: 'locations' },
    faqsField,
    seoField,
  ],
}

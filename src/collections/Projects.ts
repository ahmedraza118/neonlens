import type { CollectionConfig } from 'payload'

import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { videoField } from '@/fields/video'
import { revalidateHooks } from '@/hooks/revalidate'
import { isAdmin, publishedOrAdmin } from '@/lib/access'

/** Portfolio case studies: brief → approach → result → testimonial. */
export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'service', 'location', 'date', '_status'],
    description: 'Write a full case study for each project — these pages rank for long-tail searches and convince clients.',
  },
  access: { read: publishedOrAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  versions: { drafts: true },
  defaultSort: '-date',
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      type: 'row',
      fields: [
        { name: 'service', type: 'relationship', relationTo: 'services', required: true },
        { name: 'location', type: 'relationship', relationTo: 'locations' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'clientType', type: 'text', admin: { description: 'e.g. "Couple", "Tech start-up"' } },
        { name: 'venue', type: 'text' },
        { name: 'date', type: 'date', required: true },
      ],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'brief', type: 'textarea', required: true, admin: { description: 'What did the client need?' } },
    { name: 'approach', type: 'richText', admin: { description: 'How you planned and shot it.' } },
    { name: 'result', type: 'textarea', admin: { description: 'Outcome — deliverables, numbers, reactions.' } },
    {
      name: 'deliverables',
      type: 'text',
      hasMany: true,
      admin: { description: 'e.g. "450 edited photos", "4-minute highlight film"' },
    },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    videoField,
    { name: 'testimonial', type: 'relationship', relationTo: 'testimonials' },
    { name: 'tags', type: 'text', hasMany: true, admin: { position: 'sidebar' } },
    seoField,
  ],
}

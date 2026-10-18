import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: { group: 'Settings' },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: 'heroEyebrow', type: 'text' },
    {
      name: 'heroHeading',
      type: 'text',
      required: true,
      admin: { description: 'The H1. Include what you do and where, e.g. "Wedding & brand films in Cluj-Napoca".' },
    },
    { name: 'heroSubheading', type: 'textarea' },
    { name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'heroVideoPlaybackId',
      type: 'text',
      admin: { description: 'Optional Mux playback ID for a muted looping showreel behind the hero.' },
    },
    { name: 'showreelPlaybackId', type: 'text', admin: { description: 'Optional full showreel (Mux).' } },
    {
      name: 'featuredProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      maxRows: 6,
      admin: { description: 'Leave empty to show projects marked "featured".' },
    },
    {
      name: 'process',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    { name: 'clientLogos', type: 'upload', relationTo: 'media', hasMany: true },
  ],
}

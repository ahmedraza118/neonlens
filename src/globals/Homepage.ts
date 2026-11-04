import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: { group: 'Settings' },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero carousel',
          description:
            'The full-width slideshow at the top of the home page. Leave "Slides" empty to show one slide per service automatically (its hero photo, title and tagline).',
          fields: [
            { name: 'heroEyebrow', type: 'text', localized: true },
            {
              name: 'heroHeading',
              type: 'text',
              required: true,
              localized: true,
              admin: { description: 'The page H1, shown above the slides. Include what you do and where, e.g. "Fotograf și videograf de nuntă în București și Ilfov".' },
            },
            { name: 'heroSubheading', type: 'textarea', localized: true },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: { description: 'Used for social sharing previews of the home page.' },
            },
            {
              name: 'heroAutoplaySeconds',
              type: 'number',
              defaultValue: 6,
              min: 3,
              max: 20,
              admin: { description: 'Seconds each slide stays before moving to the next.' },
            },
            {
              name: 'heroSlides',
              label: 'Slides',
              type: 'array',
              labels: { singular: 'Slide', plural: 'Slides' },
              admin: {
                description: 'One slide per service works best. Use 2400px+ wide photos (or a short MP4 loop) for a crisp full-screen look.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'service',
                  type: 'relationship',
                  relationTo: 'services',
                  admin: { description: 'Fills in any empty text, the image and the button link from this service.' },
                },
                { name: 'eyebrow', type: 'text', localized: true, admin: { description: 'Small label above the title. Default: service name.' } },
                { name: 'title', type: 'text', localized: true, admin: { description: 'Default: service tagline.' } },
                { name: 'text', type: 'textarea', localized: true, admin: { description: 'Default: service summary.' } },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  filterOptions: { mimeType: { contains: 'image' } },
                  admin: { description: 'Full-screen background. Default: the service hero image.' },
                },
                {
                  name: 'video',
                  type: 'upload',
                  relationTo: 'media',
                  filterOptions: { mimeType: { contains: 'video' } },
                  admin: { description: 'Optional silent background loop (MP4, 10–20 s, 1080p–4K). The image is shown until it plays.' },
                },
                { name: 'muxPlaybackId', type: 'text', admin: { description: 'Or: a Mux playback ID for the background loop.' } },
                {
                  type: 'row',
                  fields: [
                    { name: 'ctaLabel', type: 'text', localized: true, admin: { description: 'Default: "Explore <service>".' } },
                    { name: 'ctaLink', type: 'text', admin: { description: 'Default: the service page, e.g. /services/wedding-photography' } },
                  ],
                },
              ],
            },
            {
              name: 'heroVideoPlaybackId',
              type: 'text',
              admin: { description: 'Optional Mux playback ID: a muted showreel behind the first automatic slide.' },
            },
          ],
        },
        {
          label: 'Sections',
          fields: [
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
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'description', type: 'textarea', required: true, localized: true },
              ],
            },
            { name: 'clientLogos', type: 'upload', relationTo: 'media', hasMany: true },
          ],
        },
      ],
    },
  ],
}

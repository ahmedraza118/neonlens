import type { Field } from 'payload'

/**
 * Optional video: Mux (adaptive 4K streaming, best for long films), a file uploaded to the media
 * library (simple, good for short clips) or a YouTube embed.
 */
export const videoField: Field = {
  name: 'video',
  type: 'group',
  fields: [
    {
      name: 'provider',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Mux', value: 'mux' },
        { label: 'Uploaded file', value: 'upload' },
        { label: 'YouTube', value: 'youtube' },
      ],
    },
    {
      name: 'muxPlaybackId',
      type: 'text',
      admin: {
        condition: (_, sibling) => sibling?.provider === 'mux',
        description: 'Mux dashboard → Assets → your video → Playback ID (public).',
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'video' } },
      admin: {
        condition: (_, sibling) => sibling?.provider === 'upload',
        description: 'MP4 (H.264, up to 4K) or WebM from the media library. Add a poster image to the video in the library.',
      },
    },
    {
      name: 'youtubeId',
      type: 'text',
      admin: {
        condition: (_, sibling) => sibling?.provider === 'youtube',
        description: 'The part after "v=" in the YouTube URL.',
      },
    },
    { name: 'title', type: 'text', localized: true, admin: { condition: (_, s) => s?.provider !== 'none' } },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { condition: (_, s) => s?.provider !== 'none', description: 'Used for VideoObject SEO data.' },
    },
    {
      name: 'durationSeconds',
      type: 'number',
      admin: { condition: (_, s) => s?.provider !== 'none' },
    },
  ],
}

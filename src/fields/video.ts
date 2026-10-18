import type { Field } from 'payload'

/** Optional video: Mux (adaptive streaming, recommended) or a YouTube embed. */
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
      name: 'youtubeId',
      type: 'text',
      admin: {
        condition: (_, sibling) => sibling?.provider === 'youtube',
        description: 'The part after "v=" in the YouTube URL.',
      },
    },
    { name: 'title', type: 'text', admin: { condition: (_, s) => s?.provider !== 'none' } },
    {
      name: 'description',
      type: 'textarea',
      admin: { condition: (_, s) => s?.provider !== 'none', description: 'Used for VideoObject SEO data.' },
    },
    {
      name: 'durationSeconds',
      type: 'number',
      admin: { condition: (_, s) => s?.provider !== 'none' },
    },
  ],
}

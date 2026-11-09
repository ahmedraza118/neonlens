import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/lib/access'

/** Website assistant conversations. Read them to learn what clients ask and what is missing from the FAQ. */
export const ChatConversations: CollectionConfig = {
  slug: 'chat-conversations',
  labels: { singular: 'Chat conversation', plural: 'Chat conversations' },
  admin: {
    group: 'Growth',
    useAsTitle: 'preview',
    defaultColumns: ['preview', 'messageCount', 'leadCaptured', 'unanswered', 'mode', 'updatedAt'],
    description: 'Written by the website assistant. Answers it could not give show up under "Unanswered".',
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  defaultSort: '-updatedAt',
  fields: [
    { name: 'preview', type: 'text', admin: { readOnly: true } },
    { name: 'token', type: 'text', required: true, unique: true, index: true, access: { read: () => false }, admin: { hidden: true } },
    { name: 'ipHash', type: 'text', index: true, access: { read: () => false }, admin: { hidden: true } },
    { name: 'locale', type: 'text', admin: { position: 'sidebar', readOnly: true } },
    { name: 'startPage', type: 'text', admin: { position: 'sidebar', readOnly: true } },
    { name: 'mode', type: 'text', admin: { position: 'sidebar', readOnly: true, description: 'ai = Claude, rules = built-in answers (no API key or the API failed).' } },
    { name: 'messageCount', type: 'number', defaultValue: 0, admin: { position: 'sidebar', readOnly: true } },
    { name: 'unanswered', type: 'number', defaultValue: 0, admin: { position: 'sidebar', readOnly: true } },
    { name: 'leadCaptured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', readOnly: true } },
    { name: 'inquiry', type: 'relationship', relationTo: 'inquiries', admin: { position: 'sidebar', readOnly: true } },
    { name: 'topics', type: 'json', admin: { readOnly: true } },
    { name: 'messages', type: 'json', admin: { readOnly: true } },
  ],
}

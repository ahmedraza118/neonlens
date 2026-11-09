import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/lib/access'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    group: 'Leads & bookings',
    useAsTitle: 'name',
    defaultColumns: ['name', 'service', 'eventDate', 'budget', 'status', 'createdAt'],
  },
  // Created only by the server action (local API), never publicly.
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  defaultSort: '-createdAt',
  hooks: {
    // Records the first reply so the Growth dashboard can measure response time.
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        if (operation === 'update' && originalDoc?.status === 'new' && data.status && data.status !== 'new' && !originalDoc.contactedAt) {
          data.contactedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quote sent', value: 'quoted' },
        { label: 'Booked', value: 'booked' },
        { label: 'Lost', value: 'lost' },
      ],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'service', type: 'text' },
    { name: 'eventDate', type: 'date' },
    { name: 'location', type: 'text' },
    { name: 'budget', type: 'text' },
    { name: 'message', type: 'textarea' },
    { name: 'quoteSummary', type: 'textarea', admin: { description: 'Filled when sent from the quote calculator.' } },
    {
      name: 'locale',
      type: 'select',
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Română', value: 'ro' },
      ],
      admin: { position: 'sidebar', description: 'Language the client used on the website (emails are sent in it).' },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'form',
      admin: { position: 'sidebar', description: 'How this lead reached you.' },
      options: [
        { label: 'Inquiry form', value: 'form' },
        { label: 'Quote calculator', value: 'quote' },
        { label: 'Website assistant', value: 'chat' },
      ],
    },
    { name: 'contactedAt', type: 'date', admin: { position: 'sidebar', readOnly: true, description: 'Set automatically when the status first leaves New.' } },
    { name: 'sourcePage', type: 'text', admin: { position: 'sidebar' } },
    { name: 'referrer', type: 'text', admin: { position: 'sidebar' } },
    { name: 'utm', type: 'json', admin: { position: 'sidebar' } },
    { name: 'internalNotes', type: 'textarea' },
  ],
}

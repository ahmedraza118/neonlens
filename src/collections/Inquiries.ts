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
    { name: 'sourcePage', type: 'text', admin: { position: 'sidebar' } },
    { name: 'referrer', type: 'text', admin: { position: 'sidebar' } },
    { name: 'utm', type: 'json', admin: { position: 'sidebar' } },
    { name: 'internalNotes', type: 'textarea' },
  ],
}

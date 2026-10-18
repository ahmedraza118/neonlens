import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/lib/access'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    group: 'Leads & bookings',
    useAsTitle: 'name',
    defaultColumns: ['name', 'serviceTitle', 'packageName', 'date', 'status', 'depositAmount'],
    description: 'Created when a client starts checkout. Becomes "Deposit paid" after Stripe confirms payment, which blocks that date.',
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Awaiting payment', value: 'pending' },
        { label: 'Deposit paid', value: 'paid' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'date', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'service', type: 'relationship', relationTo: 'services', required: true },
    { name: 'serviceTitle', type: 'text' },
    { name: 'packageName', type: 'text', required: true },
    { name: 'packagePrice', type: 'number', required: true },
    { name: 'depositAmount', type: 'number', required: true },
    { name: 'currency', type: 'text', defaultValue: 'EUR' },
    { name: 'location', type: 'text' },
    { name: 'notes', type: 'textarea' },
    { name: 'stripeSessionId', type: 'text', index: true, admin: { readOnly: true } },
    { name: 'paidAt', type: 'date', admin: { readOnly: true } },
  ],
}

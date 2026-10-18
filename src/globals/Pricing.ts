import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

/** Drives the public quote calculator and the online deposit amount. */
export const Pricing: GlobalConfig = {
  slug: 'pricing',
  label: 'Pricing & quote calculator',
  admin: { group: 'Settings' },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'depositPercent',
      type: 'number',
      required: true,
      defaultValue: 30,
      min: 0,
      max: 100,
      admin: { description: 'Deposit charged online when a client books a package.' },
    },
    {
      name: 'estimateSpreadPercent',
      type: 'number',
      defaultValue: 10,
      admin: { description: 'The calculator shows a range of ± this percentage.' },
    },
    {
      name: 'rates',
      type: 'array',
      admin: { description: 'One row per service.' },
      fields: [
        { name: 'service', type: 'relationship', relationTo: 'services', required: true },
        {
          type: 'row',
          fields: [
            { name: 'baseFee', type: 'number', required: true, admin: { description: 'Fixed fee (editing, admin).' } },
            { name: 'hourlyRate', type: 'number', required: true },
            { name: 'minHours', type: 'number', required: true, defaultValue: 2 },
            { name: 'maxHours', type: 'number', required: true, defaultValue: 12 },
          ],
        },
      ],
    },
    {
      name: 'addOns',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'price', type: 'number', required: true },
            {
              name: 'unit',
              type: 'select',
              defaultValue: 'flat',
              options: [
                { label: 'Flat', value: 'flat' },
                { label: 'Per hour', value: 'perHour' },
              ],
            },
          ],
        },
        {
          name: 'services',
          type: 'relationship',
          relationTo: 'services',
          hasMany: true,
          admin: { description: 'Limit to these services. Empty = available for all.' },
        },
      ],
    },
  ],
}

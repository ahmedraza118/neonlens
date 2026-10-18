import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

export const Availability: GlobalConfig = {
  slug: 'availability',
  admin: {
    group: 'Leads & bookings',
    description: 'Dates with a paid booking are blocked automatically. Add holidays and external bookings here.',
  },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'bookingWindowDays',
      type: 'number',
      defaultValue: 540,
      admin: { description: 'How far ahead clients can book.' },
    },
    { name: 'minNoticeDays', type: 'number', defaultValue: 7 },
    {
      name: 'blockedWeekdays',
      type: 'select',
      hasMany: true,
      options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    {
      name: 'blockedDates',
      type: 'array',
      fields: [
        { name: 'date', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
        { name: 'reason', type: 'text' },
      ],
    },
  ],
}

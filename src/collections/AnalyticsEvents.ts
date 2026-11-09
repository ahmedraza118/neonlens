import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/lib/access'
import { EVENT_TYPES } from '@/lib/analytics-core'

/**
 * First-party website analytics. Written only by /api/pulse. Holds no names, emails or IP addresses:
 * `session` is a hash that changes every day, so a visitor cannot be followed across days without
 * consent (`visitor` is set only after they accept the cookie banner).
 */
export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics-events',
  labels: { singular: 'Analytics event', plural: 'Analytics events' },
  admin: {
    group: 'Growth',
    useAsTitle: 'type',
    defaultColumns: ['type', 'path', 'channel', 'device', 'value', 'createdAt'],
    description: 'Raw visit data. See the Growth dashboard for the summary.',
  },
  access: { read: isAdmin, create: isAdmin, update: () => false, delete: isAdmin },
  defaultSort: '-createdAt',
  fields: [
    { name: 'type', type: 'select', required: true, index: true, options: EVENT_TYPES.map((v) => ({ label: v, value: v })) },
    { name: 'path', type: 'text', index: true },
    { name: 'session', type: 'text', required: true, index: true },
    { name: 'visitor', type: 'text' },
    { name: 'channel', type: 'text' },
    { name: 'source', type: 'text' },
    { name: 'campaign', type: 'text' },
    { name: 'referrer', type: 'text' },
    { name: 'device', type: 'text' },
    { name: 'locale', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'value', type: 'number' },
    { name: 'label', type: 'text' },
  ],
  indexes: [{ fields: ['createdAt', 'type'] }],
}

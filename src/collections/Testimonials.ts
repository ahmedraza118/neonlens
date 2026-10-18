import type { CollectionConfig } from 'payload'

import { revalidateHooks } from '@/hooks/revalidate'
import { anyone, isAdmin } from '@/lib/access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { group: 'Content', useAsTitle: 'name', defaultColumns: ['name', 'rating', 'service', 'featured'] },
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', admin: { description: 'e.g. "Bride", "Marketing Lead at Acme"' } },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5, required: true },
    { name: 'date', type: 'date', required: true, defaultValue: () => new Date().toISOString() },
    { name: 'service', type: 'relationship', relationTo: 'services' },
    { name: 'source', type: 'select', defaultValue: 'google', options: ['google', 'direct', 'facebook', 'other'] },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}

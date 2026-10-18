import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'
import { isAdmin } from '@/lib/access'
import { hashPassword } from '@/lib/password'

/**
 * Private proofing galleries. Clients open /client/<slug>, enter the password, pick favourites,
 * leave notes, submit their selection and (when enabled) download the finals.
 */
export const ClientGalleries: CollectionConfig = {
  slug: 'client-galleries',
  admin: {
    group: 'Clients',
    useAsTitle: 'title',
    defaultColumns: ['title', 'clientName', 'status', 'eventDate', 'expiresAt'],
    description: 'Upload photos in "Client photos" and pick this gallery. Share the link /client/<slug> + the password.',
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (typeof data.newPassword === 'string' && data.newPassword.length > 0) {
          data.passwordHash = hashPassword(data.newPassword)
        }
        data.newPassword = ''
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      type: 'row',
      fields: [
        { name: 'clientName', type: 'text', required: true },
        { name: 'clientEmail', type: 'email' },
      ],
    },
    {
      name: 'newPassword',
      type: 'text',
      label: 'Set password',
      admin: { description: 'Type a new password to set/replace it. It is stored hashed and this field clears on save.' },
    },
    { name: 'passwordHash', type: 'text', admin: { hidden: true } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'proofing',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Editing in progress', value: 'editing' },
        { label: 'Ready for proofing', value: 'proofing' },
        { label: 'Selection submitted', value: 'submitted' },
        { label: 'Delivered', value: 'delivered' },
      ],
    },
    { name: 'eventDate', type: 'date', admin: { position: 'sidebar' } },
    { name: 'expiresAt', type: 'date', admin: { position: 'sidebar', description: 'Gallery locks after this date.' } },
    {
      name: 'selectionLimit',
      type: 'number',
      admin: { position: 'sidebar', description: 'Max favourites (e.g. album size). Empty = unlimited.' },
    },
    { name: 'allowDownloads', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'message', type: 'textarea', admin: { description: 'Welcome note shown to the client.' } },
    { name: 'videoPlaybackId', type: 'text', admin: { description: 'Optional Mux playback ID for the delivered film.' } },
    {
      name: 'favourites',
      type: 'relationship',
      relationTo: 'client-media',
      hasMany: true,
      admin: { description: 'Picked by the client.' },
    },
    { name: 'clientNotes', type: 'textarea', admin: { description: 'Notes left by the client.' } },
    { name: 'submittedAt', type: 'date', admin: { readOnly: true } },
  ],
}

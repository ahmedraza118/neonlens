import type { Access, CollectionConfig } from 'payload'

import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidateHooks } from '@/hooks/revalidate'
import { isAdmin } from '@/lib/access'

/** What each person does. Used for the filters on /echipa and as the job title in Google. */
export const DISCIPLINES = ['photographer', 'videographer', 'drone', 'editor', 'producer', 'assistant'] as const
export type Discipline = (typeof DISCIPLINES)[number]

/** Languages a team member can work in (shown on the profile; couples often ask for English). */
export const TEAM_LANGUAGES = ['ro', 'en', 'fr', 'it', 'de', 'es', 'hu'] as const

/** Visitors see only members marked visible; editors see everyone. */
const visibleOrAdmin: Access = ({ req }) => (req.user ? true : { visible: { equals: true } })

/**
 * The people behind the camera. Every visible member gets a profile page (/echipa/<name>), appears
 * on /echipa and the About page, and is listed on the service pages they work on. Link them to
 * portfolio projects with the project's "Crew" field.
 *
 * Business rule: clients book the studio, not a person. The site never offers to book or contact
 * an individual member, so do not add booking links or personal contact details to these pages.
 */
export const Team: CollectionConfig = {
  slug: 'team',
  labels: { singular: 'Team member', plural: 'Team' },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'disciplines', 'visible', 'order'],
    description:
      'Your photographers, videographers and crew. The site presents them as one team: profiles introduce each person, but visitors can only contact and book the studio, never a specific person.',
  },
  access: { read: visibleOrAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  defaultSort: 'order',
  hooks: revalidateHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%', description: 'Full name, e.g. "Andrei Popescu".' } },
        {
          name: 'role',
          type: 'text',
          required: true,
          localized: true,
          admin: { width: '50%', description: 'Shown under the name, e.g. "Fotograf principal" / "Lead photographer".' },
        },
      ],
    },
    {
      name: 'disciplines',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Photographer', value: 'photographer' },
        { label: 'Videographer', value: 'videographer' },
        { label: 'Drone pilot', value: 'drone' },
        { label: 'Editor / colourist', value: 'editor' },
        { label: 'Producer / coordinator', value: 'producer' },
        { label: 'Assistant', value: 'assistant' },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Portrait, ideally 4:5 (e.g. 1600×2000). Put the face near the top: use the focal point.' },
    },
    {
      name: 'signatureImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional: a favourite photo they took. Shown when visitors hover the portrait and on the profile.' },
    },
    {
      name: 'shortBio',
      type: 'textarea',
      required: true,
      localized: true,
      maxLength: 220,
      admin: { description: 'One or two sentences for the team cards (max 220 characters).' },
    },
    {
      name: 'bio',
      type: 'textarea',
      localized: true,
      admin: { description: 'The full story for the profile page. Separate paragraphs with a blank line.' },
    },
    { name: 'quote', type: 'text', localized: true, admin: { description: 'Optional: how they like to work, in their own words.' } },
    {
      type: 'row',
      fields: [
        {
          name: 'since',
          type: 'number',
          min: 1970,
          max: 2100,
          admin: { width: '33%', description: 'Year they started (shows "X years behind the camera").' },
        },
        {
          name: 'languages',
          type: 'select',
          hasMany: true,
          defaultValue: ['ro'],
          options: [
            { label: 'Romanian', value: 'ro' },
            { label: 'English', value: 'en' },
            { label: 'French', value: 'fr' },
            { label: 'Italian', value: 'it' },
            { label: 'German', value: 'de' },
            { label: 'Spanish', value: 'es' },
            { label: 'Hungarian', value: 'hu' },
          ],
          admin: { width: '67%' },
        },
      ],
    },
    {
      name: 'specialties',
      type: 'text',
      hasMany: true,
      localized: true,
      admin: { description: 'Short tags, e.g. "Documentary weddings", "Golden-hour portraits", "Drone".' },
    },
    {
      name: 'skills',
      type: 'array',
      labels: { singular: 'Skill', plural: 'Skills' },
      admin: {
        description:
          'Strongest first. Shown on the profile and merged into the team page\'s "What we cover together" board. Use the same name for a skill several people share (e.g. "Fotografie de nuntă") so they are grouped. Linking a service adds a link to that service page.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, localized: true, admin: { width: '45%', description: 'e.g. "Fotografie de nuntă" / "Wedding photography"' } },
            {
              name: 'level',
              type: 'select',
              required: true,
              defaultValue: 'advanced',
              options: [
                { label: '★★★★★ Expert', value: 'expert' },
                { label: '★★★★ Advanced', value: 'advanced' },
                { label: '★★★ Experienced', value: 'experienced' },
                { label: '★★ Growing', value: 'growing' },
              ],
              admin: { width: '25%' },
            },
            { name: 'service', type: 'relationship', relationTo: 'services', admin: { width: '30%', description: 'Optional' } },
          ],
        },
      ],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Services they work on. They appear on those service pages under "Your team".' },
    },
    { name: 'gear', type: 'text', localized: true, admin: { description: 'Optional: what is in their bag, e.g. "Sony A1, 35mm f/1.4, 85mm f/1.4".' } },
    {
      // Kept in the database but not editable or shown: clients contact the studio, never a team
      // member directly. (Removing the field would need a migration that rebuilds the table.)
      name: 'social',
      type: 'group',
      admin: { hidden: true },
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'website', type: 'text' },
        { name: 'linkedin', type: 'text' },
      ],
    },
    slugField('name', { localized: false }),
    { name: 'visible', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Untick to hide this person from the site.' } },
    { name: 'featured', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Show on the homepage.' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar', description: 'Lower numbers come first.' } },
    seoField,
  ],
}

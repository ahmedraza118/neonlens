import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Business & SEO settings',
  admin: { group: 'Settings' },
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Business',
          description: 'Keep name, address and phone (NAP) identical to your Google Business Profile.',
          fields: [
            { name: 'businessName', type: 'text', required: true },
            { name: 'tagline', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
            { name: 'email', type: 'email', required: true },
            { name: 'phone', type: 'text', required: true, admin: { description: 'International format: +40 712 345 678' } },
            { name: 'whatsapp', type: 'text', admin: { description: 'Digits only with country code, e.g. 40712345678' } },
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'street', type: 'text' },
                { name: 'city', type: 'text', required: true },
                { name: 'region', type: 'text' },
                { name: 'postalCode', type: 'text' },
                { name: 'country', type: 'text', required: true, defaultValue: 'RO', admin: { description: 'ISO code' } },
              ],
            },
            {
              name: 'geo',
              type: 'group',
              fields: [
                { name: 'lat', type: 'number' },
                { name: 'lng', type: 'number' },
              ],
            },
            { name: 'priceRange', type: 'text', defaultValue: '€€', admin: { description: 'Schema.org price range, e.g. €€' } },
            { name: 'currency', type: 'text', defaultValue: 'EUR', required: true },
            { name: 'foundingYear', type: 'number' },
            {
              name: 'openingHours',
              type: 'array',
              fields: [
                {
                  name: 'days',
                  type: 'select',
                  hasMany: true,
                  options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                },
                { name: 'opens', type: 'text', defaultValue: '09:00' },
                { name: 'closes', type: 'text', defaultValue: '18:00' },
              ],
            },
          ],
        },
        {
          label: 'Brand',
          fields: [
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
            {
              name: 'about',
              type: 'group',
              fields: [
                { name: 'heading', type: 'text' },
                { name: 'body', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'founderName', type: 'text' },
                { name: 'founderRole', type: 'text' },
              ],
            },
            {
              name: 'stats',
              type: 'array',
              maxRows: 4,
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Social & Google',
          fields: [
            {
              name: 'social',
              type: 'group',
              fields: [
                { name: 'instagram', type: 'text' },
                { name: 'tiktok', type: 'text' },
                { name: 'youtube', type: 'text' },
                { name: 'facebook', type: 'text' },
                { name: 'vimeo', type: 'text' },
                { name: 'linkedin', type: 'text' },
              ],
            },
            {
              name: 'googleBusinessProfileUrl',
              type: 'text',
              admin: { description: 'Your Google Maps listing URL. Used in structured data (sameAs).' },
            },
            {
              name: 'googleReviewUrl',
              type: 'text',
              admin: { description: 'Direct "write a review" link (Business Profile → Ask for reviews).' },
            },
            {
              name: 'googleRating',
              type: 'group',
              admin: { description: 'Shown on site. Keep in sync with Google — never inflate.' },
              fields: [
                { name: 'value', type: 'number', min: 1, max: 5 },
                { name: 'count', type: 'number' },
              ],
            },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            {
              name: 'generalFaqs',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
import { ro } from '@payloadcms/translations/languages/ro'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { AnalyticsEvents } from './collections/AnalyticsEvents'
import { Bookings } from './collections/Bookings'
import { ChatConversations } from './collections/ChatConversations'
import { ClientGalleries } from './collections/ClientGalleries'
import { ClientMedia } from './collections/ClientMedia'
import { Inquiries } from './collections/Inquiries'
import { Locations } from './collections/Locations'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Availability } from './globals/Availability'
import { Homepage } from './globals/Homepage'
import { Pricing } from './globals/Pricing'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// TURSO_* are the names Vercel's Turso integration sets; DATABASE_* are ours.
const dbUrl = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || 'file:./neonlens.db'

export default buildConfig({
  // No serverURL on purpose: upload URLs stay relative (/api/media/file/…) so next/image
  // treats them as local images, and absoluteUrl() adds the domain where one is required.
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · Lumenza CMS' },
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      afterNavLinks: ['@/components/admin/GrowthNavLink#GrowthNavLink'],
      views: { growth: { Component: '@/components/admin/GrowthView#GrowthView', path: '/growth', exact: true } },
    },
  },
  collections: [
    Projects,
    Services,
    Locations,
    Posts,
    Testimonials,
    Media,
    Inquiries,
    Bookings,
    ChatConversations,
    AnalyticsEvents,
    ClientGalleries,
    ClientMedia,
    Users,
  ],
  globals: [SiteSettings, Homepage, Pricing, Availability],
  // Content languages. Fields marked `localized: true` get one value per language; pick the
  // language at the top of the editor. Romanian is the main language of the site; text not
  // translated yet falls back to the other language.
  localization: {
    locales: [
      { code: 'ro', label: 'Română' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'ro',
    fallback: true,
  },
  // Language of the admin panel itself (each editor can switch it in their account settings).
  i18n: { supportedLanguages: { ro, en }, fallbackLanguage: 'ro' },
  // Full-resolution photos and video files are large: allow uploads up to 2 GB (self-hosted / local).
  // On Vercel the browser uploads straight to Blob storage instead (clientUploads below).
  upload: { limits: { fileSize: 2 * 1024 * 1024 * 1024 } },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // Local: a SQLite file. Production: a Turso (libSQL) URL + auth token — same adapter.
  db: sqliteAdapter({
    // Dev auto-syncs the schema of a LOCAL file only. A remote database (Turso, the live site) is
    // changed only by the files in src/migrations (`npx payload migrate`, and `npm run vercel-build`
    // on deploy): dev auto-sync on it collides with the migrated tables and can drop live data.
    // After changing fields run `npm run migrate:create`.
    push: dbUrl.startsWith('file:'),
    client: {
      url: dbUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN,
    },
  }),
  sharp,
  plugins: [
    // Serverless hosts have no persistent disk. When a Vercel Blob token is present,
    // uploads go to Blob storage; otherwise they are stored on local disk.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
        'client-media': { prefix: 'private' },
      },
      // No random suffix: Blob would rename stored files, but Payload keeps the original names for
      // the resized versions, so those URLs would 404. Payload already makes filenames unique.
      addRandomSuffix: false,
      // Vercel functions reject request bodies over 4.5 MB. With client uploads the admin sends
      // the file directly from the browser to Blob storage, so high-res photos and videos work.
      clientUploads: true,
      // Keep the storage columns in the schema even locally (no token), so the database
      // migrations match production, where the Blob token is set.
      alwaysInsertFields: true,
    }),
  ],
})

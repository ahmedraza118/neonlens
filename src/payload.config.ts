import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Bookings } from './collections/Bookings'
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

export default buildConfig({
  // No serverURL on purpose: upload URLs stay relative (/api/media/file/…) so next/image
  // treats them as local images, and absoluteUrl() adds the domain where one is required.
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · NeonLens CMS' },
    importMap: { baseDir: path.resolve(dirname) },
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
    ClientGalleries,
    ClientMedia,
    Users,
  ],
  globals: [SiteSettings, Homepage, Pricing, Availability],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // Local: a SQLite file. Production: a Turso (libSQL) URL + auth token — same adapter.
  db: sqliteAdapter({
    // Dev auto-syncs the schema. Production uses the files in src/migrations, applied once by
    // `npm run vercel-build` before building. After changing fields run `npm run migrate:create`.
    client: {
      // TURSO_* are the names Vercel's Turso integration sets; DATABASE_* are ours.
      url: process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || 'file:./neonlens.db',
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
      addRandomSuffix: true,
    }),
  ],
})

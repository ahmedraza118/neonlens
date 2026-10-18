/**
 * Applies database migrations before a production build: `npm run migrate`
 *
 * Unlike `payload migrate`, this never asks interactive questions (a build server cannot answer
 * them) and explains common setup mistakes in plain words instead of hanging or crashing.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { migrations } from '../src/migrations'

function fail(message: string): never {
  console.error(`\n✖ Database migration stopped.\n\n${message}\n`)
  process.exit(1)
}

async function run() {
  const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || ''
  const onVercel = Boolean(process.env.VERCEL)

  if (onVercel && (!url || url.startsWith('file:'))) {
    fail(
      'No database address found. In Vercel → Settings → Environment Variables, add DATABASE_URL (libsql://…)\n' +
        'and DATABASE_AUTH_TOKEN from Turso (or connect the Turso integration), tick "Production", then redeploy.\n' +
        'Variables only reach new deployments: add them first, then redeploy.',
    )
  }
  console.log(`→ Connecting to database at ${url.replace(/\?.*$/, '').replace(/\/\/[^@]*@/, '//') || '(default local file)'}`)

  const payload = await getPayload({ config })
  const db = payload.db

  const tables = await payload.db.drizzle
    .run(`SELECT name FROM sqlite_master WHERE type='table' AND name='payload_migrations'`)
    .then((res) => ('rows' in res ? res.rows.length : 0))
  if (tables > 0) {
    const applied = await payload.find({ collection: 'payload-migrations', limit: 0, depth: 0 })
    if (applied.docs.some((m) => m.batch === -1)) {
      fail(
        'This database was set up by the local dev server or `npm run seed` (development mode), so it cannot\n' +
          'be upgraded with migrations safely. Use a fresh, empty database for production:\n' +
          '  1. In Turso, create a new database (or delete and recreate this one).\n' +
          '  2. Update DATABASE_URL and DATABASE_AUTH_TOKEN in Vercel, then redeploy.\n' +
          'Keep your local .env on DATABASE_URL=file:./neonlens.db so this does not happen again.',
      )
    }
  }

  // The generated migration files are typed more strictly than the adapter expects; same shape at runtime.
  type MigrateArgs = NonNullable<Parameters<typeof db.migrate>[0]>
  await db.migrate({ migrations: migrations as unknown as MigrateArgs['migrations'] })
  console.log('✓ Database is up to date')
}

try {
  await run()
  process.exit(0)
} catch (err) {
  console.error(err)
  fail(
    'Could not migrate the database. If the error above mentions 401, "Unauthorized" or URL_INVALID,\n' +
      'copy DATABASE_URL and DATABASE_AUTH_TOKEN again from Turso into Vercel and redeploy.',
  )
}

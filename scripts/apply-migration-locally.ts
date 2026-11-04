/**
 * Applies the newest migration to a LOCAL development database (one created by `npm run dev` /
 * `npm run seed`), keeping its content: `npm run migrate:local`
 *
 * Local databases normally sync their schema automatically, but that sync cannot move existing
 * text into the new per-language tables (it would drop it). This runs the migration's own
 * data-preserving SQL instead. Back up neonlens.db first. Production uses `npm run migrate`.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { migrations } from '../src/migrations'

const name = process.argv[2] ?? migrations.at(-1)!.name
const migration = migrations.find((m) => m.name === name)
if (!migration) throw new Error(`Unknown migration ${name}`)

const payload = await getPayload({ config })
const db = payload.db.drizzle
const done = await db.run(`SELECT name FROM payload_migrations WHERE name = '${name}'`).catch(() => ({ rows: [] }))
if ('rows' in done && done.rows.length > 0) {
  console.log(`✓ ${name} is already applied`)
  process.exit(0)
}

await db.run('PRAGMA foreign_keys = OFF')
// The generated files are typed more strictly than the adapter; same shape at runtime.
await migration.up({ db, payload, req: {} } as unknown as Parameters<typeof migration.up>[0])
await db.run('PRAGMA foreign_keys = ON')
await payload.create({ collection: 'payload-migrations', data: { name, batch: -1 } })
console.log(`✓ Applied ${name} to ${process.env.DATABASE_URL || 'file:./neonlens.db'}`)
process.exit(0)

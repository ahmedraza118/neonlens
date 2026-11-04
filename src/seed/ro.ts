/**
 * Adds the Romanian version of the demo content to an already-seeded database, without deleting
 * anything: `npm run seed:ro`
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { applyRomanian } from './romanian'

try {
  const payload = await getPayload({ config })
  await applyRomanian(payload)
  process.exit(0)
} catch (err) {
  console.error(err)
  process.exit(1)
}

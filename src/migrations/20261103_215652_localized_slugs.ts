import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Slugs become per-language: remember the current ones (they are English) before their
  // columns are dropped, and store them as the English slugs once the new columns exist.
  const saved = await readSlugs(db)

  await db.run(sql`DROP INDEX \`projects_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`slug\`;`)
  await db.run(sql`DROP INDEX \`_projects_v_version_version_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_slug\`;`)
  await db.run(sql`DROP INDEX \`services_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`services\` DROP COLUMN \`slug\`;`)
  await db.run(sql`DROP INDEX \`locations_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`locations\` DROP COLUMN \`slug\`;`)
  await db.run(sql`DROP INDEX \`posts_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`slug\`;`)
  await db.run(sql`DROP INDEX \`_posts_v_version_version_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`version_slug\`;`)
  await db.run(sql`ALTER TABLE \`projects_locales\` ADD \`slug\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`projects_slug_idx\` ON \`projects_locales\` (\`slug\`,\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`_projects_v_locales\` ADD \`version_slug\` text;`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_slug_idx\` ON \`_projects_v_locales\` (\`version_slug\`,\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`services_locales\` ADD \`slug\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`services_slug_idx\` ON \`services_locales\` (\`slug\`,\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`locations_locales\` ADD \`slug\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`locations_slug_idx\` ON \`locations_locales\` (\`slug\`,\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`posts_locales\` ADD \`slug\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_slug_idx\` ON \`posts_locales\` (\`slug\`,\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`_posts_v_locales\` ADD \`version_slug\` text;`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_slug_idx\` ON \`_posts_v_locales\` (\`version_slug\`,\`_locale\`);`)

  await writeSlugs(db, saved, 'en')
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`projects_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`projects_locales\` DROP COLUMN \`slug\`;`)
  await db.run(sql`DROP INDEX \`_projects_v_version_version_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v_locales\` DROP COLUMN \`version_slug\`;`)
  await db.run(sql`DROP INDEX \`services_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`services_locales\` DROP COLUMN \`slug\`;`)
  await db.run(sql`DROP INDEX \`locations_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`locations_locales\` DROP COLUMN \`slug\`;`)
  await db.run(sql`DROP INDEX \`posts_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`posts_locales\` DROP COLUMN \`slug\`;`)
  await db.run(sql`DROP INDEX \`_posts_v_version_version_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v_locales\` DROP COLUMN \`version_slug\`;`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`slug\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`projects_slug_idx\` ON \`projects\` (\`slug\`);`)
  await db.run(sql`ALTER TABLE \`_projects_v\` ADD \`version_slug\` text;`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_slug_idx\` ON \`_projects_v\` (\`version_slug\`);`)
  await db.run(sql`ALTER TABLE \`services\` ADD \`slug\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`services_slug_idx\` ON \`services\` (\`slug\`);`)
  await db.run(sql`ALTER TABLE \`locations\` ADD \`slug\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`locations_slug_idx\` ON \`locations\` (\`slug\`);`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`slug\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_slug\` text;`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_slug_idx\` ON \`_posts_v\` (\`version_slug\`);`)
}

type Db = MigrateUpArgs['db']
type Saved = Array<{ table: string; column: string; rows: Array<{ id: number; slug: string | null }> }>

const SLUG_TABLES = [
  { table: 'services', column: 'slug' },
  { table: 'locations', column: 'slug' },
  { table: 'projects', column: 'slug' },
  { table: 'posts', column: 'slug' },
  { table: '_projects_v', column: 'version_slug' },
  { table: '_posts_v', column: 'version_slug' },
]

async function readSlugs(db: Db): Promise<Saved> {
  const saved: Saved = []
  for (const { table, column } of SLUG_TABLES) {
    const res = (await db.run(sql.raw(`SELECT \`id\`, \`${column}\` AS slug FROM \`${table}\``))) as unknown as { rows?: Array<{ id: number; slug: string | null }> }
    saved.push({ table, column, rows: res.rows ?? [] })
  }
  return saved
}

async function writeSlugs(db: Db, saved: Saved, locale: string) {
  for (const { table, column, rows } of saved) {
    for (const row of rows) {
      if (!row.slug) continue
      await db.run(sql`UPDATE ${sql.raw(`\`${table}_locales\``)} SET ${sql.raw(`\`${column}\``)} = ${row.slug} WHERE \`_parent_id\` = ${row.id} AND \`_locale\` = ${locale}`)
    }
  }
}

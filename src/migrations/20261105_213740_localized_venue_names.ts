import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Rebuild the language table with the new NOT NULL `name` column (SQLite cannot add one to a
  // table that has rows), filling it with each venue's current name for every language row, and
  // an English row for venues that had none. The result matches the schema Payload expects.
  await db.run(sql`CREATE TABLE \`__new_locations_venues_locales\` (
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`locations_venues\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`INSERT INTO \`__new_locations_venues_locales\` (\`name\`, \`description\`, \`id\`, \`_locale\`, \`_parent_id\`)
    SELECT COALESCE(v.\`name\`, ''), l.\`description\`, l.\`id\`, l.\`_locale\`, l.\`_parent_id\`
    FROM \`locations_venues_locales\` l LEFT JOIN \`locations_venues\` v ON v.\`id\` = l.\`_parent_id\`;`)
  await db.run(sql`INSERT INTO \`__new_locations_venues_locales\` (\`name\`, \`_locale\`, \`_parent_id\`)
    SELECT v.\`name\`, 'en', v.\`id\` FROM \`locations_venues\` v
    WHERE NOT EXISTS (SELECT 1 FROM \`locations_venues_locales\` l WHERE l.\`_parent_id\` = v.\`id\`);`)
  await db.run(sql`DROP TABLE \`locations_venues_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_locations_venues_locales\` RENAME TO \`locations_venues_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`locations_venues_locales_locale_parent_id_unique\` ON \`locations_venues_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`locations_venues_locales_parent_id_idx\` ON \`locations_venues_locales\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`locations_venues\` DROP COLUMN \`name\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`locations_venues\` ADD \`name\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`locations_venues_locales\` DROP COLUMN \`name\`;`)
}

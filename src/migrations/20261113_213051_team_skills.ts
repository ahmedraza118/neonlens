import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`team_skills\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`level\` text DEFAULT 'advanced' NOT NULL,
  	\`service_id\` integer,
  	FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`team_skills_order_idx\` ON \`team_skills\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`team_skills_parent_id_idx\` ON \`team_skills\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`team_skills_service_idx\` ON \`team_skills\` (\`service_id\`);`)
  await db.run(sql`CREATE TABLE \`team_skills_locales\` (
  	\`name\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`team_skills\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`team_skills_locales_locale_parent_id_unique\` ON \`team_skills_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`team_skills_locales_parent_id_idx\` ON \`team_skills_locales\` (\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`team_skills\`;`)
  await db.run(sql`DROP TABLE \`team_skills_locales\`;`)
}

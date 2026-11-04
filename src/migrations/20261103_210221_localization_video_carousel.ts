import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`projects_locales\` (
  	\`title\` text,
  	\`client_type\` text,
  	\`venue\` text,
  	\`excerpt\` text,
  	\`brief\` text,
  	\`approach\` text,
  	\`result\` text,
  	\`video_title\` text,
  	\`video_description\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`projects_locales_locale_parent_id_unique\` ON \`projects_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_locales_parent_id_idx\` ON \`projects_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_locales\` (
  	\`version_title\` text,
  	\`version_client_type\` text,
  	\`version_venue\` text,
  	\`version_excerpt\` text,
  	\`version_brief\` text,
  	\`version_approach\` text,
  	\`version_result\` text,
  	\`version_video_title\` text,
  	\`version_video_description\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_projects_v_locales_locale_parent_id_unique\` ON \`_projects_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_locales_parent_id_idx\` ON \`_projects_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_highlights_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_highlights\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_highlights_locales_locale_parent_id_unique\` ON \`services_highlights_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_highlights_locales_parent_id_idx\` ON \`services_highlights_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_process_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_process\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_process_locales_locale_parent_id_unique\` ON \`services_process_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_process_locales_parent_id_idx\` ON \`services_process_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_packages_locales\` (
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_packages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_packages_locales_locale_parent_id_unique\` ON \`services_packages_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_packages_locales_parent_id_idx\` ON \`services_packages_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_faqs_locales\` (
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_faqs_locales_locale_parent_id_unique\` ON \`services_faqs_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_faqs_locales_parent_id_idx\` ON \`services_faqs_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_locales\` (
  	\`title\` text NOT NULL,
  	\`tagline\` text NOT NULL,
  	\`excerpt\` text NOT NULL,
  	\`intro\` text NOT NULL,
  	\`video_title\` text,
  	\`video_description\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_locales_locale_parent_id_unique\` ON \`services_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_locales_parent_id_idx\` ON \`services_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`locations_venues_locales\` (
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`locations_venues\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`locations_venues_locales_locale_parent_id_unique\` ON \`locations_venues_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`locations_venues_locales_parent_id_idx\` ON \`locations_venues_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`locations_service_notes_locales\` (
  	\`content\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`locations_service_notes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`locations_service_notes_locales_locale_parent_id_unique\` ON \`locations_service_notes_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`locations_service_notes_locales_parent_id_idx\` ON \`locations_service_notes_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`locations_faqs_locales\` (
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`locations_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`locations_faqs_locales_locale_parent_id_unique\` ON \`locations_faqs_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`locations_faqs_locales_parent_id_idx\` ON \`locations_faqs_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`locations_locales\` (
  	\`name\` text NOT NULL,
  	\`region\` text,
  	\`intro\` text NOT NULL,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`locations_locales_locale_parent_id_unique\` ON \`locations_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`locations_locales_parent_id_idx\` ON \`locations_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`posts_faqs_locales\` (
  	\`question\` text,
  	\`answer\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`posts_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_faqs_locales_locale_parent_id_unique\` ON \`posts_faqs_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_faqs_locales_parent_id_idx\` ON \`posts_faqs_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`posts_locales\` (
  	\`title\` text,
  	\`excerpt\` text,
  	\`content\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_locales_locale_parent_id_unique\` ON \`posts_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_locales_parent_id_idx\` ON \`posts_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v_version_faqs_locales\` (
  	\`question\` text,
  	\`answer\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_posts_v_version_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_posts_v_version_faqs_locales_locale_parent_id_unique\` ON \`_posts_v_version_faqs_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_faqs_locales_parent_id_idx\` ON \`_posts_v_version_faqs_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v_locales\` (
  	\`version_title\` text,
  	\`version_excerpt\` text,
  	\`version_content\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_posts_v_locales_locale_parent_id_unique\` ON \`_posts_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_locales_parent_id_idx\` ON \`_posts_v_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`testimonials_locales\` (
  	\`role\` text,
  	\`quote\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`testimonials_locales_locale_parent_id_unique\` ON \`testimonials_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_locales_parent_id_idx\` ON \`testimonials_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`media_locales\` (
  	\`alt\` text NOT NULL,
  	\`caption\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`media_locales_locale_parent_id_unique\` ON \`media_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`media_locales_parent_id_idx\` ON \`media_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_stats_locales\` (
  	\`value\` text NOT NULL,
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings_stats\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_settings_stats_locales_locale_parent_id_unique\` ON \`site_settings_stats_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_stats_locales_parent_id_idx\` ON \`site_settings_stats_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_general_faqs_locales\` (
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings_general_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_settings_general_faqs_locales_locale_parent_id_unique\` ON \`site_settings_general_faqs_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_general_faqs_locales_parent_id_idx\` ON \`site_settings_general_faqs_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_locales\` (
  	\`tagline\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`about_heading\` text,
  	\`about_body\` text,
  	\`about_founder_role\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_settings_locales_locale_parent_id_unique\` ON \`site_settings_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_locales_parent_id_idx\` ON \`site_settings_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_hero_slides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`service_id\` integer,
  	\`image_id\` integer,
  	\`video_id\` integer,
  	\`mux_playback_id\` text,
  	\`cta_link\` text,
  	FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_hero_slides_order_idx\` ON \`homepage_hero_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_hero_slides_parent_id_idx\` ON \`homepage_hero_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_hero_slides_service_idx\` ON \`homepage_hero_slides\` (\`service_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_hero_slides_image_idx\` ON \`homepage_hero_slides\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_hero_slides_video_idx\` ON \`homepage_hero_slides\` (\`video_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_hero_slides_locales\` (
  	\`eyebrow\` text,
  	\`title\` text,
  	\`text\` text,
  	\`cta_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage_hero_slides\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`homepage_hero_slides_locales_locale_parent_id_unique\` ON \`homepage_hero_slides_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_hero_slides_locales_parent_id_idx\` ON \`homepage_hero_slides_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_process_locales\` (
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage_process\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`homepage_process_locales_locale_parent_id_unique\` ON \`homepage_process_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_process_locales_parent_id_idx\` ON \`homepage_process_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_locales\` (
  	\`hero_eyebrow\` text,
  	\`hero_heading\` text NOT NULL,
  	\`hero_subheading\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`homepage_locales_locale_parent_id_unique\` ON \`homepage_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_locales_parent_id_idx\` ON \`homepage_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing_add_ons_locales\` (
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing_add_ons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pricing_add_ons_locales_locale_parent_id_unique\` ON \`pricing_add_ons_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pricing_add_ons_locales_parent_id_idx\` ON \`pricing_add_ons_locales\` (\`_parent_id\`);`)
  // ── Keep existing content ──────────────────────────────────────────────────────────────
  // Translatable fields move from each table into a new "<table>_locales" table (one row per
  // language). Copy every current value in as English before the old columns are dropped below.
  await copyIntoLocales(db, 'en')

  await db.run(sql`ALTER TABLE \`projects\` ADD \`video_file_id\` integer REFERENCES media(id) ON UPDATE no action ON DELETE set null;`)
  await db.run(sql`CREATE INDEX \`projects_video_video_file_idx\` ON \`projects\` (\`video_file_id\`);`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`title\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`client_type\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`venue\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`excerpt\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`brief\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`approach\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`result\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`video_title\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`video_description\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`seo_title\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`seo_description\`;`)
  await db.run(sql`ALTER TABLE \`projects_texts\` ADD \`locale\` text;`)
  await db.run(sql`CREATE INDEX \`projects_texts_locale_parent\` ON \`projects_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`ALTER TABLE \`_projects_v\` ADD \`version_video_file_id\` integer REFERENCES media(id) ON UPDATE no action ON DELETE set null;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` ADD \`snapshot\` integer;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` ADD \`published_locale\` text;`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_video_version_video_file_idx\` ON \`_projects_v\` (\`version_video_file_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_snapshot_idx\` ON \`_projects_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_published_locale_idx\` ON \`_projects_v\` (\`published_locale\`);`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_title\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_client_type\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_venue\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_excerpt\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_brief\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_approach\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_result\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_video_title\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_video_description\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_seo_title\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_seo_description\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v_texts\` ADD \`locale\` text;`)
  await db.run(sql`CREATE INDEX \`_projects_v_texts_locale_parent\` ON \`_projects_v_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`ALTER TABLE \`services\` ADD \`video_file_id\` integer REFERENCES media(id) ON UPDATE no action ON DELETE set null;`)
  await db.run(sql`CREATE INDEX \`services_video_video_file_idx\` ON \`services\` (\`video_file_id\`);`)
  await db.run(sql`ALTER TABLE \`services\` DROP COLUMN \`title\`;`)
  await db.run(sql`ALTER TABLE \`services\` DROP COLUMN \`tagline\`;`)
  await db.run(sql`ALTER TABLE \`services\` DROP COLUMN \`excerpt\`;`)
  await db.run(sql`ALTER TABLE \`services\` DROP COLUMN \`intro\`;`)
  await db.run(sql`ALTER TABLE \`services\` DROP COLUMN \`video_title\`;`)
  await db.run(sql`ALTER TABLE \`services\` DROP COLUMN \`video_description\`;`)
  await db.run(sql`ALTER TABLE \`services\` DROP COLUMN \`seo_title\`;`)
  await db.run(sql`ALTER TABLE \`services\` DROP COLUMN \`seo_description\`;`)
  await db.run(sql`ALTER TABLE \`services_texts\` ADD \`locale\` text;`)
  await db.run(sql`CREATE INDEX \`services_texts_locale_parent\` ON \`services_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`ALTER TABLE \`locations_texts\` ADD \`locale\` text;`)
  await db.run(sql`CREATE INDEX \`locations_texts_locale_parent\` ON \`locations_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`snapshot\` integer;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`published_locale\` text;`)
  await db.run(sql`CREATE INDEX \`_posts_v_snapshot_idx\` ON \`_posts_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_published_locale_idx\` ON \`_posts_v\` (\`published_locale\`);`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`version_title\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`version_excerpt\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`version_content\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`version_seo_title\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`version_seo_description\`;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`poster_id\` integer REFERENCES media(id) ON UPDATE no action ON DELETE set null;`)
  await db.run(sql`CREATE INDEX \`media_poster_idx\` ON \`media\` (\`poster_id\`);`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`alt\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`caption\`;`)
  await db.run(sql`ALTER TABLE \`inquiries\` ADD \`locale\` text DEFAULT 'en';`)
  await db.run(sql`ALTER TABLE \`bookings\` ADD \`locale\` text DEFAULT 'en';`)
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`hero_autoplay_seconds\` numeric DEFAULT 6;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`hero_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`hero_heading\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`hero_subheading\`;`)
  await db.run(sql`ALTER TABLE \`services_highlights\` DROP COLUMN \`title\`;`)
  await db.run(sql`ALTER TABLE \`services_highlights\` DROP COLUMN \`description\`;`)
  await db.run(sql`ALTER TABLE \`services_process\` DROP COLUMN \`title\`;`)
  await db.run(sql`ALTER TABLE \`services_process\` DROP COLUMN \`description\`;`)
  await db.run(sql`ALTER TABLE \`services_packages\` DROP COLUMN \`name\`;`)
  await db.run(sql`ALTER TABLE \`services_packages\` DROP COLUMN \`description\`;`)
  await db.run(sql`ALTER TABLE \`services_faqs\` DROP COLUMN \`question\`;`)
  await db.run(sql`ALTER TABLE \`services_faqs\` DROP COLUMN \`answer\`;`)
  await db.run(sql`ALTER TABLE \`locations_venues\` DROP COLUMN \`description\`;`)
  await db.run(sql`ALTER TABLE \`locations_service_notes\` DROP COLUMN \`content\`;`)
  await db.run(sql`ALTER TABLE \`locations_faqs\` DROP COLUMN \`question\`;`)
  await db.run(sql`ALTER TABLE \`locations_faqs\` DROP COLUMN \`answer\`;`)
  await db.run(sql`ALTER TABLE \`locations\` DROP COLUMN \`name\`;`)
  await db.run(sql`ALTER TABLE \`locations\` DROP COLUMN \`region\`;`)
  await db.run(sql`ALTER TABLE \`locations\` DROP COLUMN \`intro\`;`)
  await db.run(sql`ALTER TABLE \`locations\` DROP COLUMN \`seo_title\`;`)
  await db.run(sql`ALTER TABLE \`locations\` DROP COLUMN \`seo_description\`;`)
  await db.run(sql`ALTER TABLE \`posts_faqs\` DROP COLUMN \`question\`;`)
  await db.run(sql`ALTER TABLE \`posts_faqs\` DROP COLUMN \`answer\`;`)
  await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`title\`;`)
  await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`excerpt\`;`)
  await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`content\`;`)
  await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`seo_title\`;`)
  await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`seo_description\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v_version_faqs\` DROP COLUMN \`question\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v_version_faqs\` DROP COLUMN \`answer\`;`)
  await db.run(sql`ALTER TABLE \`testimonials\` DROP COLUMN \`role\`;`)
  await db.run(sql`ALTER TABLE \`testimonials\` DROP COLUMN \`quote\`;`)
  await db.run(sql`ALTER TABLE \`site_settings_stats\` DROP COLUMN \`value\`;`)
  await db.run(sql`ALTER TABLE \`site_settings_stats\` DROP COLUMN \`label\`;`)
  await db.run(sql`ALTER TABLE \`site_settings_general_faqs\` DROP COLUMN \`question\`;`)
  await db.run(sql`ALTER TABLE \`site_settings_general_faqs\` DROP COLUMN \`answer\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`tagline\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`description\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`about_heading\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`about_body\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`about_founder_role\`;`)
  await db.run(sql`ALTER TABLE \`homepage_process\` DROP COLUMN \`title\`;`)
  await db.run(sql`ALTER TABLE \`homepage_process\` DROP COLUMN \`description\`;`)
  await db.run(sql`ALTER TABLE \`pricing_add_ons\` DROP COLUMN \`name\`;`)
  await db.run(sql`ALTER TABLE \`pricing_add_ons\` DROP COLUMN \`description\`;`)

  // Localized "has many" text values (package includes, nearby areas, deliverables) are stored in
  // the *_texts tables, which just gained a locale column: mark the existing ones as English.
  await db.run(sql`UPDATE \`services_texts\` SET \`locale\` = 'en' WHERE \`path\` LIKE 'packages.%.includes';`)
  await db.run(sql`UPDATE \`locations_texts\` SET \`locale\` = 'en' WHERE \`path\` = 'nearbyAreas';`)
  await db.run(sql`UPDATE \`projects_texts\` SET \`locale\` = 'en' WHERE \`path\` = 'deliverables';`)
  await db.run(sql`UPDATE \`_projects_v_texts\` SET \`locale\` = 'en' WHERE \`path\` = 'version.deliverables';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`projects_locales\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_locales\`;`)
  await db.run(sql`DROP TABLE \`services_highlights_locales\`;`)
  await db.run(sql`DROP TABLE \`services_process_locales\`;`)
  await db.run(sql`DROP TABLE \`services_packages_locales\`;`)
  await db.run(sql`DROP TABLE \`services_faqs_locales\`;`)
  await db.run(sql`DROP TABLE \`services_locales\`;`)
  await db.run(sql`DROP TABLE \`locations_venues_locales\`;`)
  await db.run(sql`DROP TABLE \`locations_service_notes_locales\`;`)
  await db.run(sql`DROP TABLE \`locations_faqs_locales\`;`)
  await db.run(sql`DROP TABLE \`locations_locales\`;`)
  await db.run(sql`DROP TABLE \`posts_faqs_locales\`;`)
  await db.run(sql`DROP TABLE \`posts_locales\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_version_faqs_locales\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_locales\`;`)
  await db.run(sql`DROP TABLE \`testimonials_locales\`;`)
  await db.run(sql`DROP TABLE \`media_locales\`;`)
  await db.run(sql`DROP TABLE \`site_settings_stats_locales\`;`)
  await db.run(sql`DROP TABLE \`site_settings_general_faqs_locales\`;`)
  await db.run(sql`DROP TABLE \`site_settings_locales\`;`)
  await db.run(sql`DROP TABLE \`homepage_hero_slides\`;`)
  await db.run(sql`DROP TABLE \`homepage_hero_slides_locales\`;`)
  await db.run(sql`DROP TABLE \`homepage_process_locales\`;`)
  await db.run(sql`DROP TABLE \`homepage_locales\`;`)
  await db.run(sql`DROP TABLE \`pricing_add_ons_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_projects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`service_id\` integer,
  	\`location_id\` integer,
  	\`client_type\` text,
  	\`venue\` text,
  	\`date\` text,
  	\`featured\` integer DEFAULT false,
  	\`excerpt\` text,
  	\`cover_image_id\` integer,
  	\`brief\` text,
  	\`approach\` text,
  	\`result\` text,
  	\`video_provider\` text DEFAULT 'none',
  	\`video_mux_playback_id\` text,
  	\`video_youtube_id\` text,
  	\`video_title\` text,
  	\`video_description\` text,
  	\`video_duration_seconds\` numeric,
  	\`testimonial_id\` integer,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_no_index\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`testimonial_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_projects\`("id", "title", "slug", "service_id", "location_id", "client_type", "venue", "date", "featured", "excerpt", "cover_image_id", "brief", "approach", "result", "video_provider", "video_mux_playback_id", "video_youtube_id", "video_title", "video_description", "video_duration_seconds", "testimonial_id", "seo_title", "seo_description", "seo_image_id", "seo_no_index", "updated_at", "created_at", "_status") SELECT "id", "title", "slug", "service_id", "location_id", "client_type", "venue", "date", "featured", "excerpt", "cover_image_id", "brief", "approach", "result", "video_provider", "video_mux_playback_id", "video_youtube_id", "video_title", "video_description", "video_duration_seconds", "testimonial_id", "seo_title", "seo_description", "seo_image_id", "seo_no_index", "updated_at", "created_at", "_status" FROM \`projects\`;`)
  await db.run(sql`DROP TABLE \`projects\`;`)
  await db.run(sql`ALTER TABLE \`__new_projects\` RENAME TO \`projects\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`projects_slug_idx\` ON \`projects\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`projects_service_idx\` ON \`projects\` (\`service_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_location_idx\` ON \`projects\` (\`location_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_cover_image_idx\` ON \`projects\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_testimonial_idx\` ON \`projects\` (\`testimonial_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_seo_seo_image_idx\` ON \`projects\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_updated_at_idx\` ON \`projects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`projects_created_at_idx\` ON \`projects\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`projects__status_idx\` ON \`projects\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__projects_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_service_id\` integer,
  	\`version_location_id\` integer,
  	\`version_client_type\` text,
  	\`version_venue\` text,
  	\`version_date\` text,
  	\`version_featured\` integer DEFAULT false,
  	\`version_excerpt\` text,
  	\`version_cover_image_id\` integer,
  	\`version_brief\` text,
  	\`version_approach\` text,
  	\`version_result\` text,
  	\`version_video_provider\` text DEFAULT 'none',
  	\`version_video_mux_playback_id\` text,
  	\`version_video_youtube_id\` text,
  	\`version_video_title\` text,
  	\`version_video_description\` text,
  	\`version_video_duration_seconds\` numeric,
  	\`version_testimonial_id\` integer,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_no_index\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_service_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_location_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_testimonial_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__projects_v\`("id", "parent_id", "version_title", "version_slug", "version_service_id", "version_location_id", "version_client_type", "version_venue", "version_date", "version_featured", "version_excerpt", "version_cover_image_id", "version_brief", "version_approach", "version_result", "version_video_provider", "version_video_mux_playback_id", "version_video_youtube_id", "version_video_title", "version_video_description", "version_video_duration_seconds", "version_testimonial_id", "version_seo_title", "version_seo_description", "version_seo_image_id", "version_seo_no_index", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_title", "version_slug", "version_service_id", "version_location_id", "version_client_type", "version_venue", "version_date", "version_featured", "version_excerpt", "version_cover_image_id", "version_brief", "version_approach", "version_result", "version_video_provider", "version_video_mux_playback_id", "version_video_youtube_id", "version_video_title", "version_video_description", "version_video_duration_seconds", "version_testimonial_id", "version_seo_title", "version_seo_description", "version_seo_image_id", "version_seo_no_index", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_projects_v\`;`)
  await db.run(sql`DROP TABLE \`_projects_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__projects_v\` RENAME TO \`_projects_v\`;`)
  await db.run(sql`CREATE INDEX \`_projects_v_parent_idx\` ON \`_projects_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_slug_idx\` ON \`_projects_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_service_idx\` ON \`_projects_v\` (\`version_service_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_location_idx\` ON \`_projects_v\` (\`version_location_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_cover_image_idx\` ON \`_projects_v\` (\`version_cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_testimonial_idx\` ON \`_projects_v\` (\`version_testimonial_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_seo_version_seo_image_idx\` ON \`_projects_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_updated_at_idx\` ON \`_projects_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_created_at_idx\` ON \`_projects_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version__status_idx\` ON \`_projects_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_created_at_idx\` ON \`_projects_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_updated_at_idx\` ON \`_projects_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_latest_idx\` ON \`_projects_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`__new_services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text,
  	\`category\` text DEFAULT 'photo' NOT NULL,
  	\`order\` numeric DEFAULT 0,
  	\`tagline\` text NOT NULL,
  	\`excerpt\` text NOT NULL,
  	\`hero_image_id\` integer NOT NULL,
  	\`intro\` text NOT NULL,
  	\`starting_price\` numeric NOT NULL,
  	\`video_provider\` text DEFAULT 'none',
  	\`video_mux_playback_id\` text,
  	\`video_youtube_id\` text,
  	\`video_title\` text,
  	\`video_description\` text,
  	\`video_duration_seconds\` numeric,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_no_index\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_services\`("id", "title", "slug", "category", "order", "tagline", "excerpt", "hero_image_id", "intro", "starting_price", "video_provider", "video_mux_playback_id", "video_youtube_id", "video_title", "video_description", "video_duration_seconds", "seo_title", "seo_description", "seo_image_id", "seo_no_index", "updated_at", "created_at") SELECT "id", "title", "slug", "category", "order", "tagline", "excerpt", "hero_image_id", "intro", "starting_price", "video_provider", "video_mux_playback_id", "video_youtube_id", "video_title", "video_description", "video_duration_seconds", "seo_title", "seo_description", "seo_image_id", "seo_no_index", "updated_at", "created_at" FROM \`services\`;`)
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`ALTER TABLE \`__new_services\` RENAME TO \`services\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`services_slug_idx\` ON \`services\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`services_hero_image_idx\` ON \`services\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`services_seo_seo_image_idx\` ON \`services\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`caption\` text,
  	\`alt_needs_review\` integer DEFAULT false,
  	\`blur_data_u_r_l\` text,
  	\`prefix\` text DEFAULT '',
  	\`_objectkey\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumb_url\` text,
  	\`sizes_thumb_width\` numeric,
  	\`sizes_thumb_height\` numeric,
  	\`sizes_thumb_mime_type\` text,
  	\`sizes_thumb_filesize\` numeric,
  	\`sizes_thumb_filename\` text,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_large_url\` text,
  	\`sizes_large_width\` numeric,
  	\`sizes_large_height\` numeric,
  	\`sizes_large_mime_type\` text,
  	\`sizes_large_filesize\` numeric,
  	\`sizes_large_filename\` text,
  	\`sizes_og_url\` text,
  	\`sizes_og_width\` numeric,
  	\`sizes_og_height\` numeric,
  	\`sizes_og_mime_type\` text,
  	\`sizes_og_filesize\` numeric,
  	\`sizes_og_filename\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_media\`("id", "alt", "caption", "alt_needs_review", "blur_data_u_r_l", "prefix", "_objectkey", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y", "sizes_thumb_url", "sizes_thumb_width", "sizes_thumb_height", "sizes_thumb_mime_type", "sizes_thumb_filesize", "sizes_thumb_filename", "sizes_card_url", "sizes_card_width", "sizes_card_height", "sizes_card_mime_type", "sizes_card_filesize", "sizes_card_filename", "sizes_large_url", "sizes_large_width", "sizes_large_height", "sizes_large_mime_type", "sizes_large_filesize", "sizes_large_filename", "sizes_og_url", "sizes_og_width", "sizes_og_height", "sizes_og_mime_type", "sizes_og_filesize", "sizes_og_filename") SELECT "id", "alt", "caption", "alt_needs_review", "blur_data_u_r_l", "prefix", "_objectkey", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y", "sizes_thumb_url", "sizes_thumb_width", "sizes_thumb_height", "sizes_thumb_mime_type", "sizes_thumb_filesize", "sizes_thumb_filename", "sizes_card_url", "sizes_card_width", "sizes_card_height", "sizes_card_mime_type", "sizes_card_filesize", "sizes_card_filename", "sizes_large_url", "sizes_large_width", "sizes_large_height", "sizes_large_mime_type", "sizes_large_filesize", "sizes_large_filename", "sizes_og_url", "sizes_og_width", "sizes_og_height", "sizes_og_mime_type", "sizes_og_filesize", "sizes_og_filename" FROM \`media\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`ALTER TABLE \`__new_media\` RENAME TO \`media\`;`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumb_sizes_thumb_filename_idx\` ON \`media\` (\`sizes_thumb_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_large_sizes_large_filename_idx\` ON \`media\` (\`sizes_large_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_og_sizes_og_filename_idx\` ON \`media\` (\`sizes_og_filename\`);`)
  await db.run(sql`DROP INDEX \`projects_texts_locale_parent\`;`)
  await db.run(sql`ALTER TABLE \`projects_texts\` DROP COLUMN \`locale\`;`)
  await db.run(sql`DROP INDEX \`_projects_v_texts_locale_parent\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v_texts\` DROP COLUMN \`locale\`;`)
  await db.run(sql`DROP INDEX \`services_texts_locale_parent\`;`)
  await db.run(sql`ALTER TABLE \`services_texts\` DROP COLUMN \`locale\`;`)
  await db.run(sql`DROP INDEX \`locations_texts_locale_parent\`;`)
  await db.run(sql`ALTER TABLE \`locations_texts\` DROP COLUMN \`locale\`;`)
  await db.run(sql`DROP INDEX \`_posts_v_snapshot_idx\`;`)
  await db.run(sql`DROP INDEX \`_posts_v_published_locale_idx\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_title\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_excerpt\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_content\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`snapshot\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`published_locale\`;`)
  await db.run(sql`ALTER TABLE \`services_highlights\` ADD \`title\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`services_highlights\` ADD \`description\` text;`)
  await db.run(sql`ALTER TABLE \`services_process\` ADD \`title\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`services_process\` ADD \`description\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`services_packages\` ADD \`name\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`services_packages\` ADD \`description\` text;`)
  await db.run(sql`ALTER TABLE \`services_faqs\` ADD \`question\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`services_faqs\` ADD \`answer\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`locations_venues\` ADD \`description\` text;`)
  await db.run(sql`ALTER TABLE \`locations_service_notes\` ADD \`content\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`locations_faqs\` ADD \`question\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`locations_faqs\` ADD \`answer\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`locations\` ADD \`name\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`locations\` ADD \`region\` text;`)
  await db.run(sql`ALTER TABLE \`locations\` ADD \`intro\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`locations\` ADD \`seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`locations\` ADD \`seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`posts_faqs\` ADD \`question\` text;`)
  await db.run(sql`ALTER TABLE \`posts_faqs\` ADD \`answer\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`title\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`excerpt\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`content\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v_version_faqs\` ADD \`question\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v_version_faqs\` ADD \`answer\` text;`)
  await db.run(sql`ALTER TABLE \`testimonials\` ADD \`role\` text;`)
  await db.run(sql`ALTER TABLE \`testimonials\` ADD \`quote\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`site_settings_stats\` ADD \`value\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`site_settings_stats\` ADD \`label\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`site_settings_general_faqs\` ADD \`question\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`site_settings_general_faqs\` ADD \`answer\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`tagline\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`description\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`about_heading\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`about_body\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`about_founder_role\` text;`)
  await db.run(sql`ALTER TABLE \`homepage_process\` ADD \`title\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`homepage_process\` ADD \`description\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`hero_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`hero_heading\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`hero_subheading\` text;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`hero_autoplay_seconds\`;`)
  await db.run(sql`ALTER TABLE \`pricing_add_ons\` ADD \`name\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`pricing_add_ons\` ADD \`description\` text;`)
  await db.run(sql`ALTER TABLE \`inquiries\` DROP COLUMN \`locale\`;`)
  await db.run(sql`ALTER TABLE \`bookings\` DROP COLUMN \`locale\`;`)
}

type Db = MigrateUpArgs['db']

/**
 * For every "<table>_locales" table, copies the matching columns of <table> into it as rows for
 * `locale`. Generic on purpose: it reads the column lists from the database itself.
 */
async function copyIntoLocales(db: Db, locale: string) {
  const rows = <T>(res: unknown): T[] => ((res as { rows?: T[] }).rows ?? [])
  const tables = rows<{ name: string }>(
    await db.run(sql.raw(`SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE '%\\_locales' ESCAPE '\\'`)),
  ).map((r) => r.name)

  for (const localesTable of tables) {
    const parent = localesTable.slice(0, -'_locales'.length)
    const columnsOf = async (table: string) =>
      rows<{ name: string }>(await db.run(sql.raw(`PRAGMA table_info(\`${table}\`)`))).map((c) => c.name)
    const parentColumns = new Set(await columnsOf(parent))
    if (parentColumns.size === 0) continue
    const shared = (await columnsOf(localesTable)).filter((c) => !['id', '_locale', '_parent_id'].includes(c) && parentColumns.has(c))
    if (shared.length === 0) continue
    const list = shared.map((c) => `\`${c}\``).join(', ')
    await db.run(
      sql.raw(
        `INSERT INTO \`${localesTable}\` (${list}, \`_locale\`, \`_parent_id\`) SELECT ${list}, '${locale}', \`id\` FROM \`${parent}\``,
      ),
    )
  }
}

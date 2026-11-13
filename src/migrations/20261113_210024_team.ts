import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`team_disciplines\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`team_disciplines_order_idx\` ON \`team_disciplines\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`team_disciplines_parent_idx\` ON \`team_disciplines\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`team_languages\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`team_languages_order_idx\` ON \`team_languages\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`team_languages_parent_idx\` ON \`team_languages\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`team\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`photo_id\` integer NOT NULL,
  	\`signature_image_id\` integer,
  	\`since\` numeric,
  	\`social_instagram\` text,
  	\`social_website\` text,
  	\`social_linkedin\` text,
  	\`slug\` text,
  	\`visible\` integer DEFAULT true,
  	\`featured\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 0,
  	\`seo_image_id\` integer,
  	\`seo_no_index\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`signature_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`team_photo_idx\` ON \`team\` (\`photo_id\`);`)
  await db.run(sql`CREATE INDEX \`team_signature_image_idx\` ON \`team\` (\`signature_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`team_slug_idx\` ON \`team\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`team_seo_seo_image_idx\` ON \`team\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`team_updated_at_idx\` ON \`team\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`team_created_at_idx\` ON \`team\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`team_locales\` (
  	\`role\` text NOT NULL,
  	\`short_bio\` text NOT NULL,
  	\`bio\` text,
  	\`quote\` text,
  	\`gear\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`team_locales_locale_parent_id_unique\` ON \`team_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`team_locales_parent_id_idx\` ON \`team_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`team_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	\`locale\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`team_texts_order_parent\` ON \`team_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`team_texts_locale_parent\` ON \`team_texts\` (\`locale\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`team_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`services_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`team_rels_order_idx\` ON \`team_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`team_rels_parent_idx\` ON \`team_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`team_rels_path_idx\` ON \`team_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`team_rels_services_id_idx\` ON \`team_rels\` (\`services_id\`);`)
  await db.run(sql`ALTER TABLE \`projects_rels\` ADD \`team_id\` integer REFERENCES team(id);`)
  await db.run(sql`CREATE INDEX \`projects_rels_team_id_idx\` ON \`projects_rels\` (\`team_id\`);`)
  await db.run(sql`ALTER TABLE \`_projects_v_rels\` ADD \`team_id\` integer REFERENCES team(id);`)
  await db.run(sql`CREATE INDEX \`_projects_v_rels_team_id_idx\` ON \`_projects_v_rels\` (\`team_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`team_id\` integer REFERENCES team(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_team_id_idx\` ON \`payload_locked_documents_rels\` (\`team_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`team_disciplines\`;`)
  await db.run(sql`DROP TABLE \`team_languages\`;`)
  await db.run(sql`DROP TABLE \`team\`;`)
  await db.run(sql`DROP TABLE \`team_locales\`;`)
  await db.run(sql`DROP TABLE \`team_texts\`;`)
  await db.run(sql`DROP TABLE \`team_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_projects_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_projects_rels\`("id", "order", "parent_id", "path", "media_id") SELECT "id", "order", "parent_id", "path", "media_id" FROM \`projects_rels\`;`)
  await db.run(sql`DROP TABLE \`projects_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_projects_rels\` RENAME TO \`projects_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`projects_rels_order_idx\` ON \`projects_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_parent_idx\` ON \`projects_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_path_idx\` ON \`projects_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_media_id_idx\` ON \`projects_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__projects_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__projects_v_rels\`("id", "order", "parent_id", "path", "media_id") SELECT "id", "order", "parent_id", "path", "media_id" FROM \`_projects_v_rels\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new__projects_v_rels\` RENAME TO \`_projects_v_rels\`;`)
  await db.run(sql`CREATE INDEX \`_projects_v_rels_order_idx\` ON \`_projects_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_rels_parent_idx\` ON \`_projects_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_rels_path_idx\` ON \`_projects_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_rels_media_id_idx\` ON \`_projects_v_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`projects_id\` integer,
  	\`services_id\` integer,
  	\`locations_id\` integer,
  	\`posts_id\` integer,
  	\`testimonials_id\` integer,
  	\`media_id\` integer,
  	\`inquiries_id\` integer,
  	\`bookings_id\` integer,
  	\`chat_conversations_id\` integer,
  	\`analytics_events_id\` integer,
  	\`client_galleries_id\` integer,
  	\`client_media_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`locations_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`inquiries_id\`) REFERENCES \`inquiries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`bookings_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`chat_conversations_id\`) REFERENCES \`chat_conversations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`analytics_events_id\`) REFERENCES \`analytics_events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`client_galleries_id\`) REFERENCES \`client_galleries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`client_media_id\`) REFERENCES \`client_media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "projects_id", "services_id", "locations_id", "posts_id", "testimonials_id", "media_id", "inquiries_id", "bookings_id", "chat_conversations_id", "analytics_events_id", "client_galleries_id", "client_media_id", "users_id") SELECT "id", "order", "parent_id", "path", "projects_id", "services_id", "locations_id", "posts_id", "testimonials_id", "media_id", "inquiries_id", "bookings_id", "chat_conversations_id", "analytics_events_id", "client_galleries_id", "client_media_id", "users_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_services_id_idx\` ON \`payload_locked_documents_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_locations_id_idx\` ON \`payload_locked_documents_rels\` (\`locations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_inquiries_id_idx\` ON \`payload_locked_documents_rels\` (\`inquiries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_bookings_id_idx\` ON \`payload_locked_documents_rels\` (\`bookings_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_chat_conversations_id_idx\` ON \`payload_locked_documents_rels\` (\`chat_conversations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_analytics_events_id_idx\` ON \`payload_locked_documents_rels\` (\`analytics_events_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_client_galleries_id_idx\` ON \`payload_locked_documents_rels\` (\`client_galleries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_client_media_id_idx\` ON \`payload_locked_documents_rels\` (\`client_media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
}

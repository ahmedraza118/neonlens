import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`chat_conversations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`preview\` text,
  	\`token\` text NOT NULL,
  	\`ip_hash\` text,
  	\`locale\` text,
  	\`start_page\` text,
  	\`mode\` text,
  	\`message_count\` numeric DEFAULT 0,
  	\`unanswered\` numeric DEFAULT 0,
  	\`lead_captured\` integer DEFAULT false,
  	\`inquiry_id\` integer,
  	\`topics\` text,
  	\`messages\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`inquiry_id\`) REFERENCES \`inquiries\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`chat_conversations_token_idx\` ON \`chat_conversations\` (\`token\`);`)
  await db.run(sql`CREATE INDEX \`chat_conversations_ip_hash_idx\` ON \`chat_conversations\` (\`ip_hash\`);`)
  await db.run(sql`CREATE INDEX \`chat_conversations_inquiry_idx\` ON \`chat_conversations\` (\`inquiry_id\`);`)
  await db.run(sql`CREATE INDEX \`chat_conversations_updated_at_idx\` ON \`chat_conversations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`chat_conversations_created_at_idx\` ON \`chat_conversations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`analytics_events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`type\` text NOT NULL,
  	\`path\` text,
  	\`session\` text NOT NULL,
  	\`visitor\` text,
  	\`channel\` text,
  	\`source\` text,
  	\`campaign\` text,
  	\`referrer\` text,
  	\`device\` text,
  	\`locale\` text,
  	\`country\` text,
  	\`value\` numeric,
  	\`label\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`analytics_events_type_idx\` ON \`analytics_events\` (\`type\`);`)
  await db.run(sql`CREATE INDEX \`analytics_events_path_idx\` ON \`analytics_events\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`analytics_events_session_idx\` ON \`analytics_events\` (\`session\`);`)
  await db.run(sql`CREATE INDEX \`analytics_events_updated_at_idx\` ON \`analytics_events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`analytics_events_created_at_idx\` ON \`analytics_events\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`createdAt_type_idx\` ON \`analytics_events\` (\`created_at\`,\`type\`);`)
  await db.run(sql`ALTER TABLE \`inquiries\` ADD \`source\` text DEFAULT 'form';`)
  await db.run(sql`ALTER TABLE \`inquiries\` ADD \`contacted_at\` text;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`chat_conversations_id\` integer REFERENCES chat_conversations(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`analytics_events_id\` integer REFERENCES analytics_events(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_chat_conversations_id_idx\` ON \`payload_locked_documents_rels\` (\`chat_conversations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_analytics_events_id_idx\` ON \`payload_locked_documents_rels\` (\`analytics_events_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`chat_conversations\`;`)
  await db.run(sql`DROP TABLE \`analytics_events\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
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
  	FOREIGN KEY (\`client_galleries_id\`) REFERENCES \`client_galleries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`client_media_id\`) REFERENCES \`client_media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "projects_id", "services_id", "locations_id", "posts_id", "testimonials_id", "media_id", "inquiries_id", "bookings_id", "client_galleries_id", "client_media_id", "users_id") SELECT "id", "order", "parent_id", "path", "projects_id", "services_id", "locations_id", "posts_id", "testimonials_id", "media_id", "inquiries_id", "bookings_id", "client_galleries_id", "client_media_id", "users_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
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
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_client_galleries_id_idx\` ON \`payload_locked_documents_rels\` (\`client_galleries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_client_media_id_idx\` ON \`payload_locked_documents_rels\` (\`client_media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`inquiries\` DROP COLUMN \`source\`;`)
  await db.run(sql`ALTER TABLE \`inquiries\` DROP COLUMN \`contacted_at\`;`)
}

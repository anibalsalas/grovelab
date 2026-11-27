import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "payload_locked_documents_rels_prueba_ensayo_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "prueba_ensayo_id";
  DROP TABLE IF EXISTS "prueba_ensayo" CASCADE;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "prueba_ensayo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "prueba_ensayo_id" integer;
  CREATE INDEX "payload_locked_documents_rels_prueba_ensayo_id_idx" ON "payload_locked_documents_rels" USING btree ("prueba_ensayo_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_prueba_ensayo_fk" FOREIGN KEY ("prueba_ensayo_id") REFERENCES "public"."prueba_ensayo"("id") ON DELETE cascade ON UPDATE no action;`);
}

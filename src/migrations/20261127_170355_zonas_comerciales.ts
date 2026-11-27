import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_zonas_comerciales_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__zonas_comerciales_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "zonas_comerciales_cobertura" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lugar" varchar
  );
  
  CREATE TABLE "zonas_comerciales" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar,
  	"slug" varchar,
  	"asesor_nombre" varchar,
  	"asesor_cargo" varchar,
  	"whatsapp" varchar,
  	"numero_autorizado" boolean DEFAULT false,
  	"orden" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_zonas_comerciales_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_zonas_comerciales_v_version_cobertura" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"lugar" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_zonas_comerciales_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_nombre" varchar,
  	"version_slug" varchar,
  	"version_asesor_nombre" varchar,
  	"version_asesor_cargo" varchar,
  	"version_whatsapp" varchar,
  	"version_numero_autorizado" boolean DEFAULT false,
  	"version_orden" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__zonas_comerciales_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "zonas_comerciales_id" integer;
  ALTER TABLE "zonas_comerciales_cobertura" ADD CONSTRAINT "zonas_comerciales_cobertura_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."zonas_comerciales"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_zonas_comerciales_v_version_cobertura" ADD CONSTRAINT "_zonas_comerciales_v_version_cobertura_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_zonas_comerciales_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_zonas_comerciales_v" ADD CONSTRAINT "_zonas_comerciales_v_parent_id_zonas_comerciales_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."zonas_comerciales"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "zonas_comerciales_cobertura_order_idx" ON "zonas_comerciales_cobertura" USING btree ("_order");
  CREATE INDEX "zonas_comerciales_cobertura_parent_id_idx" ON "zonas_comerciales_cobertura" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "zonas_comerciales_slug_idx" ON "zonas_comerciales" USING btree ("slug");
  CREATE INDEX "zonas_comerciales_updated_at_idx" ON "zonas_comerciales" USING btree ("updated_at");
  CREATE INDEX "zonas_comerciales_created_at_idx" ON "zonas_comerciales" USING btree ("created_at");
  CREATE INDEX "zonas_comerciales__status_idx" ON "zonas_comerciales" USING btree ("_status");
  CREATE INDEX "_zonas_comerciales_v_version_cobertura_order_idx" ON "_zonas_comerciales_v_version_cobertura" USING btree ("_order");
  CREATE INDEX "_zonas_comerciales_v_version_cobertura_parent_id_idx" ON "_zonas_comerciales_v_version_cobertura" USING btree ("_parent_id");
  CREATE INDEX "_zonas_comerciales_v_parent_idx" ON "_zonas_comerciales_v" USING btree ("parent_id");
  CREATE INDEX "_zonas_comerciales_v_version_version_slug_idx" ON "_zonas_comerciales_v" USING btree ("version_slug");
  CREATE INDEX "_zonas_comerciales_v_version_version_updated_at_idx" ON "_zonas_comerciales_v" USING btree ("version_updated_at");
  CREATE INDEX "_zonas_comerciales_v_version_version_created_at_idx" ON "_zonas_comerciales_v" USING btree ("version_created_at");
  CREATE INDEX "_zonas_comerciales_v_version_version__status_idx" ON "_zonas_comerciales_v" USING btree ("version__status");
  CREATE INDEX "_zonas_comerciales_v_created_at_idx" ON "_zonas_comerciales_v" USING btree ("created_at");
  CREATE INDEX "_zonas_comerciales_v_updated_at_idx" ON "_zonas_comerciales_v" USING btree ("updated_at");
  CREATE INDEX "_zonas_comerciales_v_latest_idx" ON "_zonas_comerciales_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_zonas_comerciales_fk" FOREIGN KEY ("zonas_comerciales_id") REFERENCES "public"."zonas_comerciales"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_zonas_comerciales_id_idx" ON "payload_locked_documents_rels" USING btree ("zonas_comerciales_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "zonas_comerciales_cobertura" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "zonas_comerciales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_zonas_comerciales_v_version_cobertura" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_zonas_comerciales_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "zonas_comerciales_cobertura" CASCADE;
  DROP TABLE "zonas_comerciales" CASCADE;
  DROP TABLE "_zonas_comerciales_v_version_cobertura" CASCADE;
  DROP TABLE "_zonas_comerciales_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_zonas_comerciales_fk";
  
  DROP INDEX "payload_locked_documents_rels_zonas_comerciales_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "zonas_comerciales_id";
  DROP TYPE "public"."enum_zonas_comerciales_status";
  DROP TYPE "public"."enum__zonas_comerciales_v_version_status";`)
}

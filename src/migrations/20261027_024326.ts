import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_categorias_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__categorias_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_cultivos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__cultivos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_plagas_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__plagas_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_productos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__productos_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "categorias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar,
  	"slug" varchar,
  	"orden" numeric DEFAULT 0,
  	"descripcion" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_categorias_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_categorias_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_nombre" varchar,
  	"version_slug" varchar,
  	"version_orden" numeric DEFAULT 0,
  	"version_descripcion" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__categorias_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "cultivos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar,
  	"slug" varchar,
  	"resumen" varchar,
  	"destacado" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_cultivos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_cultivos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_nombre" varchar,
  	"version_slug" varchar,
  	"version_resumen" varchar,
  	"version_destacado" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__cultivos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "plagas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_plagas_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_plagas_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_nombre" varchar,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__plagas_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "productos_dosis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cultivo_id" integer,
  	"plaga_id" integer,
  	"dosis" varchar,
  	"nota" varchar
  );
  
  CREATE TABLE "productos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar,
  	"slug" varchar,
  	"categoria_id" integer,
  	"resumen" varchar,
  	"ingrediente_activo" varchar,
  	"formulacion" varchar,
  	"registro_senasa" varchar,
  	"destacado" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_productos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "productos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cultivos_id" integer,
  	"plagas_id" integer
  );
  
  CREATE TABLE "_productos_v_version_dosis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cultivo_id" integer,
  	"plaga_id" integer,
  	"dosis" varchar,
  	"nota" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_productos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_nombre" varchar,
  	"version_slug" varchar,
  	"version_categoria_id" integer,
  	"version_resumen" varchar,
  	"version_ingrediente_activo" varchar,
  	"version_formulacion" varchar,
  	"version_registro_senasa" varchar,
  	"version_destacado" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__productos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_productos_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cultivos_id" integer,
  	"plagas_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "categorias_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cultivos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "plagas_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "productos_id" integer;
  ALTER TABLE "_categorias_v" ADD CONSTRAINT "_categorias_v_parent_id_categorias_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categorias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cultivos_v" ADD CONSTRAINT "_cultivos_v_parent_id_cultivos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cultivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_plagas_v" ADD CONSTRAINT "_plagas_v_parent_id_plagas_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."plagas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "productos_dosis" ADD CONSTRAINT "productos_dosis_cultivo_id_cultivos_id_fk" FOREIGN KEY ("cultivo_id") REFERENCES "public"."cultivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "productos_dosis" ADD CONSTRAINT "productos_dosis_plaga_id_plagas_id_fk" FOREIGN KEY ("plaga_id") REFERENCES "public"."plagas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "productos_dosis" ADD CONSTRAINT "productos_dosis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "productos_rels" ADD CONSTRAINT "productos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "productos_rels" ADD CONSTRAINT "productos_rels_cultivos_fk" FOREIGN KEY ("cultivos_id") REFERENCES "public"."cultivos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "productos_rels" ADD CONSTRAINT "productos_rels_plagas_fk" FOREIGN KEY ("plagas_id") REFERENCES "public"."plagas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_productos_v_version_dosis" ADD CONSTRAINT "_productos_v_version_dosis_cultivo_id_cultivos_id_fk" FOREIGN KEY ("cultivo_id") REFERENCES "public"."cultivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_productos_v_version_dosis" ADD CONSTRAINT "_productos_v_version_dosis_plaga_id_plagas_id_fk" FOREIGN KEY ("plaga_id") REFERENCES "public"."plagas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_productos_v_version_dosis" ADD CONSTRAINT "_productos_v_version_dosis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_productos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_productos_v" ADD CONSTRAINT "_productos_v_parent_id_productos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."productos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_productos_v" ADD CONSTRAINT "_productos_v_version_categoria_id_categorias_id_fk" FOREIGN KEY ("version_categoria_id") REFERENCES "public"."categorias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_productos_v_rels" ADD CONSTRAINT "_productos_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_productos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_productos_v_rels" ADD CONSTRAINT "_productos_v_rels_cultivos_fk" FOREIGN KEY ("cultivos_id") REFERENCES "public"."cultivos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_productos_v_rels" ADD CONSTRAINT "_productos_v_rels_plagas_fk" FOREIGN KEY ("plagas_id") REFERENCES "public"."plagas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "categorias_slug_idx" ON "categorias" USING btree ("slug");
  CREATE INDEX "categorias_updated_at_idx" ON "categorias" USING btree ("updated_at");
  CREATE INDEX "categorias_created_at_idx" ON "categorias" USING btree ("created_at");
  CREATE INDEX "categorias__status_idx" ON "categorias" USING btree ("_status");
  CREATE INDEX "_categorias_v_parent_idx" ON "_categorias_v" USING btree ("parent_id");
  CREATE INDEX "_categorias_v_version_version_slug_idx" ON "_categorias_v" USING btree ("version_slug");
  CREATE INDEX "_categorias_v_version_version_updated_at_idx" ON "_categorias_v" USING btree ("version_updated_at");
  CREATE INDEX "_categorias_v_version_version_created_at_idx" ON "_categorias_v" USING btree ("version_created_at");
  CREATE INDEX "_categorias_v_version_version__status_idx" ON "_categorias_v" USING btree ("version__status");
  CREATE INDEX "_categorias_v_created_at_idx" ON "_categorias_v" USING btree ("created_at");
  CREATE INDEX "_categorias_v_updated_at_idx" ON "_categorias_v" USING btree ("updated_at");
  CREATE INDEX "_categorias_v_latest_idx" ON "_categorias_v" USING btree ("latest");
  CREATE UNIQUE INDEX "cultivos_slug_idx" ON "cultivos" USING btree ("slug");
  CREATE INDEX "cultivos_updated_at_idx" ON "cultivos" USING btree ("updated_at");
  CREATE INDEX "cultivos_created_at_idx" ON "cultivos" USING btree ("created_at");
  CREATE INDEX "cultivos__status_idx" ON "cultivos" USING btree ("_status");
  CREATE INDEX "_cultivos_v_parent_idx" ON "_cultivos_v" USING btree ("parent_id");
  CREATE INDEX "_cultivos_v_version_version_slug_idx" ON "_cultivos_v" USING btree ("version_slug");
  CREATE INDEX "_cultivos_v_version_version_updated_at_idx" ON "_cultivos_v" USING btree ("version_updated_at");
  CREATE INDEX "_cultivos_v_version_version_created_at_idx" ON "_cultivos_v" USING btree ("version_created_at");
  CREATE INDEX "_cultivos_v_version_version__status_idx" ON "_cultivos_v" USING btree ("version__status");
  CREATE INDEX "_cultivos_v_created_at_idx" ON "_cultivos_v" USING btree ("created_at");
  CREATE INDEX "_cultivos_v_updated_at_idx" ON "_cultivos_v" USING btree ("updated_at");
  CREATE INDEX "_cultivos_v_latest_idx" ON "_cultivos_v" USING btree ("latest");
  CREATE UNIQUE INDEX "plagas_slug_idx" ON "plagas" USING btree ("slug");
  CREATE INDEX "plagas_updated_at_idx" ON "plagas" USING btree ("updated_at");
  CREATE INDEX "plagas_created_at_idx" ON "plagas" USING btree ("created_at");
  CREATE INDEX "plagas__status_idx" ON "plagas" USING btree ("_status");
  CREATE INDEX "_plagas_v_parent_idx" ON "_plagas_v" USING btree ("parent_id");
  CREATE INDEX "_plagas_v_version_version_slug_idx" ON "_plagas_v" USING btree ("version_slug");
  CREATE INDEX "_plagas_v_version_version_updated_at_idx" ON "_plagas_v" USING btree ("version_updated_at");
  CREATE INDEX "_plagas_v_version_version_created_at_idx" ON "_plagas_v" USING btree ("version_created_at");
  CREATE INDEX "_plagas_v_version_version__status_idx" ON "_plagas_v" USING btree ("version__status");
  CREATE INDEX "_plagas_v_created_at_idx" ON "_plagas_v" USING btree ("created_at");
  CREATE INDEX "_plagas_v_updated_at_idx" ON "_plagas_v" USING btree ("updated_at");
  CREATE INDEX "_plagas_v_latest_idx" ON "_plagas_v" USING btree ("latest");
  CREATE INDEX "productos_dosis_order_idx" ON "productos_dosis" USING btree ("_order");
  CREATE INDEX "productos_dosis_parent_id_idx" ON "productos_dosis" USING btree ("_parent_id");
  CREATE INDEX "productos_dosis_cultivo_idx" ON "productos_dosis" USING btree ("cultivo_id");
  CREATE INDEX "productos_dosis_plaga_idx" ON "productos_dosis" USING btree ("plaga_id");
  CREATE UNIQUE INDEX "productos_slug_idx" ON "productos" USING btree ("slug");
  CREATE INDEX "productos_categoria_idx" ON "productos" USING btree ("categoria_id");
  CREATE INDEX "productos_updated_at_idx" ON "productos" USING btree ("updated_at");
  CREATE INDEX "productos_created_at_idx" ON "productos" USING btree ("created_at");
  CREATE INDEX "productos__status_idx" ON "productos" USING btree ("_status");
  CREATE INDEX "productos_rels_order_idx" ON "productos_rels" USING btree ("order");
  CREATE INDEX "productos_rels_parent_idx" ON "productos_rels" USING btree ("parent_id");
  CREATE INDEX "productos_rels_path_idx" ON "productos_rels" USING btree ("path");
  CREATE INDEX "productos_rels_cultivos_id_idx" ON "productos_rels" USING btree ("cultivos_id");
  CREATE INDEX "productos_rels_plagas_id_idx" ON "productos_rels" USING btree ("plagas_id");
  CREATE INDEX "_productos_v_version_dosis_order_idx" ON "_productos_v_version_dosis" USING btree ("_order");
  CREATE INDEX "_productos_v_version_dosis_parent_id_idx" ON "_productos_v_version_dosis" USING btree ("_parent_id");
  CREATE INDEX "_productos_v_version_dosis_cultivo_idx" ON "_productos_v_version_dosis" USING btree ("cultivo_id");
  CREATE INDEX "_productos_v_version_dosis_plaga_idx" ON "_productos_v_version_dosis" USING btree ("plaga_id");
  CREATE INDEX "_productos_v_parent_idx" ON "_productos_v" USING btree ("parent_id");
  CREATE INDEX "_productos_v_version_version_slug_idx" ON "_productos_v" USING btree ("version_slug");
  CREATE INDEX "_productos_v_version_version_categoria_idx" ON "_productos_v" USING btree ("version_categoria_id");
  CREATE INDEX "_productos_v_version_version_updated_at_idx" ON "_productos_v" USING btree ("version_updated_at");
  CREATE INDEX "_productos_v_version_version_created_at_idx" ON "_productos_v" USING btree ("version_created_at");
  CREATE INDEX "_productos_v_version_version__status_idx" ON "_productos_v" USING btree ("version__status");
  CREATE INDEX "_productos_v_created_at_idx" ON "_productos_v" USING btree ("created_at");
  CREATE INDEX "_productos_v_updated_at_idx" ON "_productos_v" USING btree ("updated_at");
  CREATE INDEX "_productos_v_latest_idx" ON "_productos_v" USING btree ("latest");
  CREATE INDEX "_productos_v_rels_order_idx" ON "_productos_v_rels" USING btree ("order");
  CREATE INDEX "_productos_v_rels_parent_idx" ON "_productos_v_rels" USING btree ("parent_id");
  CREATE INDEX "_productos_v_rels_path_idx" ON "_productos_v_rels" USING btree ("path");
  CREATE INDEX "_productos_v_rels_cultivos_id_idx" ON "_productos_v_rels" USING btree ("cultivos_id");
  CREATE INDEX "_productos_v_rels_plagas_id_idx" ON "_productos_v_rels" USING btree ("plagas_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categorias_fk" FOREIGN KEY ("categorias_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cultivos_fk" FOREIGN KEY ("cultivos_id") REFERENCES "public"."cultivos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_plagas_fk" FOREIGN KEY ("plagas_id") REFERENCES "public"."plagas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_productos_fk" FOREIGN KEY ("productos_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_categorias_id_idx" ON "payload_locked_documents_rels" USING btree ("categorias_id");
  CREATE INDEX "payload_locked_documents_rels_cultivos_id_idx" ON "payload_locked_documents_rels" USING btree ("cultivos_id");
  CREATE INDEX "payload_locked_documents_rels_plagas_id_idx" ON "payload_locked_documents_rels" USING btree ("plagas_id");
  CREATE INDEX "payload_locked_documents_rels_productos_id_idx" ON "payload_locked_documents_rels" USING btree ("productos_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categorias" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_categorias_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cultivos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cultivos_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "plagas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_plagas_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "productos_dosis" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "productos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "productos_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_productos_v_version_dosis" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_productos_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_productos_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "categorias" CASCADE;
  DROP TABLE "_categorias_v" CASCADE;
  DROP TABLE "cultivos" CASCADE;
  DROP TABLE "_cultivos_v" CASCADE;
  DROP TABLE "plagas" CASCADE;
  DROP TABLE "_plagas_v" CASCADE;
  DROP TABLE "productos_dosis" CASCADE;
  DROP TABLE "productos" CASCADE;
  DROP TABLE "productos_rels" CASCADE;
  DROP TABLE "_productos_v_version_dosis" CASCADE;
  DROP TABLE "_productos_v" CASCADE;
  DROP TABLE "_productos_v_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_categorias_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cultivos_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_plagas_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_productos_fk";
  
  DROP INDEX "payload_locked_documents_rels_categorias_id_idx";
  DROP INDEX "payload_locked_documents_rels_cultivos_id_idx";
  DROP INDEX "payload_locked_documents_rels_plagas_id_idx";
  DROP INDEX "payload_locked_documents_rels_productos_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "categorias_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cultivos_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "plagas_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "productos_id";
  DROP TYPE "public"."enum_categorias_status";
  DROP TYPE "public"."enum__categorias_v_version_status";
  DROP TYPE "public"."enum_cultivos_status";
  DROP TYPE "public"."enum__cultivos_v_version_status";
  DROP TYPE "public"."enum_plagas_status";
  DROP TYPE "public"."enum__plagas_v_version_status";
  DROP TYPE "public"."enum_productos_status";
  DROP TYPE "public"."enum__productos_v_version_status";`)
}

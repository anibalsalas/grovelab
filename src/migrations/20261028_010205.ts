import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_noticias_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__noticias_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "noticias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"slug" varchar,
  	"fecha" timestamp(3) with time zone,
  	"resumen" varchar,
  	"cuerpo" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_noticias_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_noticias_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_slug" varchar,
  	"version_fecha" timestamp(3) with time zone,
  	"version_resumen" varchar,
  	"version_cuerpo" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__noticias_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "consultas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"telefono" varchar NOT NULL,
  	"mensaje" varchar,
  	"producto_consulta" varchar,
  	"acepto_politica" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "textos_sitio_nosotros_bloques" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"cuerpo" varchar NOT NULL
  );
  
  CREATE TABLE "textos_sitio_servicios" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"descripcion" varchar
  );
  
  CREATE TABLE "textos_sitio_certificaciones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"etiqueta" varchar NOT NULL,
  	"valor" varchar NOT NULL,
  	"confirmada" boolean DEFAULT false
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "noticias_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "consultas_id" integer;
  ALTER TABLE "textos_sitio" ADD COLUMN "contacto_telefono" varchar;
  ALTER TABLE "textos_sitio" ADD COLUMN "contacto_correo" varchar;
  ALTER TABLE "textos_sitio" ADD COLUMN "contacto_direccion" varchar;
  ALTER TABLE "textos_sitio" ADD COLUMN "contacto_url_mapa" varchar;
  ALTER TABLE "textos_sitio" ADD COLUMN "nosotros_descripcion_lead" varchar;
  ALTER TABLE "textos_sitio" ADD COLUMN "testimonio_titulo" varchar;
  ALTER TABLE "textos_sitio" ADD COLUMN "testimonio_url_video" varchar;
  ALTER TABLE "textos_sitio" ADD COLUMN "texto_politica_privacidad" varchar;
  ALTER TABLE "_noticias_v" ADD CONSTRAINT "_noticias_v_parent_id_noticias_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."noticias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "textos_sitio_nosotros_bloques" ADD CONSTRAINT "textos_sitio_nosotros_bloques_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textos_sitio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textos_sitio_servicios" ADD CONSTRAINT "textos_sitio_servicios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textos_sitio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textos_sitio_certificaciones" ADD CONSTRAINT "textos_sitio_certificaciones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textos_sitio"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "noticias_slug_idx" ON "noticias" USING btree ("slug");
  CREATE INDEX "noticias_updated_at_idx" ON "noticias" USING btree ("updated_at");
  CREATE INDEX "noticias_created_at_idx" ON "noticias" USING btree ("created_at");
  CREATE INDEX "noticias__status_idx" ON "noticias" USING btree ("_status");
  CREATE INDEX "_noticias_v_parent_idx" ON "_noticias_v" USING btree ("parent_id");
  CREATE INDEX "_noticias_v_version_version_slug_idx" ON "_noticias_v" USING btree ("version_slug");
  CREATE INDEX "_noticias_v_version_version_updated_at_idx" ON "_noticias_v" USING btree ("version_updated_at");
  CREATE INDEX "_noticias_v_version_version_created_at_idx" ON "_noticias_v" USING btree ("version_created_at");
  CREATE INDEX "_noticias_v_version_version__status_idx" ON "_noticias_v" USING btree ("version__status");
  CREATE INDEX "_noticias_v_created_at_idx" ON "_noticias_v" USING btree ("created_at");
  CREATE INDEX "_noticias_v_updated_at_idx" ON "_noticias_v" USING btree ("updated_at");
  CREATE INDEX "_noticias_v_latest_idx" ON "_noticias_v" USING btree ("latest");
  CREATE INDEX "consultas_updated_at_idx" ON "consultas" USING btree ("updated_at");
  CREATE INDEX "consultas_created_at_idx" ON "consultas" USING btree ("created_at");
  CREATE INDEX "textos_sitio_nosotros_bloques_order_idx" ON "textos_sitio_nosotros_bloques" USING btree ("_order");
  CREATE INDEX "textos_sitio_nosotros_bloques_parent_id_idx" ON "textos_sitio_nosotros_bloques" USING btree ("_parent_id");
  CREATE INDEX "textos_sitio_servicios_order_idx" ON "textos_sitio_servicios" USING btree ("_order");
  CREATE INDEX "textos_sitio_servicios_parent_id_idx" ON "textos_sitio_servicios" USING btree ("_parent_id");
  CREATE INDEX "textos_sitio_certificaciones_order_idx" ON "textos_sitio_certificaciones" USING btree ("_order");
  CREATE INDEX "textos_sitio_certificaciones_parent_id_idx" ON "textos_sitio_certificaciones" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_noticias_fk" FOREIGN KEY ("noticias_id") REFERENCES "public"."noticias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consultas_fk" FOREIGN KEY ("consultas_id") REFERENCES "public"."consultas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_noticias_id_idx" ON "payload_locked_documents_rels" USING btree ("noticias_id");
  CREATE INDEX "payload_locked_documents_rels_consultas_id_idx" ON "payload_locked_documents_rels" USING btree ("consultas_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "noticias" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_noticias_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consultas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textos_sitio_nosotros_bloques" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textos_sitio_servicios" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textos_sitio_certificaciones" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "noticias" CASCADE;
  DROP TABLE "_noticias_v" CASCADE;
  DROP TABLE "consultas" CASCADE;
  DROP TABLE "textos_sitio_nosotros_bloques" CASCADE;
  DROP TABLE "textos_sitio_servicios" CASCADE;
  DROP TABLE "textos_sitio_certificaciones" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_noticias_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_consultas_fk";
  
  DROP INDEX "payload_locked_documents_rels_noticias_id_idx";
  DROP INDEX "payload_locked_documents_rels_consultas_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "noticias_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "consultas_id";
  ALTER TABLE "textos_sitio" DROP COLUMN "contacto_telefono";
  ALTER TABLE "textos_sitio" DROP COLUMN "contacto_correo";
  ALTER TABLE "textos_sitio" DROP COLUMN "contacto_direccion";
  ALTER TABLE "textos_sitio" DROP COLUMN "contacto_url_mapa";
  ALTER TABLE "textos_sitio" DROP COLUMN "nosotros_descripcion_lead";
  ALTER TABLE "textos_sitio" DROP COLUMN "testimonio_titulo";
  ALTER TABLE "textos_sitio" DROP COLUMN "testimonio_url_video";
  ALTER TABLE "textos_sitio" DROP COLUMN "texto_politica_privacidad";
  DROP TYPE "public"."enum_noticias_status";
  DROP TYPE "public"."enum__noticias_v_version_status";`)
}

import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pedidos_estado" AS ENUM('nuevo', 'contactado', 'cotizado', 'cerrado', 'descartado');
  CREATE TYPE "public"."enum_pedidos_destino" AS ENUM('zona', 'general');
  ALTER TYPE "public"."enum_users_role" ADD VALUE 'ventas';
  CREATE TABLE "pedidos_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"producto_id" integer,
  	"nombre_producto" varchar NOT NULL,
  	"presentacion" varchar NOT NULL,
  	"cantidad" numeric NOT NULL
  );
  
  CREATE TABLE "pedidos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"estado" "enum_pedidos_estado" DEFAULT 'nuevo' NOT NULL,
  	"nota_interna" varchar,
  	"nombre" varchar,
  	"telefono" varchar,
  	"zona_id" integer,
  	"ciudad" varchar,
  	"cultivo_id" integer,
  	"hectareas" numeric,
  	"destino" "enum_pedidos_destino",
  	"acepto_politica" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pedidos_id" integer;
  ALTER TABLE "pedidos_items" ADD CONSTRAINT "pedidos_items_producto_id_productos_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pedidos_items" ADD CONSTRAINT "pedidos_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pedidos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_zona_id_zonas_comerciales_id_fk" FOREIGN KEY ("zona_id") REFERENCES "public"."zonas_comerciales"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cultivo_id_cultivos_id_fk" FOREIGN KEY ("cultivo_id") REFERENCES "public"."cultivos"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pedidos_items_order_idx" ON "pedidos_items" USING btree ("_order");
  CREATE INDEX "pedidos_items_parent_id_idx" ON "pedidos_items" USING btree ("_parent_id");
  CREATE INDEX "pedidos_items_producto_idx" ON "pedidos_items" USING btree ("producto_id");
  CREATE INDEX "pedidos_estado_idx" ON "pedidos" USING btree ("estado");
  CREATE INDEX "pedidos_zona_idx" ON "pedidos" USING btree ("zona_id");
  CREATE INDEX "pedidos_cultivo_idx" ON "pedidos" USING btree ("cultivo_id");
  CREATE INDEX "pedidos_updated_at_idx" ON "pedidos" USING btree ("updated_at");
  CREATE INDEX "pedidos_created_at_idx" ON "pedidos" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pedidos_fk" FOREIGN KEY ("pedidos_id") REFERENCES "public"."pedidos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pedidos_id_idx" ON "payload_locked_documents_rels" USING btree ("pedidos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pedidos_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pedidos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pedidos_items" CASCADE;
  DROP TABLE "pedidos" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pedidos_fk";
  
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('administrador', 'editor');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  DROP INDEX "payload_locked_documents_rels_pedidos_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pedidos_id";
  DROP TYPE "public"."enum_pedidos_estado";
  DROP TYPE "public"."enum_pedidos_destino";`)
}

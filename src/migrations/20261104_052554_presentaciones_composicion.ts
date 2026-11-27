import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "productos_presentaciones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"etiqueta" varchar
  );
  
  CREATE TABLE "productos_composicion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"elemento" varchar,
  	"valor" varchar
  );
  
  CREATE TABLE "_productos_v_version_presentaciones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"etiqueta" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_productos_v_version_composicion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"elemento" varchar,
  	"valor" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "productos_presentaciones" ADD CONSTRAINT "productos_presentaciones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "productos_composicion" ADD CONSTRAINT "productos_composicion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_productos_v_version_presentaciones" ADD CONSTRAINT "_productos_v_version_presentaciones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_productos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_productos_v_version_composicion" ADD CONSTRAINT "_productos_v_version_composicion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_productos_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "productos_presentaciones_order_idx" ON "productos_presentaciones" USING btree ("_order");
  CREATE INDEX "productos_presentaciones_parent_id_idx" ON "productos_presentaciones" USING btree ("_parent_id");
  CREATE INDEX "productos_composicion_order_idx" ON "productos_composicion" USING btree ("_order");
  CREATE INDEX "productos_composicion_parent_id_idx" ON "productos_composicion" USING btree ("_parent_id");
  CREATE INDEX "_productos_v_version_presentaciones_order_idx" ON "_productos_v_version_presentaciones" USING btree ("_order");
  CREATE INDEX "_productos_v_version_presentaciones_parent_id_idx" ON "_productos_v_version_presentaciones" USING btree ("_parent_id");
  CREATE INDEX "_productos_v_version_composicion_order_idx" ON "_productos_v_version_composicion" USING btree ("_order");
  CREATE INDEX "_productos_v_version_composicion_parent_id_idx" ON "_productos_v_version_composicion" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "productos_presentaciones" CASCADE;
  DROP TABLE "productos_composicion" CASCADE;
  DROP TABLE "_productos_v_version_presentaciones" CASCADE;
  DROP TABLE "_productos_v_version_composicion" CASCADE;`)
}

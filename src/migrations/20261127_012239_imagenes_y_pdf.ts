import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categorias" ADD COLUMN "imagen_id" integer;
  ALTER TABLE "_categorias_v" ADD COLUMN "version_imagen_id" integer;
  ALTER TABLE "cultivos" ADD COLUMN "imagen_id" integer;
  ALTER TABLE "_cultivos_v" ADD COLUMN "version_imagen_id" integer;
  ALTER TABLE "productos" ADD COLUMN "ficha_tecnica_id" integer;
  ALTER TABLE "productos" ADD COLUMN "hoja_seguridad_id" integer;
  ALTER TABLE "productos_rels" ADD COLUMN "medios_id" integer;
  ALTER TABLE "_productos_v" ADD COLUMN "version_ficha_tecnica_id" integer;
  ALTER TABLE "_productos_v" ADD COLUMN "version_hoja_seguridad_id" integer;
  ALTER TABLE "_productos_v_rels" ADD COLUMN "medios_id" integer;
  ALTER TABLE "categorias" ADD CONSTRAINT "categorias_imagen_id_medios_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_categorias_v" ADD CONSTRAINT "_categorias_v_version_imagen_id_medios_id_fk" FOREIGN KEY ("version_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cultivos" ADD CONSTRAINT "cultivos_imagen_id_medios_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cultivos_v" ADD CONSTRAINT "_cultivos_v_version_imagen_id_medios_id_fk" FOREIGN KEY ("version_imagen_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "productos" ADD CONSTRAINT "productos_ficha_tecnica_id_medios_id_fk" FOREIGN KEY ("ficha_tecnica_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "productos" ADD CONSTRAINT "productos_hoja_seguridad_id_medios_id_fk" FOREIGN KEY ("hoja_seguridad_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "productos_rels" ADD CONSTRAINT "productos_rels_medios_fk" FOREIGN KEY ("medios_id") REFERENCES "public"."medios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_productos_v" ADD CONSTRAINT "_productos_v_version_ficha_tecnica_id_medios_id_fk" FOREIGN KEY ("version_ficha_tecnica_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_productos_v" ADD CONSTRAINT "_productos_v_version_hoja_seguridad_id_medios_id_fk" FOREIGN KEY ("version_hoja_seguridad_id") REFERENCES "public"."medios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_productos_v_rels" ADD CONSTRAINT "_productos_v_rels_medios_fk" FOREIGN KEY ("medios_id") REFERENCES "public"."medios"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "categorias_imagen_idx" ON "categorias" USING btree ("imagen_id");
  CREATE INDEX "_categorias_v_version_version_imagen_idx" ON "_categorias_v" USING btree ("version_imagen_id");
  CREATE INDEX "cultivos_imagen_idx" ON "cultivos" USING btree ("imagen_id");
  CREATE INDEX "_cultivos_v_version_version_imagen_idx" ON "_cultivos_v" USING btree ("version_imagen_id");
  CREATE INDEX "productos_ficha_tecnica_idx" ON "productos" USING btree ("ficha_tecnica_id");
  CREATE INDEX "productos_hoja_seguridad_idx" ON "productos" USING btree ("hoja_seguridad_id");
  CREATE INDEX "productos_rels_medios_id_idx" ON "productos_rels" USING btree ("medios_id");
  CREATE INDEX "_productos_v_version_version_ficha_tecnica_idx" ON "_productos_v" USING btree ("version_ficha_tecnica_id");
  CREATE INDEX "_productos_v_version_version_hoja_seguridad_idx" ON "_productos_v" USING btree ("version_hoja_seguridad_id");
  CREATE INDEX "_productos_v_rels_medios_id_idx" ON "_productos_v_rels" USING btree ("medios_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categorias" DROP CONSTRAINT "categorias_imagen_id_medios_id_fk";
  
  ALTER TABLE "_categorias_v" DROP CONSTRAINT "_categorias_v_version_imagen_id_medios_id_fk";
  
  ALTER TABLE "cultivos" DROP CONSTRAINT "cultivos_imagen_id_medios_id_fk";
  
  ALTER TABLE "_cultivos_v" DROP CONSTRAINT "_cultivos_v_version_imagen_id_medios_id_fk";
  
  ALTER TABLE "productos" DROP CONSTRAINT "productos_ficha_tecnica_id_medios_id_fk";
  
  ALTER TABLE "productos" DROP CONSTRAINT "productos_hoja_seguridad_id_medios_id_fk";
  
  ALTER TABLE "productos_rels" DROP CONSTRAINT "productos_rels_medios_fk";
  
  ALTER TABLE "_productos_v" DROP CONSTRAINT "_productos_v_version_ficha_tecnica_id_medios_id_fk";
  
  ALTER TABLE "_productos_v" DROP CONSTRAINT "_productos_v_version_hoja_seguridad_id_medios_id_fk";
  
  ALTER TABLE "_productos_v_rels" DROP CONSTRAINT "_productos_v_rels_medios_fk";
  
  DROP INDEX "categorias_imagen_idx";
  DROP INDEX "_categorias_v_version_version_imagen_idx";
  DROP INDEX "cultivos_imagen_idx";
  DROP INDEX "_cultivos_v_version_version_imagen_idx";
  DROP INDEX "productos_ficha_tecnica_idx";
  DROP INDEX "productos_hoja_seguridad_idx";
  DROP INDEX "productos_rels_medios_id_idx";
  DROP INDEX "_productos_v_version_version_ficha_tecnica_idx";
  DROP INDEX "_productos_v_version_version_hoja_seguridad_idx";
  DROP INDEX "_productos_v_rels_medios_id_idx";
  ALTER TABLE "categorias" DROP COLUMN "imagen_id";
  ALTER TABLE "_categorias_v" DROP COLUMN "version_imagen_id";
  ALTER TABLE "cultivos" DROP COLUMN "imagen_id";
  ALTER TABLE "_cultivos_v" DROP COLUMN "version_imagen_id";
  ALTER TABLE "productos" DROP COLUMN "ficha_tecnica_id";
  ALTER TABLE "productos" DROP COLUMN "hoja_seguridad_id";
  ALTER TABLE "productos_rels" DROP COLUMN "medios_id";
  ALTER TABLE "_productos_v" DROP COLUMN "version_ficha_tecnica_id";
  ALTER TABLE "_productos_v" DROP COLUMN "version_hoja_seguridad_id";
  ALTER TABLE "_productos_v_rels" DROP COLUMN "medios_id";`)
}

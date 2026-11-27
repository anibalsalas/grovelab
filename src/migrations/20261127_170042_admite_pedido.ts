import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "productos" ADD COLUMN "admite_pedido" boolean DEFAULT true;
  ALTER TABLE "_productos_v" ADD COLUMN "version_admite_pedido" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "productos" DROP COLUMN "admite_pedido";
  ALTER TABLE "_productos_v" DROP COLUMN "version_admite_pedido";`)
}

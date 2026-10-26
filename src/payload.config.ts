import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { es } from "@payloadcms/translations/languages/es";
import { buildConfig } from "payload";

import { PruebaEnsayo } from "./collections/prueba-ensayo.ts";
import { Users } from "./collections/users.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, PruebaEnsayo],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  graphQL: {
    disable: true,
  },
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: "es",
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL ?? "",
    },
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
  }),
});

import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { es } from "@payloadcms/translations/languages/es";
import { buildConfig } from "payload";

import { Categorias } from "./collections/categorias.ts";
import { Consultas } from "./collections/consultas.ts";
import { Cultivos } from "./collections/cultivos.ts";
import { Noticias } from "./collections/noticias.ts";
import { Plagas } from "./collections/plagas.ts";
import { Productos } from "./collections/productos.ts";
import { Users } from "./collections/users.ts";
import { TextosSitio } from "./globals/textos-sitio.ts";
import { normalizarDatabaseUrl } from "./lib/normalizar-database-url.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Categorias,
    Cultivos,
    Plagas,
    Productos,
    Noticias,
    Consultas,
  ],
  globals: [TextosSitio],
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
      connectionString: normalizarDatabaseUrl(process.env.DATABASE_URL ?? ""),
    },
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
  }),
});

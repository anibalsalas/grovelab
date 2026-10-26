/**
 * Semilla local del usuario administrador.
 * Ejecutar con: npm run seed:admin (Node carga .env.local vía --env-file).
 * No imprime contraseñas ni cadenas de conexión.
 */
import { z } from "zod";

import { getPayload } from "payload";

import type { UserPanelRole } from "../collections/users.ts";
import config from "../payload.config.ts";

const seedSchema = z.object({
  SEED_ADMIN_EMAIL: z.string().email(),
  SEED_ADMIN_PASSWORD: z.string().min(12),
});

async function main() {
  console.log(
    "seed:admin usa variables de .env.local cargadas por Node (--env-file=.env.local).",
  );

  if (process.env.NODE_ENV === "production") {
    console.error(
      "seed:admin no se ejecuta con NODE_ENV=production. Usa solo en desarrollo local.",
    );
    process.exit(1);
  }

  const parsed = seedSchema.safeParse({
    SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
    SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
  });

  if (!parsed.success) {
    const keys = [
      ...new Set(parsed.error.issues.map((issue) => issue.path.join("."))),
    ];
    console.error(
      `Variables de semilla inválidas o faltantes en .env.local: ${keys.join(", ")}`,
    );
    process.exit(1);
  }

  const { SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: password } =
    parsed.data;

  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: "users",
    limit: 1,
    overrideAccess: true,
    where: {
      email: {
        equals: email,
      },
    },
  });

  if (existing.docs.length > 0) {
    const doc = existing.docs[0];
    if (!doc) {
      console.error("No se pudo leer el usuario administrador existente.");
      process.exit(1);
    }
    const currentRole = doc.role as UserPanelRole | undefined;

    if (currentRole !== "administrador") {
      await payload.update({
        collection: "users",
        id: doc.id,
        overrideAccess: true,
        data: {
          role: "administrador",
        },
      });
      console.log(
        "Usuario administrador existente actualizado con rol administrador.",
      );
    } else {
      console.log("El usuario administrador ya existe; no se creó otro.");
    }
    process.exit(0);
  }

  await payload.create({
    collection: "users",
    overrideAccess: true,
    data: {
      email,
      password,
      role: "administrador",
    },
  });

  console.log("Usuario administrador creado.");
}

try {
  await main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : "Error desconocido";
  console.error(`No se pudo completar la semilla: ${message}`);
  process.exit(1);
}

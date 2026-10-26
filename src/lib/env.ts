import { z } from "zod";

/** Obligatorio desde tarea 3. `DATABASE_URL` y `PAYLOAD_SECRET` pasan a obligatorios en tarea 4. */
const serverEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  WHATSAPP_NUMBER: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  PAYLOAD_SECRET: z.string().min(1).optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function emptyToUndefined(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export function parseEnvFromSource(
  source: Record<string, string | undefined>,
): ServerEnv {
  const result = serverEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: source.NEXT_PUBLIC_SITE_URL,
    WHATSAPP_NUMBER: emptyToUndefined(source.WHATSAPP_NUMBER),
    DATABASE_URL: emptyToUndefined(source.DATABASE_URL),
    PAYLOAD_SECRET: emptyToUndefined(source.PAYLOAD_SECRET),
  });

  if (!result.success) {
    throw new Error(formatEnvError(result.error));
  }

  return result.data;
}

function formatEnvError(error: z.ZodError): string {
  const keys = [
    ...new Set(
      error.issues.map((issue) =>
        issue.path.length > 0 ? issue.path.join(".") : "desconocida",
      ),
    ),
  ];
  return `Variables de entorno inválidas o faltantes: ${keys.join(", ")}`;
}

let cachedEnv: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (cachedEnv !== undefined) {
    return cachedEnv;
  }

  cachedEnv = parseEnvFromSource(
    process.env as Record<string, string | undefined>,
  );

  return cachedEnv;
}

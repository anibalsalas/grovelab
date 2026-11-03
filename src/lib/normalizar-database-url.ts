const MODOS_SSL_LEGACY = new Set(["prefer", "require", "verify-ca"]);

/**
 * pg v9 avisa si sslmode es require/prefer/verify-ca sin ser explícito verify-full.
 * Neon suele enviar require; normalizamos al arrancar Payload.
 */
export function normalizarDatabaseUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const sslmode = parsed.searchParams.get("sslmode");
    if (sslmode && MODOS_SSL_LEGACY.has(sslmode)) {
      parsed.searchParams.set("sslmode", "verify-full");
    }
    return parsed.toString();
  } catch {
    return trimmed;
  }
}

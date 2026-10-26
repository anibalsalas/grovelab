import { describe, expect, it } from "vitest";

import { parseEnvFromSource } from "./env";

describe("parseEnvFromSource", () => {
  it("acepta configuración válida con URL pública obligatoria", () => {
    const env = parseEnvFromSource({
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    });

    expect(env.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
    expect(env.DATABASE_URL).toBeUndefined();
  });

  it("rechaza cuando falta NEXT_PUBLIC_SITE_URL sin exponer valores", () => {
    expect(() => parseEnvFromSource({})).toThrow(
      /Variables de entorno inválidas o faltantes: NEXT_PUBLIC_SITE_URL/,
    );

    try {
      parseEnvFromSource({
        DATABASE_URL: "postgres://secreto:secreto@host/db",
        PAYLOAD_SECRET: "no-mostrar",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      const message = (error as Error).message;
      expect(message).not.toContain("postgres");
      expect(message).not.toContain("no-mostrar");
      expect(message).toContain("NEXT_PUBLIC_SITE_URL");
    }
  });
});

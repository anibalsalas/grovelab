import { describe, expect, it } from "vitest";

import { parseEnvFromSource } from "./env";

const baseEnv = {
  NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  DATABASE_URL: "postgres://usuario:secreto@host:5432/grovelab",
  PAYLOAD_SECRET: "secreto-local-minimo-32-chars-xx",
};

describe("parseEnvFromSource", () => {
  it("acepta configuración válida con variables obligatorias", () => {
    const env = parseEnvFromSource(baseEnv);

    expect(env.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
    expect(env.DATABASE_URL).toBe(baseEnv.DATABASE_URL);
    expect(env.PAYLOAD_SECRET).toBe(baseEnv.PAYLOAD_SECRET);
  });

  it("rechaza cuando falta DATABASE_URL sin exponer valores", () => {
    expect(() =>
      parseEnvFromSource({
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
        PAYLOAD_SECRET: "secreto-local-minimo-32-chars-xx",
      }),
    ).toThrow(/DATABASE_URL/);

    try {
      parseEnvFromSource({
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
        PAYLOAD_SECRET: "no-mostrar",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      const message = (error as Error).message;
      expect(message).not.toContain("no-mostrar");
      expect(message).toContain("DATABASE_URL");
    }
  });
});

import { describe, expect, it } from "vitest";

import { normalizarDatabaseUrl } from "./normalizar-database-url.ts";

describe("normalizarDatabaseUrl", () => {
  it("cambia sslmode=require a verify-full", () => {
    const url =
      "postgresql://user:pass@host.neon.tech/db?sslmode=require";
    expect(normalizarDatabaseUrl(url)).toBe(
      "postgresql://user:pass@host.neon.tech/db?sslmode=verify-full",
    );
  });

  it("deja verify-full sin cambios", () => {
    const url =
      "postgresql://user:pass@host/db?sslmode=verify-full";
    expect(normalizarDatabaseUrl(url)).toBe(url);
  });

  it("devuelve cadena vacía sin lanzar", () => {
    expect(normalizarDatabaseUrl("")).toBe("");
  });
});

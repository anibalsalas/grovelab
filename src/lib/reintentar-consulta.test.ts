import { describe, expect, it } from "vitest";

import { reintentarConsulta } from "./reintentar-consulta.ts";

describe("reintentarConsulta", () => {
  it("devuelve el resultado sin reintentar si la consulta sale bien", async () => {
    let llamadas = 0;
    const resultado = await reintentarConsulta(async () => {
      llamadas += 1;
      return "ok";
    });
    expect(resultado).toBe("ok");
    expect(llamadas).toBe(1);
  });

  it("reintenta una vez cuando la primera conexión se cae", async () => {
    let llamadas = 0;
    const resultado = await reintentarConsulta(
      async () => {
        llamadas += 1;
        if (llamadas === 1) {
          throw new Error("read ECONNRESET");
        }
        return 42;
      },
      { esperaMs: 1 },
    );
    expect(resultado).toBe(42);
    expect(llamadas).toBe(2);
  });

  it("propaga el último error si todos los intentos fallan", async () => {
    let llamadas = 0;
    await expect(
      reintentarConsulta(
        async () => {
          llamadas += 1;
          throw new Error(`falla ${llamadas}`);
        },
        { intentos: 2, esperaMs: 1 },
      ),
    ).rejects.toThrow("falla 2");
    expect(llamadas).toBe(2);
  });
});

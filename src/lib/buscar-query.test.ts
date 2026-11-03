import { describe, expect, it } from "vitest";

import {
  parseBuscarQuery,
  tieneFiltrosBuscar,
} from "./buscar-query.ts";

describe("parseBuscarQuery", () => {
  it("normaliza texto y slugs válidos", () => {
    const query = parseBuscarQuery({
      q: "  nutrición  ",
      cultivo: "vid",
      plaga: "trips",
      categoria: "bioestimulantes",
    });
    expect(query).toEqual({
      q: "nutrición",
      cultivo: "vid",
      plaga: "trips",
      categoria: "bioestimulantes",
    });
    expect(tieneFiltrosBuscar(query)).toBe(true);
  });

  it("rechaza slugs inválidos sin lanzar", () => {
    const query = parseBuscarQuery({
      q: "ok",
      cultivo: "vid con espacio",
    });
    expect(query.cultivo).toBeUndefined();
    expect(query.q).toBe("ok");
  });

  it("trata cadenas vacías como sin filtro", () => {
    const query = parseBuscarQuery({
      q: "",
      cultivo: "",
    });
    expect(tieneFiltrosBuscar(query)).toBe(false);
  });

  it("limita texto largo devolviendo consulta vacía", () => {
    const query = parseBuscarQuery({
      q: "a".repeat(250),
    });
    expect(tieneFiltrosBuscar(query)).toBe(false);
  });
});

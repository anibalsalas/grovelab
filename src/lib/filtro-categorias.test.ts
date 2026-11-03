import { describe, expect, it } from "vitest";

import {
  paginaActual,
  parseProductosQuery,
  PRODUCTOS_POR_PAGINA,
} from "./filtro-categorias.ts";

describe("parseProductosQuery", () => {
  it("devuelve vacío sin parámetros", () => {
    expect(parseProductosQuery({})).toEqual({});
  });

  it("acepta slug de categoría válido", () => {
    expect(parseProductosQuery({ categoria: "nutricion" })).toEqual({
      categoria: "nutricion",
    });
  });

  it("ignora slug inválido", () => {
    expect(parseProductosQuery({ categoria: "a b" })).toEqual({});
  });

  it("acepta página válida", () => {
    expect(parseProductosQuery({ pagina: "2" })).toEqual({ pagina: 2 });
  });

  it("ignora página inválida", () => {
    expect(parseProductosQuery({ pagina: "0" })).toEqual({});
  });
});

describe("paginaActual", () => {
  it("usa 1 por defecto", () => {
    expect(paginaActual({})).toBe(1);
  });
});

describe("PRODUCTOS_POR_PAGINA", () => {
  it("es 12", () => {
    expect(PRODUCTOS_POR_PAGINA).toBe(12);
  });
});

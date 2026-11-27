import { describe, expect, it } from "vitest";

import {
  parseBuscarQuery,
  PRODUCTOS_POR_PAGINA,
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
      pagina: undefined,
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

  it("acepta página válida", () => {
    expect(parseBuscarQuery({ pagina: "2" }).pagina).toBe(2);
  });

  it("ignora página inválida sin afectar los demás filtros", () => {
    const query = parseBuscarQuery({ pagina: "0", categoria: "nutricion" });
    expect(query.pagina).toBeUndefined();
    expect(query.categoria).toBe("nutricion");
  });

  it("la página no cuenta como filtro de búsqueda", () => {
    expect(tieneFiltrosBuscar({ pagina: 3 })).toBe(false);
  });
});

describe("PRODUCTOS_POR_PAGINA", () => {
  it("es 12", () => {
    expect(PRODUCTOS_POR_PAGINA).toBe(12);
  });
});

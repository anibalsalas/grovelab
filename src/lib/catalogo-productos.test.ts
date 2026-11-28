import { describe, expect, it } from "vitest";

import {
  FILTROS_VACIOS,
  calcularOpciones,
  construirUrlCatalogo,
  contarFacetasActivas,
  filtrarProductos,
  indexarCatalogo,
  normalizarTexto,
  paginar,
  sanearFiltros,
  type FiltrosCatalogo,
  type ProductoCatalogo,
} from "./catalogo-productos.ts";

function producto(
  id: number,
  nombre: string,
  extra: Partial<ProductoCatalogo> = {},
): ProductoCatalogo {
  return {
    id,
    slug: nombre.toLowerCase().replace(/\s+/g, "-"),
    nombre,
    resumen: null,
    ingredienteActivo: null,
    categoria: null,
    cultivos: [],
    plagas: [],
    imagen: null,
    ...extra,
  };
}

const foliar = { slug: "fertilizante-foliar", nombre: "Fertilizante foliar", orden: 2 };
const fungicida = { slug: "fungicida", nombre: "Fungicida", orden: 1 };
const vid = { slug: "vid", nombre: "Vid" };
const aji = { slug: "aji", nombre: "Ají" };
const oidiosis = { slug: "oidiosis", nombre: "Oidiosis" };

const catalogo = indexarCatalogo([
  producto(1, "Cuajado", {
    resumen: "Favorece el cuajado de frutos",
    categoria: foliar,
    cultivos: [vid, aji],
  }),
  producto(2, "Koala", { categoria: fungicida, cultivos: [vid], plagas: [oidiosis] }),
  producto(3, "Lignofol", { categoria: foliar, ingredienteActivo: "Lignosulfonato" }),
]);

const conFiltros = (parcial: Partial<FiltrosCatalogo>): FiltrosCatalogo => ({
  ...FILTROS_VACIOS,
  ...parcial,
});

const nombres = (filtros: Partial<FiltrosCatalogo>) =>
  filtrarProductos(catalogo, conFiltros(filtros)).map((p) => p.nombre);

describe("normalizarTexto", () => {
  it("ignora mayúsculas, tildes y espacios repetidos", () => {
    expect(normalizarTexto("  ÁJÍ   Rocotó ")).toBe("aji rocoto");
  });
});

describe("filtrarProductos", () => {
  it("sin filtros devuelve el catálogo completo", () => {
    expect(nombres({})).toEqual(["Cuajado", "Koala", "Lignofol"]);
  });

  it("busca por nombre, resumen e ingrediente activo sin importar tildes ni mayúsculas", () => {
    expect(nombres({ q: "KOALA" })).toEqual(["Koala"]);
    expect(nombres({ q: "frutos" })).toEqual(["Cuajado"]);
    expect(nombres({ q: "lignosulfonato" })).toEqual(["Lignofol"]);
  });

  it("busca también por cultivo y plaga relacionados, ignorando tildes", () => {
    expect(nombres({ q: "aji" })).toEqual(["Cuajado"]);
    expect(nombres({ q: "OIDIÓSIS" })).toEqual(["Koala"]);
  });

  it("exige todos los términos escritos, en cualquier orden", () => {
    expect(nombres({ q: "vid fungicida" })).toEqual(["Koala"]);
    expect(nombres({ q: "vid inexistente" })).toEqual([]);
  });

  it("combina los filtros por categoría, cultivo y plaga", () => {
    expect(nombres({ cultivo: "vid" })).toEqual(["Cuajado", "Koala"]);
    expect(nombres({ cultivo: "vid", categoria: "fungicida" })).toEqual(["Koala"]);
    expect(nombres({ cultivo: "vid", categoria: "fertilizante-foliar", plaga: "oidiosis" })).toEqual(
      [],
    );
    expect(nombres({ q: "cuajado", cultivo: "vid" })).toEqual(["Cuajado"]);
  });
});

describe("calcularOpciones", () => {
  it("solo ofrece opciones que tienen productos y ordena las categorías por su orden", () => {
    const opciones = calcularOpciones(catalogo, FILTROS_VACIOS);
    expect(opciones.categoria.map((o) => o.slug)).toEqual(["fungicida", "fertilizante-foliar"]);
    expect(opciones.cultivo.map((o) => [o.slug, o.total])).toEqual([
      ["aji", 1],
      ["vid", 2],
    ]);
  });

  it("cuenta cada opción respetando los demás filtros, pero no el suyo", () => {
    const opciones = calcularOpciones(catalogo, conFiltros({ categoria: "fungicida" }));
    expect(opciones.cultivo.find((o) => o.slug === "vid")?.total).toBe(1);
    expect(opciones.cultivo.find((o) => o.slug === "aji")?.total).toBe(0);
    // El propio filtro no se descuenta a sí mismo: se puede cambiar de categoría.
    expect(opciones.categoria.find((o) => o.slug === "fertilizante-foliar")?.total).toBe(2);
  });
});

describe("sanearFiltros", () => {
  it("descarta valores que no existen en el catálogo y conserva los válidos", () => {
    const opciones = calcularOpciones(catalogo, FILTROS_VACIOS);
    const saneados = sanearFiltros(
      conFiltros({ q: "koala", cultivo: "inexistente", categoria: "fungicida" }),
      opciones,
    );
    expect(saneados).toMatchObject({ q: "koala", cultivo: "", categoria: "fungicida" });
    expect(contarFacetasActivas(saneados)).toBe(1);
  });
});

describe("paginar", () => {
  const muchos = Array.from({ length: 30 }, (_, i) => producto(i + 1, `P${i + 1}`));

  it("divide en páginas de 12", () => {
    const pagina = paginar(muchos, 3);
    expect(pagina.items).toHaveLength(6);
    expect(pagina.totalPaginas).toBe(3);
  });

  it("ajusta una página fuera de rango y tolera listas vacías", () => {
    expect(paginar(muchos, 99).pagina).toBe(3);
    expect(paginar([], 5)).toEqual({ items: [], pagina: 1, totalPaginas: 1 });
  });
});

describe("construirUrlCatalogo", () => {
  it("omite los filtros vacíos y la página 1", () => {
    expect(construirUrlCatalogo(FILTROS_VACIOS)).toBe("/productos");
    expect(construirUrlCatalogo(conFiltros({ q: "ají verde", cultivo: "vid", pagina: 2 }))).toBe(
      "/productos?q=aj%C3%AD+verde&cultivo=vid&pagina=2",
    );
  });
});

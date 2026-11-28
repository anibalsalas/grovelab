/**
 * Lógica pura del catálogo de /productos: normalización de texto, filtrado,
 * conteo por filtro (facetas) y paginación. No toca el DOM ni la red: se ejecuta
 * igual en el servidor (primer HTML) y en el navegador (filtrado en vivo), así que
 * no hay diferencias de hidratación.
 */
import { PRODUCTOS_POR_PAGINA, type BuscarQuery } from "./buscar-query.ts";
import type { ImagenTarjeta } from "@/components/ui/tarjeta-producto";

export const RUTA_PRODUCTOS = "/productos";

export type RelacionCatalogo = { slug: string; nombre: string };

export type ProductoCatalogo = {
  id: number;
  slug: string;
  nombre: string;
  resumen: string | null;
  ingredienteActivo: string | null;
  categoria: (RelacionCatalogo & { orden: number }) | null;
  cultivos: RelacionCatalogo[];
  plagas: RelacionCatalogo[];
  imagen: ImagenTarjeta | null;
};

/** Texto de búsqueda ya normalizado, calculado una sola vez por producto. */
export type ProductoIndexado = { producto: ProductoCatalogo; texto: string };

export type FiltrosCatalogo = {
  q: string;
  categoria: string;
  cultivo: string;
  plaga: string;
  pagina: number;
};

export const FILTROS_VACIOS: FiltrosCatalogo = {
  q: "",
  categoria: "",
  cultivo: "",
  plaga: "",
  pagina: 1,
};

export type Faceta = "categoria" | "cultivo" | "plaga";

export const FACETAS: readonly Faceta[] = ["categoria", "cultivo", "plaga"];

export type OpcionFaceta = RelacionCatalogo & {
  /** Productos que quedarían al elegir esta opción, con los demás filtros activos. */
  total: number;
};

/** Minúsculas, sin tildes ni diéresis y con espacios colapsados («Ají» → «aji»). */
export function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function textoBuscable(producto: ProductoCatalogo): string {
  return normalizarTexto(
    [
      producto.nombre,
      producto.resumen,
      producto.ingredienteActivo,
      producto.categoria?.nombre,
      ...producto.cultivos.map((c) => c.nombre),
      ...producto.plagas.map((p) => p.nombre),
    ]
      .filter((valor): valor is string => Boolean(valor))
      .join(" "),
  );
}

export function indexarCatalogo(productos: ProductoCatalogo[]): ProductoIndexado[] {
  return productos.map((producto) => ({ producto, texto: textoBuscable(producto) }));
}

export function filtrosDesdeQuery(query: BuscarQuery): FiltrosCatalogo {
  return {
    q: query.q ?? "",
    categoria: query.categoria ?? "",
    cultivo: query.cultivo ?? "",
    plaga: query.plaga ?? "",
    pagina: query.pagina ?? 1,
  };
}

export function hayFiltrosActivos(filtros: FiltrosCatalogo): boolean {
  return Boolean(filtros.q || filtros.categoria || filtros.cultivo || filtros.plaga);
}

export function contarFacetasActivas(filtros: FiltrosCatalogo): number {
  return FACETAS.filter((faceta) => filtros[faceta] !== "").length;
}

function perteneceAFaceta(producto: ProductoCatalogo, faceta: Faceta, slug: string): boolean {
  switch (faceta) {
    case "categoria":
      return producto.categoria?.slug === slug;
    case "cultivo":
      return producto.cultivos.some((c) => c.slug === slug);
    case "plaga":
      return producto.plagas.some((p) => p.slug === slug);
  }
}

/** Todos los términos escritos deben aparecer (en cualquier orden). */
function coincideTexto(texto: string, q: string): boolean {
  const terminos = normalizarTexto(q).split(" ").filter(Boolean);
  return terminos.every((termino) => texto.includes(termino));
}

function coincide(
  { producto, texto }: ProductoIndexado,
  filtros: FiltrosCatalogo,
  omitir?: Faceta,
): boolean {
  if (filtros.q && !coincideTexto(texto, filtros.q)) {
    return false;
  }
  return FACETAS.every(
    (faceta) =>
      faceta === omitir ||
      filtros[faceta] === "" ||
      perteneceAFaceta(producto, faceta, filtros[faceta]),
  );
}

export function filtrarProductos(
  indexados: ProductoIndexado[],
  filtros: FiltrosCatalogo,
): ProductoCatalogo[] {
  return indexados.filter((item) => coincide(item, filtros)).map((item) => item.producto);
}

function relacionesDe(producto: ProductoCatalogo, faceta: Faceta): RelacionCatalogo[] {
  switch (faceta) {
    case "categoria":
      return producto.categoria ? [producto.categoria] : [];
    case "cultivo":
      return producto.cultivos;
    case "plaga":
      return producto.plagas;
  }
}

/**
 * Opciones de cada filtro, tomadas de las relaciones reales de los productos publicados
 * (nunca una opción que no tenga ningún producto). El `total` de cada una respeta los
 * demás filtros activos, para no ofrecer combinaciones que terminan en cero resultados.
 */
export function calcularOpciones(
  indexados: ProductoIndexado[],
  filtros: FiltrosCatalogo,
): Record<Faceta, OpcionFaceta[]> {
  const resultado: Record<Faceta, OpcionFaceta[]> = {
    categoria: [],
    cultivo: [],
    plaga: [],
  };

  for (const faceta of FACETAS) {
    const opciones = new Map<string, OpcionFaceta & { orden: number }>();
    for (const item of indexados) {
      const coincideConOtros = coincide(item, filtros, faceta);
      for (const relacion of relacionesDe(item.producto, faceta)) {
        const actual = opciones.get(relacion.slug) ?? {
          slug: relacion.slug,
          nombre: relacion.nombre,
          total: 0,
          orden: "orden" in relacion ? Number(relacion.orden) : 0,
        };
        if (coincideConOtros) {
          actual.total += 1;
        }
        opciones.set(relacion.slug, actual);
      }
    }
    resultado[faceta] = [...opciones.values()]
      .sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, "es"))
      .map(({ slug, nombre, total }) => ({ slug, nombre, total }));
  }

  return resultado;
}

/** Quita de la URL los valores que no existen en el catálogo (filtros inválidos o antiguos). */
export function sanearFiltros(
  filtros: FiltrosCatalogo,
  opciones: Record<Faceta, OpcionFaceta[]>,
): FiltrosCatalogo {
  const saneados = { ...filtros };
  for (const faceta of FACETAS) {
    if (!opciones[faceta].some((opcion) => opcion.slug === filtros[faceta])) {
      saneados[faceta] = "";
    }
  }
  return saneados;
}

export type PaginaCatalogo = {
  items: ProductoCatalogo[];
  pagina: number;
  totalPaginas: number;
};

export function paginar(
  productos: ProductoCatalogo[],
  pagina: number,
  porPagina: number = PRODUCTOS_POR_PAGINA,
): PaginaCatalogo {
  const totalPaginas = Math.max(1, Math.ceil(productos.length / porPagina));
  const actual = Math.min(Math.max(1, pagina), totalPaginas);
  const inicio = (actual - 1) * porPagina;
  return {
    items: productos.slice(inicio, inicio + porPagina),
    pagina: actual,
    totalPaginas,
  };
}

/** URL canónica de un estado del catálogo: solo lleva los filtros que tienen valor. */
export function construirUrlCatalogo(filtros: FiltrosCatalogo): string {
  const params = new URLSearchParams();
  if (filtros.q) params.set("q", filtros.q);
  if (filtros.categoria) params.set("categoria", filtros.categoria);
  if (filtros.cultivo) params.set("cultivo", filtros.cultivo);
  if (filtros.plaga) params.set("plaga", filtros.plaga);
  if (filtros.pagina > 1) params.set("pagina", String(filtros.pagina));
  const consulta = params.toString();
  return consulta ? `${RUTA_PRODUCTOS}?${consulta}` : RUTA_PRODUCTOS;
}

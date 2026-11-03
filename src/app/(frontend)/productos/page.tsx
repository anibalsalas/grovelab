import type { Metadata } from "next";
import Link from "next/link";

import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import { TarjetaProducto } from "@/components/ui/tarjeta-producto";
import {
  paginaActual,
  parseProductosQuery,
  PRODUCTOS_POR_PAGINA,
} from "@/lib/filtro-categorias.ts";
import { CintaSeccion } from "@/components/layout/cinta-seccion";
import {
  contenedorPagina,
  idContenidoPrincipal,
  scrollMargenContenido,
} from "@/lib/clases-sitio";
import { getPayloadClient } from "@/lib/payload-client";
import listado from "@/styles/listado.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Productos",
  description: "Catálogo de productos para el agro.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function urlProductos(categoria?: string, pagina?: number): string {
  const params = new URLSearchParams();
  if (categoria) {
    params.set("categoria", categoria);
  }
  if (pagina && pagina > 1) {
    params.set("pagina", String(pagina));
  }
  const query = params.toString();
  return query ? `/productos?${query}` : "/productos";
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = parseProductosQuery(params);
  const pagina = paginaActual(query);
  const payload = await getPayloadClient();

  const categoriasResult = await payload.find({
    collection: "categorias",
    limit: 100,
    sort: "orden",
    depth: 0,
  });

  const categoriaDoc = query.categoria
    ? categoriasResult.docs.find((c) => c.slug === query.categoria)
    : undefined;
  const categoriaInvalida = Boolean(query.categoria && !categoriaDoc);

  const where =
    categoriaDoc && !categoriaInvalida
      ? { categoria: { equals: categoriaDoc.id } }
      : undefined;

  const resultado = await payload.find({
    collection: "productos",
    limit: PRODUCTOS_POR_PAGINA,
    page: categoriaInvalida ? 1 : pagina,
    sort: "nombre",
    depth: 1,
    ...(where ? { where } : {}),
  });

  const totalPaginas = resultado.totalPages;
  const productos = categoriaInvalida ? [] : resultado.docs;

  return (
    <main id={idContenidoPrincipal} className={scrollMargenContenido}>
      <CintaSeccion tono="verde">
        <EncabezadoPagina
          destacado="Catálogo"
          titulo="Productos"
          descripcion="Catálogo de formulaciones Grovelab."
        />
      </CintaSeccion>

      <div className={contenedorPagina}>
      <nav className="mt-8" aria-label="Filtrar por categoría">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href="/productos"
              className={`inline-flex min-h-11 items-center rounded-m border border-marca/20 px-4 text-sm ${
                !query.categoria ? listado.filtroActivo : ""
              }`}
              aria-current={!query.categoria ? "true" : undefined}
            >
              Todas
            </Link>
          </li>
          {categoriasResult.docs.map((cat) => (
            <li key={cat.id}>
              <Link
                href={urlProductos(cat.slug)}
                className={`inline-flex min-h-11 items-center rounded-m border border-marca/20 px-4 text-sm ${
                  query.categoria === cat.slug ? listado.filtroActivo : ""
                }`}
                aria-current={
                  query.categoria === cat.slug ? "true" : undefined
                }
              >
                {cat.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {categoriaInvalida ? (
        <EstadoVacio
          titulo="Categoría no encontrada"
          mensaje="Prueba otra categoría o revisa el catálogo completo."
          enlace={{ href: "/productos", etiqueta: "Ver todas las categorías" }}
        />
      ) : null}

      {!categoriaInvalida && productos.length === 0 ? (
        <EstadoVacio
          titulo="Sin productos"
          mensaje="Aún no hay productos publicados en esta categoría."
          enlace={{ href: "/cultivos", etiqueta: "Explorar cultivos" }}
        />
      ) : null}

      {!categoriaInvalida && productos.length > 0 ? (
        <>
          <ul className={`mt-8 ${listado.gridListado}`}>
            {productos.map((producto) => {
              const categoria =
                typeof producto.categoria === "object" && producto.categoria
                  ? producto.categoria.nombre
                  : null;
              return (
                <li key={producto.id} className={listado.revelarItem}>
                  <TarjetaProducto
                    slug={producto.slug}
                    nombre={producto.nombre}
                    resumen={producto.resumen}
                    categoria={categoria}
                  />
                </li>
              );
            })}
          </ul>

          {totalPaginas > 1 ? (
            <nav
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
              aria-label="Paginación"
            >
              {pagina > 1 ? (
                <Link
                  href={urlProductos(query.categoria, pagina - 1)}
                  className="inline-flex min-h-11 items-center rounded-m border border-marca/20 px-4 text-sm text-marca"
                >
                  Anterior
                </Link>
              ) : null}
              <span className="px-2 text-sm text-texto/80">
                Página {pagina} de {totalPaginas}
              </span>
              {pagina < totalPaginas ? (
                <Link
                  href={urlProductos(query.categoria, pagina + 1)}
                  className="inline-flex min-h-11 items-center rounded-m border border-marca/20 px-4 text-sm text-marca"
                >
                  Siguiente
                </Link>
              ) : null}
            </nav>
          ) : null}
        </>
      ) : null}
      </div>
    </main>
  );
}

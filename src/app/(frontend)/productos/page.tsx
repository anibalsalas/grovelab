import type { Metadata } from "next";
import Link from "next/link";

import { TransicionPagina } from "@/components/animacion/transicion-pagina";
import { AnuncioResultados } from "@/components/ui/anuncio-resultados";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import { TarjetaProducto } from "@/components/ui/tarjeta-producto";
import { PanelFiltrosProductos } from "@/components/panel-filtros-productos";
import { buscarProductos } from "@/lib/buscar-productos.ts";
import {
  parseBuscarQuery,
  tieneFiltrosBuscar,
  type BuscarQuery,
} from "@/lib/buscar-query.ts";
import { hayCultivosPublicados } from "@/lib/hay-cultivos-publicados.ts";
import { enlaceWhatsAppConsulta } from "@/lib/url-contacto.ts";
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

function urlProductos(query: BuscarQuery, pagina?: number): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.cultivo) params.set("cultivo", query.cultivo);
  if (query.plaga) params.set("plaga", query.plaga);
  if (query.categoria) params.set("categoria", query.categoria);
  if (pagina && pagina > 1) params.set("pagina", String(pagina));
  const qs = params.toString();
  return qs ? `/productos?${qs}` : "/productos";
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = parseBuscarQuery(params);
  const payload = await getPayloadClient();

  const [cultivos, plagas, categorias, hayCultivos] = await Promise.all([
    payload.find({ collection: "cultivos", limit: 200, sort: "nombre", depth: 0 }),
    payload.find({ collection: "plagas", limit: 200, sort: "nombre", depth: 0 }),
    payload.find({
      collection: "categorias",
      limit: 200,
      sort: "orden",
      depth: 0,
    }),
    hayCultivosPublicados(),
  ]);

  const resultado = await buscarProductos(payload, query);
  const conFiltros = tieneFiltrosBuscar(query);
  const whatsappSinResultados = enlaceWhatsAppConsulta(
    "Hola, busqué productos en la web y no encontré resultados. ¿Me ayudan?",
  );

  return (
    <TransicionPagina>
      <main id={idContenidoPrincipal} className={scrollMargenContenido}>
        <CintaSeccion tono="verde">
          <EncabezadoPagina
            destacado="Catálogo"
            titulo="Productos"
            descripcion="Catálogo de formulaciones Grovelab."
          />
        </CintaSeccion>

        <div className={contenedorPagina}>
          <PanelFiltrosProductos
            cultivos={cultivos.docs.map((c) => ({ slug: c.slug, nombre: c.nombre }))}
            plagas={plagas.docs.map((p) => ({ slug: p.slug, nombre: p.nombre }))}
            categorias={categorias.docs.map((c) => ({
              slug: c.slug,
              nombre: c.nombre,
            }))}
            valoresIniciales={{
              q: query.q,
              cultivo: query.cultivo,
              plaga: query.plaga,
              categoria: query.categoria,
            }}
          />

          <AnuncioResultados total={resultado.totalDocs} />

          {resultado.docs.length === 0 && conFiltros ? (
            <EstadoVacio
              titulo="No encontramos productos con estos filtros"
              mensaje="Prueba otra combinación o revisa el catálogo completo."
              enlace={{ href: "/productos", etiqueta: "Ver todos los productos" }}
              enlaceSecundario={
                whatsappSinResultados
                  ? {
                      href: whatsappSinResultados,
                      etiqueta: "Preguntar por WhatsApp",
                      externo: true,
                    }
                  : { href: "/contacto", etiqueta: "Contactar" }
              }
            />
          ) : null}

          {resultado.docs.length === 0 && !conFiltros ? (
            <EstadoVacio
              titulo="Aún no hay productos publicados"
              mensaje={
                hayCultivos
                  ? "Vuelve más adelante o explora los cultivos disponibles."
                  : "Vuelve más adelante o escríbenos y te orientamos."
              }
              enlace={
                hayCultivos
                  ? { href: "/cultivos", etiqueta: "Explorar cultivos" }
                  : { href: "/contacto", etiqueta: "Contactar" }
              }
            />
          ) : null}

          {resultado.docs.length > 0 ? (
            <>
              <ul className={`mt-6 ${listado.gridListado}`}>
                {resultado.docs.map((producto) => (
                  <li key={producto.id} className={listado.revelarItem}>
                    <TarjetaProducto
                      slug={producto.slug}
                      nombre={producto.nombre}
                      resumen={producto.resumen}
                      categoria={producto.categoria}
                      imagen={producto.imagen}
                    />
                  </li>
                ))}
              </ul>

              {resultado.totalPages > 1 ? (
                <nav
                  className="mt-10 flex flex-wrap items-center justify-center gap-2"
                  aria-label="Paginación"
                >
                  {resultado.pagina > 1 ? (
                    <Link
                      href={urlProductos(query, resultado.pagina - 1)}
                      className="inline-flex min-h-11 items-center rounded-m border border-marca/20 px-4 text-sm text-marca"
                    >
                      Anterior
                    </Link>
                  ) : null}
                  <span className="px-2 text-sm text-texto/80">
                    Página {resultado.pagina} de {resultado.totalPages}
                  </span>
                  {resultado.pagina < resultado.totalPages ? (
                    <Link
                      href={urlProductos(query, resultado.pagina + 1)}
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
    </TransicionPagina>
  );
}

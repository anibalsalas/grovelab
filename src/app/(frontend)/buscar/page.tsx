import type { Metadata } from "next";
import Link from "next/link";

import { FormularioBuscador } from "@/components/formulario-buscador";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import { TarjetaProducto } from "@/components/ui/tarjeta-producto";
import { buscarProductos } from "@/lib/buscar-productos.ts";
import {
  parseBuscarQuery,
  tieneFiltrosBuscar,
} from "@/lib/buscar-query.ts";
import { enlaceWhatsAppConsulta } from "@/lib/url-contacto.ts";
import { CintaSeccion } from "@/components/layout/cinta-seccion";
import {
  clasePanelFormulario,
  contenedorPagina,
  idContenidoPrincipal,
  scrollMargenContenido,
} from "@/lib/clases-sitio";
import { getPayloadClient } from "@/lib/payload-client";
import listado from "@/styles/listado.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar productos",
  description: "Buscador por cultivo, plaga o categoría.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BuscarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = parseBuscarQuery(params);
  const payload = await getPayloadClient();

  const [cultivos, plagas, categorias] = await Promise.all([
    payload.find({ collection: "cultivos", limit: 200, sort: "nombre", depth: 0 }),
    payload.find({ collection: "plagas", limit: 200, sort: "nombre", depth: 0 }),
    payload.find({
      collection: "categorias",
      limit: 200,
      sort: "orden",
      depth: 0,
    }),
  ]);

  const opcionesCultivos = cultivos.docs.map((c) => ({
    slug: c.slug,
    nombre: c.nombre,
  }));
  const opcionesPlagas = plagas.docs.map((p) => ({
    slug: p.slug,
    nombre: p.nombre,
  }));
  const opcionesCategorias = categorias.docs.map((c) => ({
    slug: c.slug,
    nombre: c.nombre,
  }));

  const conFiltros = tieneFiltrosBuscar(query);
  const resultados = conFiltros
    ? await buscarProductos(payload, query)
    : { docs: [] };
  const whatsappSinResultados = enlaceWhatsAppConsulta(
    "Hola, busqué productos en la web y no encontré resultados. ¿Me ayudan?",
  );

  return (
    <main id={idContenidoPrincipal} className={scrollMargenContenido}>
      <CintaSeccion tono="verde">
        <EncabezadoPagina
          destacado="Catálogo"
          titulo="Buscar productos"
          descripcion="Filtra por cultivo, plaga, categoría o palabra clave."
        />
      </CintaSeccion>

      <CintaSeccion tono="crema">
        <div className={`${clasePanelFormulario} w-full max-w-3xl mx-auto`}>
          <FormularioBuscador
            titulo="Filtros de búsqueda"
            mostrarIntro={false}
            valoresIniciales={query}
            cultivos={opcionesCultivos}
            plagas={opcionesPlagas}
            categorias={opcionesCategorias}
          />
        </div>
      </CintaSeccion>

      <div className={contenedorPagina}>
      <section className="mt-10" aria-labelledby="resultados-titulo">
        <h2 id="resultados-titulo" className="font-titular text-xl text-marca">
          Resultados
          {conFiltros && resultados.docs.length > 0
            ? ` (${resultados.docs.length})`
            : ""}
        </h2>

        {!conFiltros ? (
          <EstadoVacio
            titulo="Empieza tu búsqueda"
            mensaje="Elige al menos un filtro y pulsa Buscar."
            enlace={{ href: "/cultivos", etiqueta: "Explorar cultivos" }}
          />
        ) : null}

        {conFiltros && resultados.docs.length === 0 ? (
          <EstadoVacio
            titulo="Sin resultados"
            mensaje="No encontramos productos con esos filtros. Prueba otra combinación."
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

        {resultados.docs.length > 0 ? (
          <ul className={`mt-6 ${listado.gridListado}`}>
            {resultados.docs.map((producto) => (
              <li key={producto.id}>
                <TarjetaProducto
                  slug={producto.slug}
                  nombre={producto.nombre}
                  resumen={producto.resumen}
                />
              </li>
            ))}
          </ul>
        ) : null}

        {conFiltros ? (
          <p className="mt-6 text-sm">
            <Link
              href="/productos"
              className="text-marca underline-offset-4 hover:underline"
            >
              Ver todo el catálogo
            </Link>
          </p>
        ) : null}
      </section>
      </div>
    </main>
  );
}

import type { Metadata } from "next";

import { TransicionPagina } from "@/components/animacion/transicion-pagina";
import { CatalogoProductos } from "@/components/catalogo/catalogo-productos";
import { CintaSeccion } from "@/components/layout/cinta-seccion";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import { cargarCatalogoProductos } from "@/lib/cargar-catalogo-productos.ts";
import {
  anchoContenedor,
  idContenidoPrincipal,
  scrollMargenContenido,
} from "@/lib/clases-sitio";
import { hayCultivosPublicados } from "@/lib/hay-cultivos-publicados.ts";
import { getPayloadClient } from "@/lib/payload-client";
import { enlaceWhatsAppConsulta } from "@/lib/url-contacto.ts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Productos",
  description: "Catálogo de productos para el agro.",
};

/**
 * Catálogo de productos. El servidor entrega todos los productos publicados una sola vez;
 * la búsqueda y los filtros (que llegan por la URL: `q`, `categoria`, `cultivo`, `plaga`,
 * `pagina`, también desde el buscador de Inicio) se resuelven en <CatalogoProductos>.
 * La primera respuesta HTML ya viene filtrada según la URL.
 */
export default async function ProductosPage() {
  const payload = await getPayloadClient();
  const productos = await cargarCatalogoProductos(payload);
  // Solo hace falta si no hay productos (ofrece «Explorar cultivos»): una consulta menos por visita.
  const hayCultivos = productos.length === 0 && (await hayCultivosPublicados());

  const enlaceConsulta = enlaceWhatsAppConsulta(
    "Hola, busqué productos en la web y no encontré resultados. ¿Me ayudan?",
  );

  return (
    <TransicionPagina>
      <main id={idContenidoPrincipal} className={scrollMargenContenido}>
        {/* Encabezado compacto: deja el catálogo a la vista sin desplazarse. */}
        <CintaSeccion tono="verde" contenedor={false}>
          <div
            className={`${anchoContenedor} flex flex-col gap-1 py-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:py-5`}
          >
            <EncabezadoPagina destacado="Catálogo" titulo="Productos" />
            <p className="font-texto leading-relaxed text-texto/85 sm:pb-1">
              Catálogo de formulaciones Grovelab.
            </p>
          </div>
        </CintaSeccion>

        <div className={`${anchoContenedor} py-6 sm:py-8`}>
          {productos.length > 0 ? (
            <CatalogoProductos productos={productos} enlaceConsulta={enlaceConsulta} />
          ) : (
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
          )}
        </div>
      </main>
    </TransicionPagina>
  );
}

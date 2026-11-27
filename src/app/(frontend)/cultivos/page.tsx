import type { Metadata } from "next";

import { TransicionPagina } from "@/components/animacion/transicion-pagina";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import { TarjetaCultivo } from "@/components/ui/tarjeta-cultivo";
import { CintaSeccion } from "@/components/layout/cinta-seccion";
import {
  contenedorPagina,
  idContenidoPrincipal,
  scrollMargenContenido,
} from "@/lib/clases-sitio";
import { medioPopulado } from "@/lib/medio-populado.ts";
import { getPayloadClient } from "@/lib/payload-client";
import listado from "@/styles/listado.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cultivos",
  description: "Productos recomendados por cultivo.",
};

export default async function CultivosPage() {
  const payload = await getPayloadClient();
  const resultado = await payload.find({
    overrideAccess: false,
    collection: "cultivos",
    limit: 100,
    sort: "nombre",
    depth: 1,
  });

  const cultivos = resultado.docs;

  return (
    <TransicionPagina>
      <main id={idContenidoPrincipal} className={scrollMargenContenido}>
        <CintaSeccion tono="verde">
          <EncabezadoPagina
            destacado="Catálogo"
            titulo="Cultivos"
            descripcion="Encuentra productos formulados para cada cultivo."
          />
        </CintaSeccion>

        <div className={contenedorPagina}>
        {cultivos.length === 0 ? (
          <EstadoVacio
            titulo="Sin cultivos publicados"
            mensaje="Aún no hay cultivos en el catálogo."
            enlace={{ href: "/contacto", etiqueta: "Contactar" }}
          />
        ) : (
          <ul className={`mt-8 ${listado.gridListado}`}>
            {cultivos.map((cultivo) => {
              const medio = medioPopulado(cultivo.imagen);
              return (
                <li key={cultivo.id}>
                  <TarjetaCultivo
                    slug={cultivo.slug}
                    nombre={cultivo.nombre}
                    resumen={cultivo.resumen}
                    efecto3d
                    imagen={
                      medio
                        ? {
                            url: medio.url ?? "",
                            alt: medio.alt,
                            width: medio.width,
                            height: medio.height,
                          }
                        : null
                    }
                  />
                </li>
              );
            })}
          </ul>
        )}
        </div>
      </main>
    </TransicionPagina>
  );
}

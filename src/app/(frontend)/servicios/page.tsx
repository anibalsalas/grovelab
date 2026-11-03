import type { Metadata } from "next";

import { CintaSeccion } from "@/components/layout/cinta-seccion";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import {
  contenedorPagina,
  idContenidoPrincipal,
  scrollMargenContenido,
} from "@/lib/clases-sitio";
import {
  obtenerTextosSitio,
  serviciosLeadPublico,
  serviciosPublicados,
} from "@/lib/obtener-textos-sitio.ts";
import institucional from "@/styles/institucional.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const textos = await obtenerTextosSitio();
  return {
    title: "Servicios",
    description: serviciosLeadPublico(textos),
  };
}

export default async function ServiciosPage() {
  const textos = await obtenerTextosSitio();
  const servicios = serviciosPublicados(textos);
  const lead = serviciosLeadPublico(textos);

  return (
    <main id={idContenidoPrincipal} className={scrollMargenContenido}>
      <CintaSeccion tono="verde">
        <EncabezadoPagina titulo="Servicios" descripcion={lead} />
      </CintaSeccion>

      <div className={contenedorPagina}>
        {servicios.length === 0 ? (
          <EstadoVacio
            titulo="Servicios en preparación"
            mensaje="Estamos ordenando la información sobre importación, asesoría y logística. Escríbenos y te contamos qué podemos hacer por tu cultivo o empresa."
            enlace={{ href: "/contacto", etiqueta: "Solicitar información" }}
          />
        ) : (
          <>
            <ul className="grid gap-6 sm:grid-cols-2">
              {servicios.map((servicio) => (
                <li key={servicio.titulo}>
                  <article className={institucional.tarjetaServicio}>
                    <h2 className="font-titular text-lg text-marca">
                      {servicio.titulo}
                    </h2>
                    {servicio.descripcion ? (
                      <p className="mt-3 text-sm leading-relaxed">
                        {servicio.descripcion}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm text-aviso">POR CONFIRMAR</p>
                    )}
                  </article>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-prose text-sm leading-relaxed text-texto/75">
              Los trámites y requisitos pueden cambiar. Consulta con un asesor
              de Grovelab antes de tomar una decisión.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

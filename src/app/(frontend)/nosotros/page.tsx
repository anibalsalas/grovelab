import type { Metadata } from "next";

import { TransicionPagina } from "@/components/animacion/transicion-pagina";
import { RevelarAlScroll } from "@/components/animacion/revelar-al-scroll";
import { CintaSeccion } from "@/components/layout/cinta-seccion";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import {
  contenedorPagina,
  idContenidoPrincipal,
  scrollMargenContenido,
} from "@/lib/clases-sitio";
import { obtenerTextosSitio } from "@/lib/obtener-textos-sitio.ts";
import institucional from "@/styles/institucional.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const textos = await obtenerTextosSitio();
  const lead =
    textos.nosotros?.descripcionLead?.trim() ||
    "Conoce a Grovelab en el agro peruano.";
  return {
    title: "Nosotros",
    description: lead,
  };
}

export default async function NosotrosPage() {
  const textos = await obtenerTextosSitio();
  const lead =
    textos.nosotros?.descripcionLead?.trim() ||
    "Historia y respaldo de Grovelab en el agro peruano.";
  const bloques =
    textos.nosotros?.bloques?.filter(
      (bloque) => bloque.titulo?.trim() && bloque.cuerpo?.trim(),
    ) ?? [];

  return (
    <TransicionPagina>
      <main id={idContenidoPrincipal} className={scrollMargenContenido}>
        <CintaSeccion tono="crema">
          <EncabezadoPagina titulo="Nosotros" descripcion={lead} />
        </CintaSeccion>

        <div className={contenedorPagina}>
          {bloques.length === 0 ? (
            <EstadoVacio
              titulo="Estamos actualizando esta página"
              mensaje="Pronto publicaremos más sobre Grovelab y nuestro trabajo en el agro peruano. Mientras tanto, con gusto te orientamos por contacto."
              enlace={{ href: "/contacto", etiqueta: "Contactar" }}
            />
          ) : (
            <ul className="grid gap-6">
              {bloques.map((bloque) => (
                <li key={bloque.id ?? bloque.titulo}>
                  <RevelarAlScroll>
                    <article className={institucional.bloqueNosotros}>
                      <h2 className="font-titular text-xl text-marca">
                        {bloque.titulo}
                      </h2>
                      <p className="mt-3 whitespace-pre-wrap leading-relaxed">
                        {bloque.cuerpo}
                      </p>
                    </article>
                  </RevelarAlScroll>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </TransicionPagina>
  );
}

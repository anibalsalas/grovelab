import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TransicionPagina } from "@/components/animacion/transicion-pagina";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { clasesMain, idContenidoPrincipal } from "@/lib/clases-sitio";
import {
  obtenerTextosSitio,
  politicaPrivacidadPublica,
} from "@/lib/obtener-textos-sitio.ts";
import institucional from "@/styles/institucional.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de Grovelab.",
};

export default async function PrivacidadPage() {
  const textos = await obtenerTextosSitio();
  const politica = politicaPrivacidadPublica(textos);

  if (!politica) {
    notFound();
  }

  return (
    <TransicionPagina>
      <main id={idContenidoPrincipal} className={clasesMain}>
        <EncabezadoPagina
          titulo="Política de privacidad"
          descripcion="Cómo tratamos los datos que nos compartes."
        />
        <div className={`mt-8 ${institucional.cuerpoNoticia}`}>{politica}</div>
      </main>
    </TransicionPagina>
  );
}

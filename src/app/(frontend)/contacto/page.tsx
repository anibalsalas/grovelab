import type { Metadata } from "next";
import { z } from "zod";

import { TransicionPagina } from "@/components/animacion/transicion-pagina";
import { FormularioContacto } from "@/components/formulario-contacto";
import { TarjetasDatosContacto } from "@/components/tarjetas-datos-contacto";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { CintaSeccion } from "@/components/layout/cinta-seccion";
import {
  contenedorPagina,
  idContenidoPrincipal,
  scrollMargenContenido,
} from "@/lib/clases-sitio";
import sitio from "@/styles/sitio.module.css";
import {
  obtenerTextosSitio,
  politicaPrivacidadPublica,
} from "@/lib/obtener-textos-sitio.ts";
import estilos from "@/components/formulario-buscador.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta a Grovelab.",
};

type PageProps = {
  searchParams: Promise<{ producto?: string }>;
};

function parseProductoConsulta(valor: string | undefined): string | null {
  if (!valor) {
    return null;
  }
  const parsed = z.string().max(200).safeParse(valor.trim());
  return parsed.success ? parsed.data : null;
}

export default async function ContactoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const producto = parseProductoConsulta(params.producto);
  const textos = await obtenerTextosSitio();
  const formularioActivo = Boolean(politicaPrivacidadPublica(textos));

  return (
    <TransicionPagina>
      <main id={idContenidoPrincipal} className={scrollMargenContenido}>
        <CintaSeccion tono="verde">
          <EncabezadoPagina
            titulo="Contacto"
            descripcion="Estamos para orientarte sobre cultivos y productos."
          />
        </CintaSeccion>

        <div className={`${contenedorPagina} space-y-8`}>
          <TarjetasDatosContacto contacto={textos.contacto} />

          {producto ? (
            <p className="text-sm">
              Consulta sobre: <strong>{producto}</strong>
            </p>
          ) : null}

          {formularioActivo ? (
            <div className={estilos.contenedor}>
              <h2 className="font-titular text-xl text-marca">Envíanos tu consulta</h2>
              <div className="mt-4">
                <FormularioContacto productoConsulta={producto} />
              </div>
            </div>
          ) : (
            <p className={`text-sm text-texto/80 ${sitio.tarjetaPlana}`}>
              El formulario de contacto se activará cuando exista la política de
              privacidad aprobada en el panel.
            </p>
          )}
        </div>
      </main>
    </TransicionPagina>
  );
}

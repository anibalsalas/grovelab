import Link from "next/link";

import { anchoContenedor } from "@/lib/clases-sitio";
import { obtenerTextosSitio, politicaPrivacidadPublica } from "@/lib/obtener-textos-sitio.ts";
import { enlaceWhatsAppGenerico } from "@/lib/url-contacto.ts";

function resumenContactoPie(contacto: {
  telefono?: string | null;
  correo?: string | null;
}): string {
  const telefono = contacto.telefono?.trim();
  const correo = contacto.correo?.trim();
  if (telefono && correo) {
    return `${telefono} · ${correo}`;
  }
  if (telefono) {
    return telefono;
  }
  if (correo) {
    return correo;
  }
  return "POR CONFIRMAR con Grovelab.";
}

export async function SiteFooter() {
  const anio = new Date().getFullYear();
  const enlaceWhatsapp = enlaceWhatsAppGenerico();
  const textos = await obtenerTextosSitio();
  const contactoResumen = resumenContactoPie(textos.contacto ?? {});
  const hayPolitica = Boolean(politicaPrivacidadPublica(textos));

  return (
    <footer className="mt-auto border-t border-marca/15 bg-fondo">
      <div className={`${anchoContenedor} py-8 text-sm text-texto`}>
        <p className="font-titular text-marca">Grovelab</p>
        <p className="mt-2 max-w-prose leading-relaxed">
          Productos para el agro. Datos de contacto:{" "}
          <span
            className={
              contactoResumen.startsWith("POR CONFIRMAR") ? "text-aviso" : ""
            }
          >
            {contactoResumen}
          </span>
        </p>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          <Link
            href="/contacto"
            className="text-marca underline-offset-4 hover:underline focus-visible:rounded-sm"
          >
            Contacto
          </Link>
          {hayPolitica ? (
            <Link
              href="/privacidad"
              className="text-marca underline-offset-4 hover:underline focus-visible:rounded-sm"
            >
              Privacidad
            </Link>
          ) : null}
          {enlaceWhatsapp ? (
            <a
              href={enlaceWhatsapp}
              className="text-marca underline-offset-4 hover:underline focus-visible:rounded-sm"
              rel="noopener noreferrer"
              target="_blank"
            >
              WhatsApp
            </a>
          ) : null}
        </p>
        <p className="mt-6 text-texto/80">© {anio} Grovelab</p>
      </div>
    </footer>
  );
}

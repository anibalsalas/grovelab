import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TransicionPagina } from "@/components/animacion/transicion-pagina";
import { CintaSeccion } from "@/components/layout/cinta-seccion";
import { BotonEnlace } from "@/components/ui/boton-enlace";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import {
  contenedorPagina,
  idContenidoPrincipal,
  scrollMargenContenido,
} from "@/lib/clases-sitio";
import { hayZonasPublicadas } from "@/lib/hay-zonas-publicadas.ts";
import { getPayloadClient } from "@/lib/payload-client";
import { normalizarWhatsapp } from "@/lib/pedido/normalizar-whatsapp.ts";
import sitio from "@/styles/sitio.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Zonas comerciales",
  description:
    "Encuentra al asesor de tu zona y escríbele por WhatsApp para consultar por tu cultivo o tu pedido.",
};

const MENSAJE_WHATSAPP = "Hola, escribo desde la web de Grovelab";

export default async function ZonasComercialesPage() {
  // Sin zonas publicadas no hay página: igual que /cultivos sin cultivos.
  if (!(await hayZonasPublicadas())) {
    notFound();
  }

  const payload = await getPayloadClient();
  // `overrideAccess: false` aplica el acceso público: solo publicadas y, por el
  // acceso a nivel de campo, el WhatsApp solo llega si la zona lo autorizó.
  const { docs: zonas } = await payload.find({
    collection: "zonas-comerciales",
    sort: "orden",
    depth: 0,
    limit: 50,
    pagination: false,
    overrideAccess: false,
  });

  return (
    <TransicionPagina>
      <main id={idContenidoPrincipal} className={scrollMargenContenido}>
        <CintaSeccion tono="verde">
          <EncabezadoPagina
            destacado="Contacto"
            titulo="Zonas comerciales"
            descripcion="Escríbele al asesor de tu zona. Te orienta con el producto y la presentación para tu cultivo."
          />
        </CintaSeccion>

        <div className={contenedorPagina}>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {zonas.map((zona) => {
              // El servidor ya omite el número si no está autorizado; se comprueba otra vez
              // por si la regla de acceso cambia: sin autorización nunca se arma el enlace.
              const digitos =
                zona.numeroAutorizado === true
                  ? normalizarWhatsapp(zona.whatsapp)
                  : null;
              const cobertura = (zona.cobertura ?? [])
                .map((c) => c.lugar?.trim())
                .filter((lugar): lugar is string => Boolean(lugar));
              const asesor = zona.asesorNombre?.trim() || "Asesor comercial";

              return (
                <li key={zona.id}>
                  <article className={`flex h-full flex-col p-6 ${sitio.tarjetaPlana}`}>
                    <h2 className="font-titular text-xl text-marca">{zona.nombre}</h2>

                    {cobertura.length > 0 ? (
                      <p className="mt-2 text-sm leading-relaxed text-texto/85">
                        {cobertura.join(" · ")}
                      </p>
                    ) : null}

                    <p className="mt-4 text-sm">
                      <span className="font-semibold">{asesor}</span>
                      {zona.asesorCargo?.trim() ? (
                        <span className="text-texto/80"> · {zona.asesorCargo.trim()}</span>
                      ) : null}
                    </p>

                    <div className="mt-auto pt-6">
                      {digitos ? (
                        <a
                          href={`https://wa.me/${digitos}?text=${encodeURIComponent(MENSAJE_WHATSAPP)}`}
                          className="inline-flex min-h-11 items-center rounded-m bg-marca px-5 py-2 text-fondo shadow-s hover:bg-marca/90 focus-visible:rounded-m"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Escribir por WhatsApp al asesor de ${zona.nombre}`}
                        >
                          Escribir por WhatsApp
                        </a>
                      ) : (
                        <BotonEnlace href="/contacto" variante="secundario">
                          Contactar a Grovelab
                        </BotonEnlace>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </TransicionPagina>
  );
}

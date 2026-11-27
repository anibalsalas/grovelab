import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NombreCompartido } from "@/components/animacion/nombre-compartido";
import { TransicionPagina } from "@/components/animacion/transicion-pagina";
import { AgregarAlPedido } from "@/components/pedido/agregar-al-pedido";
import { BotonEnlace } from "@/components/ui/boton-enlace";
import { Migas } from "@/components/ui/migas";
import {
  TablaComposicion,
  type FilaComposicion,
} from "@/components/ui/tabla-composicion";
import { TablaDosis, type FilaDosis } from "@/components/ui/tabla-dosis";
import { TarjetaProducto } from "@/components/ui/tarjeta-producto";
import { clasesMain, idContenidoPrincipal } from "@/lib/clases-sitio";
import { medioPopulado, primeraImagen } from "@/lib/medio-populado.ts";
import { nombreTransicionProducto } from "@/lib/nombres-transicion.ts";
import { PRESENTACION_A_CONSULTAR } from "@/lib/pedido/esquema.ts";
import { hayDestinoPedido } from "@/lib/pedido/hay-destino-pedido.ts";
import { getPayloadClient } from "@/lib/payload-client";
import { enlaceWhatsAppInformacion } from "@/lib/url-contacto.ts";
import ficha from "@/styles/ficha-producto.module.css";
import listado from "@/styles/listado.module.css";

function formatearPeso(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type RelacionNombre = {
  nombre?: string | null;
  slug?: string | null;
};

function nombreRelacion(
  valor: number | RelacionNombre | null | undefined,
): string | null {
  if (!valor || typeof valor === "number") {
    return null;
  }
  return valor.nombre ?? null;
}

function slugRelacion(
  valor: number | RelacionNombre | null | undefined,
): string | null {
  if (!valor || typeof valor === "number") {
    return null;
  }
  return valor.slug ?? null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const resultado = await payload.find({
    overrideAccess: false,
    collection: "productos",
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 0,
  });
  const producto = resultado.docs[0];
  if (!producto) {
    return { title: "Producto no encontrado" };
  }
  return {
    title: producto.nombre,
    description: producto.resumen ?? undefined,
  };
}

export default async function ProductoPage({ params }: PageProps) {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const resultado = await payload.find({
    overrideAccess: false,
    collection: "productos",
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 2,
  });
  const producto = resultado.docs[0];
  if (!producto) {
    notFound();
  }

  const categoria =
    typeof producto.categoria === "object" && producto.categoria
      ? producto.categoria
      : null;

  const filasDosis: FilaDosis[] = (producto.dosis ?? []).map((fila) => ({
    id: fila.id,
    cultivo: nombreRelacion(fila.cultivo) ?? "—",
    plaga: nombreRelacion(fila.plaga) ?? "—",
    dosis: fila.dosis,
    nota: fila.nota ?? "—",
  }));

  const presentaciones = (producto.presentaciones ?? [])
    .map((p) => ({ id: p.id, etiqueta: p.etiqueta?.trim() ?? "" }))
    .filter((p) => p.etiqueta !== "");

  const filasComposicion: FilaComposicion[] = (producto.composicion ?? [])
    .filter((fila) => fila.elemento && fila.valor)
    .map((fila) => ({
      id: fila.id,
      elemento: fila.elemento as string,
      valor: fila.valor as string,
    }));

  const idsCultivo = (producto.cultivos ?? [])
    .map((c) => {
      if (typeof c === "number") {
        return c;
      }
      if (c && typeof c === "object" && "id" in c) {
        return c.id as number;
      }
      return null;
    })
    .filter((id): id is number => id !== null);

  const primerCultivoId = idsCultivo[0] ?? null;

  const relacionados = primerCultivoId
    ? await payload.find({
        overrideAccess: false,
        collection: "productos",
        limit: 4,
        where: {
          and: [
            { cultivos: { in: [primerCultivoId] } },
            { id: { not_equals: producto.id } },
          ],
        },
        depth: 1,
      })
    : { docs: [] };

  const galeria = (producto.galeria ?? [])
    .map((item) => medioPopulado(item))
    .filter((medio): medio is NonNullable<typeof medio> => medio !== null);

  const fichaTecnica = medioPopulado(producto.fichaTecnica);
  const hojaSeguridad = medioPopulado(producto.hojaSeguridad);

  const whatsapp = enlaceWhatsAppInformacion(producto.nombre);

  // El bloque de pedido reemplaza a las etiquetas de presentaciones (no hay dos listas iguales).
  // Sin presentaciones cargadas se ofrece «A consultar con el asesor», nunca una inventada.
  const puedePedir =
    producto.admitePedido !== false && (await hayDestinoPedido());
  const opcionesPedido =
    presentaciones.length > 0
      ? presentaciones.map((p) => p.etiqueta)
      : [PRESENTACION_A_CONSULTAR];

  const migas = [
    { etiqueta: "Productos", href: "/productos" },
    ...(categoria
      ? [
          {
            etiqueta: categoria.nombre,
            href: `/productos?categoria=${encodeURIComponent(categoria.slug)}`,
          },
        ]
      : []),
    { etiqueta: producto.nombre },
  ];

  return (
    <TransicionPagina>
      <main id={idContenidoPrincipal} className={clasesMain}>
        <Migas items={migas} />

        <header className="mt-6 max-w-prose">
          {categoria ? (
            <p className="text-sm font-medium text-acento uppercase">
              {categoria.nombre}
            </p>
          ) : null}
          <NombreCompartido nombre={nombreTransicionProducto(producto.slug)}>
            <h1 className="mt-1 w-fit font-titular text-h1 font-bold leading-[var(--token-interlineado-h1)] tracking-tight text-marca">
              {producto.nombre}
            </h1>
          </NombreCompartido>
          {producto.resumen ? (
            <p className="mt-3 leading-relaxed text-texto/90">
              {producto.resumen}
            </p>
          ) : null}
        </header>

        {galeria.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {galeria.map((medio, indice) => (
              <li
                key={medio.id}
                className={
                  indice === 0
                    ? "relative col-span-2 aspect-[4/3] overflow-hidden rounded-m bg-superficie sm:col-span-3"
                    : "relative aspect-square overflow-hidden rounded-m bg-superficie"
                }
              >
                <Image
                  src={medio.url ?? ""}
                  alt={medio.alt?.trim() || producto.nombre}
                  fill
                  sizes={
                    indice === 0
                      ? "(min-width: 40rem) 36rem, 100vw"
                      : "(min-width: 40rem) 12rem, 33vw"
                  }
                  className="object-contain p-3 mix-blend-multiply"
                />
              </li>
            ))}
          </ul>
        ) : null}

        {puedePedir ? (
          <div className="mt-6">
            <AgregarAlPedido
              slug={producto.slug}
              nombre={producto.nombre}
              presentaciones={opcionesPedido}
            />
          </div>
        ) : presentaciones.length > 0 ? (
          <section className="mt-6" aria-labelledby="presentaciones-titulo">
            <h2
              id="presentaciones-titulo"
              className="text-sm font-semibold text-marca"
            >
              Presentaciones
            </h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {presentaciones.map((presentacion) => (
                <li key={presentacion.id ?? presentacion.etiqueta}>
                  <span className={ficha.chip}>{presentacion.etiqueta}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {(producto.cultivos ?? []).length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {(producto.cultivos ?? []).map((cultivo) => {
              if (typeof cultivo === "number") {
                return null;
              }
              const cultivoSlug = slugRelacion(cultivo);
              const etiqueta = nombreRelacion(cultivo);
              if (!etiqueta) {
                return null;
              }
              return (
                <li key={cultivoSlug ?? etiqueta}>
                  {cultivoSlug ? (
                    <Link
                      href={`/cultivos/${cultivoSlug}`}
                      className={ficha.chip}
                      aria-label={`Cultivo: ${etiqueta}`}
                    >
                      {etiqueta}
                    </Link>
                  ) : (
                    <span className={ficha.chip}>{etiqueta}</span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}

        {(producto.plagas ?? []).length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {(producto.plagas ?? []).map((plaga) => {
              if (typeof plaga === "number") {
                return null;
              }
              const plagaSlug = slugRelacion(plaga);
              const etiqueta = nombreRelacion(plaga);
              if (!etiqueta) {
                return null;
              }
              return (
                <li key={plagaSlug ?? etiqueta}>
                  {plagaSlug ? (
                    <Link
                      href={`/productos?plaga=${encodeURIComponent(plagaSlug)}`}
                      className={ficha.chip}
                      aria-label={`Plaga: ${etiqueta}`}
                    >
                      {etiqueta}
                    </Link>
                  ) : (
                    <span className={ficha.chip}>{etiqueta}</span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}

        {(producto.ingredienteActivo ||
          producto.formulacion ||
          producto.registroSenasa) && (
          <dl className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
            {producto.ingredienteActivo ? (
              <>
                <dt className="font-semibold text-marca">Ingrediente activo</dt>
                <dd>{producto.ingredienteActivo}</dd>
              </>
            ) : null}
            {producto.formulacion ? (
              <>
                <dt className="font-semibold text-marca">Formulación</dt>
                <dd>{producto.formulacion}</dd>
              </>
            ) : null}
            {producto.registroSenasa ? (
              <>
                <dt className="font-semibold text-marca">Registro SENASA</dt>
                <dd>{producto.registroSenasa}</dd>
              </>
            ) : null}
          </dl>
        )}

        {filasComposicion.length > 0 ? (
          <div className="mt-10">
            <TablaComposicion filas={filasComposicion} />
          </div>
        ) : null}

        {filasDosis.length > 0 ? (
          <div className="mt-10">
            <TablaDosis filas={filasDosis} />
          </div>
        ) : null}

        {fichaTecnica || hojaSeguridad ? (
          <ul className="mt-8 flex flex-wrap gap-3 text-sm">
            {fichaTecnica?.url ? (
              <li>
                <a
                  href={fichaTecnica.url}
                  className="inline-flex min-h-11 items-center gap-2 rounded-m border border-marca/25 px-4 text-marca hover:bg-marca/5 focus-visible:rounded-m"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ficha técnica (PDF
                  {fichaTecnica.filesize
                    ? `, ${formatearPeso(fichaTecnica.filesize)}`
                    : ""}
                  )
                </a>
              </li>
            ) : null}
            {hojaSeguridad?.url ? (
              <li>
                <a
                  href={hojaSeguridad.url}
                  className="inline-flex min-h-11 items-center gap-2 rounded-m border border-marca/25 px-4 text-marca hover:bg-marca/5 focus-visible:rounded-m"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hoja de seguridad (PDF
                  {hojaSeguridad.filesize
                    ? `, ${formatearPeso(hojaSeguridad.filesize)}`
                    : ""}
                  )
                </a>
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <BotonEnlace
            href={`/contacto?producto=${encodeURIComponent(producto.nombre)}`}
            variante="primario"
          >
            Pedir información
          </BotonEnlace>
          {whatsapp ? (
            <a
              href={whatsapp}
              className="inline-flex min-h-11 items-center rounded-m border border-marca px-5 py-2 text-marca hover:bg-marca/5 focus-visible:rounded-m"
              rel="noopener noreferrer"
              target="_blank"
            >
              WhatsApp
            </a>
          ) : null}
        </div>

        {relacionados.docs.length > 0 ? (
          <section className="mt-14" aria-labelledby="relacionados-titulo">
            <h2
              id="relacionados-titulo"
              className="font-titular text-xl text-marca"
            >
              Productos del mismo cultivo
            </h2>
            <ul className={`mt-6 ${listado.gridListado}`}>
              {relacionados.docs.map((rel) => {
                const cat =
                  typeof rel.categoria === "object" && rel.categoria
                    ? rel.categoria.nombre
                    : null;
                const medio = primeraImagen(rel.galeria);
                return (
                  <li key={rel.id}>
                    <TarjetaProducto
                      slug={rel.slug}
                      nombre={rel.nombre}
                      resumen={rel.resumen}
                      categoria={cat}
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
          </section>
        ) : null}
      </main>
    </TransicionPagina>
  );
}

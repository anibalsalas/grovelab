import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BotonEnlace } from "@/components/ui/boton-enlace";
import { Migas } from "@/components/ui/migas";
import { TablaDosis, type FilaDosis } from "@/components/ui/tabla-dosis";
import { TarjetaProducto } from "@/components/ui/tarjeta-producto";
import { clasesMain, idContenidoPrincipal } from "@/lib/clases-sitio";
import { getPayloadClient } from "@/lib/payload-client";
import { enlaceWhatsAppInformacion } from "@/lib/url-contacto.ts";
import ficha from "@/styles/ficha-producto.module.css";
import listado from "@/styles/listado.module.css";

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

  const whatsapp = enlaceWhatsAppInformacion(producto.nombre);

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
    <main id={idContenidoPrincipal} className={clasesMain}>
      <Migas items={migas} />

      <header className="mt-6 max-w-prose">
        {categoria ? (
          <p className="text-sm font-medium text-acento uppercase">
            {categoria.nombre}
          </p>
        ) : null}
        <h1 className="mt-1 font-titular text-3xl text-marca sm:text-4xl">
          {producto.nombre}
        </h1>
        {producto.resumen ? (
          <p className="mt-3 leading-relaxed text-texto/90">
            {producto.resumen}
          </p>
        ) : null}
      </header>

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
                    href={`/buscar?plaga=${encodeURIComponent(plagaSlug)}`}
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

      {filasDosis.length > 0 ? (
        <div className="mt-10">
          <TablaDosis filas={filasDosis} />
        </div>
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
              return (
                <li key={rel.id}>
                  <TarjetaProducto
                    slug={rel.slug}
                    nombre={rel.nombre}
                    resumen={rel.resumen}
                    categoria={cat}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </main>
  );
}

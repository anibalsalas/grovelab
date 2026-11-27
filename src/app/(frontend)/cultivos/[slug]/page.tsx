import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import { Migas } from "@/components/ui/migas";
import { TarjetaProducto } from "@/components/ui/tarjeta-producto";
import { TransicionPagina } from "@/components/animacion/transicion-pagina";
import { clasesMain, idContenidoPrincipal } from "@/lib/clases-sitio";
import { primeraImagen } from "@/lib/medio-populado.ts";
import { nombreTransicionCultivo } from "@/lib/nombres-transicion.ts";
import { getPayloadClient } from "@/lib/payload-client";
import listado from "@/styles/listado.module.css";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const resultado = await payload.find({
    collection: "cultivos",
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 0,
  });
  const cultivo = resultado.docs[0];
  if (!cultivo) {
    return { title: "Cultivo no encontrado" };
  }
  return {
    title: cultivo.nombre,
    description: cultivo.resumen ?? undefined,
  };
}

export default async function CultivoPage({ params }: PageProps) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const cultivoResult = await payload.find({
    collection: "cultivos",
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 0,
  });
  const cultivo = cultivoResult.docs[0];
  if (!cultivo) {
    notFound();
  }

  const productosResult = await payload.find({
    collection: "productos",
    limit: 50,
    where: {
      cultivos: {
        in: [cultivo.id],
      },
    },
    depth: 1,
  });

  return (
    <TransicionPagina>
      <main id={idContenidoPrincipal} className={clasesMain}>
        <Migas
          items={[
            { etiqueta: "Cultivos", href: "/cultivos" },
            { etiqueta: cultivo.nombre },
          ]}
        />

        <div className="mt-6">
          <EncabezadoPagina
            titulo={cultivo.nombre}
            descripcion={cultivo.resumen ?? undefined}
            nombreTransicion={nombreTransicionCultivo(cultivo.slug)}
          />
        </div>

        <section className="mt-10" aria-labelledby="productos-cultivo">
          <h2 id="productos-cultivo" className="font-titular text-xl text-marca">
            Productos para este cultivo
          </h2>

          {productosResult.docs.length === 0 ? (
            <EstadoVacio
              titulo="Sin productos"
              mensaje="Aún no hay productos publicados para este cultivo."
              enlace={{ href: "/productos", etiqueta: "Ver catálogo" }}
            />
          ) : (
            <ul className={`mt-6 ${listado.gridListado}`}>
              {productosResult.docs.map((producto) => {
                const categoria =
                  typeof producto.categoria === "object" && producto.categoria
                    ? producto.categoria.nombre
                    : null;
                const medio = primeraImagen(producto.galeria);
                return (
                  <li key={producto.id}>
                    <TarjetaProducto
                      slug={producto.slug}
                      nombre={producto.nombre}
                      resumen={producto.resumen}
                      categoria={categoria}
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
        </section>
      </main>
    </TransicionPagina>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Migas } from "@/components/ui/migas";
import { formatearFechaNoticia } from "@/lib/formatear-fecha.ts";
import { clasesMain, idContenidoPrincipal } from "@/lib/clases-sitio";
import { getPayloadClient } from "@/lib/payload-client";
import institucional from "@/styles/institucional.module.css";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const resultado = await payload.find({
    collection: "noticias",
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 0,
  });
  const noticia = resultado.docs[0];
  if (!noticia) {
    return { title: "Noticia no encontrada" };
  }
  return {
    title: noticia.titulo,
    description: noticia.resumen ?? undefined,
  };
}

export default async function NoticiaPage({ params }: PageProps) {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const resultado = await payload.find({
    collection: "noticias",
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 0,
  });
  const noticia = resultado.docs[0];

  if (!noticia) {
    notFound();
  }

  return (
    <main id={idContenidoPrincipal} className={clasesMain}>
      <Migas
        items={[
          { etiqueta: "Noticias", href: "/noticias" },
          { etiqueta: noticia.titulo },
        ]}
      />
      <article className="mt-6">
        <time
          dateTime={noticia.fecha}
          className="text-sm font-medium text-texto/70"
        >
          {formatearFechaNoticia(noticia.fecha)}
        </time>
        <h1 className="mt-2 font-titular text-3xl text-marca sm:text-4xl">
          {noticia.titulo}
        </h1>
        {noticia.resumen ? (
          <p className="mt-4 max-w-prose text-lg leading-relaxed text-texto/90">
            {noticia.resumen}
          </p>
        ) : null}
        <div className={`mt-8 ${institucional.cuerpoNoticia}`}>{noticia.cuerpo}</div>
      </article>
    </main>
  );
}

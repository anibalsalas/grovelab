import type { Metadata } from "next";
import Link from "next/link";

import { RevelarAlScroll } from "@/components/animacion/revelar-al-scroll";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { EstadoVacio } from "@/components/ui/estado-vacio";
import {
  NOTICIAS_POR_PAGINA,
  paginaNoticiasActual,
} from "@/lib/filtro-noticias.ts";
import { formatearFechaNoticia } from "@/lib/formatear-fecha.ts";
import { clasesMain, idContenidoPrincipal } from "@/lib/clases-sitio";
import { getPayloadClient } from "@/lib/payload-client";
import listado from "@/styles/listado.module.css";
import sitio from "@/styles/sitio.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Novedades de Grovelab.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function urlNoticias(pagina?: number): string {
  if (pagina && pagina > 1) {
    return `/noticias?pagina=${pagina}`;
  }
  return "/noticias";
}

export default async function NoticiasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pagina = paginaNoticiasActual(params);
  const payload = await getPayloadClient();

  const resultado = await payload.find({
    collection: "noticias",
    limit: NOTICIAS_POR_PAGINA,
    page: pagina,
    sort: "-fecha",
    depth: 0,
  });

  const noticias = resultado.docs;
  const totalPaginas = resultado.totalPages;

  return (
    <main id={idContenidoPrincipal} className={clasesMain}>
      <EncabezadoPagina
        titulo="Noticias"
        descripcion="Actualidad del sector y de Grovelab."
      />

      {noticias.length === 0 ? (
        <EstadoVacio
          titulo="Sin noticias publicadas"
          mensaje="Cuando el equipo publique una noticia, aparecerá aquí."
          enlace={{ href: "/contacto", etiqueta: "Contactar" }}
        />
      ) : (
        <>
          <ul className={`mt-8 ${listado.gridListado}`}>
            {noticias.map((noticia) => (
              <li key={noticia.id}>
                <RevelarAlScroll>
                  <article className={sitio.tarjetaPlana}>
                    <time
                      dateTime={noticia.fecha}
                      className="text-xs font-medium uppercase tracking-wide text-texto/70"
                    >
                      {formatearFechaNoticia(noticia.fecha)}
                    </time>
                    <h2 className="mt-2 font-titular text-lg text-marca">
                      <Link
                        href={`/noticias/${noticia.slug}`}
                        className="hover:underline underline-offset-4"
                      >
                        {noticia.titulo}
                      </Link>
                    </h2>
                    {noticia.resumen ? (
                      <p className="mt-2 text-sm leading-relaxed line-clamp-3">
                        {noticia.resumen}
                      </p>
                    ) : null}
                  </article>
                </RevelarAlScroll>
              </li>
            ))}
          </ul>

          {totalPaginas > 1 ? (
            <nav
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
              aria-label="Paginación"
            >
              {pagina > 1 ? (
                <Link
                  href={urlNoticias(pagina - 1)}
                  className="inline-flex min-h-11 items-center rounded-m border border-marca/20 px-4 text-sm text-marca"
                >
                  Anterior
                </Link>
              ) : null}
              <span className="px-2 text-sm text-texto/80">
                Página {pagina} de {totalPaginas}
              </span>
              {pagina < totalPaginas ? (
                <Link
                  href={urlNoticias(pagina + 1)}
                  className="inline-flex min-h-11 items-center rounded-m border border-marca/20 px-4 text-sm text-marca"
                >
                  Siguiente
                </Link>
              ) : null}
            </nav>
          ) : null}
        </>
      )}
    </main>
  );
}

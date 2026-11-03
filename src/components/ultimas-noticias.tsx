import Link from "next/link";

import { EncabezadoSeccion } from "@/components/encabezado-seccion";
import { formatearFechaNoticia } from "@/lib/formatear-fecha.ts";
import sitio from "@/styles/sitio.module.css";

type NoticiaResumen = {
  slug: string;
  titulo: string;
  fecha: string;
  resumen?: string | null;
};

type UltimasNoticiasProps = {
  noticias: NoticiaResumen[];
};

export function UltimasNoticias({ noticias }: UltimasNoticiasProps) {
  if (noticias.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="ultimas-noticias-titulo">
      <EncabezadoSeccion
        id="ultimas-noticias-titulo"
        titulo="Últimas noticias"
        descripcion="Novedades del sector y de Grovelab."
      />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {noticias.map((noticia) => (
          <li key={noticia.slug} className={sitio.tarjetaPlana}>
            <time
              dateTime={noticia.fecha}
              className="text-xs font-medium uppercase tracking-wide text-texto/70"
            >
              {formatearFechaNoticia(noticia.fecha)}
            </time>
            <h3 className="mt-2 font-titular text-lg text-marca">
              <Link
                href={`/noticias/${noticia.slug}`}
                className="hover:underline underline-offset-4"
              >
                {noticia.titulo}
              </Link>
            </h3>
            {noticia.resumen ? (
              <p className="mt-2 text-sm leading-relaxed line-clamp-3">
                {noticia.resumen}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="mt-6">
        <Link
          href="/noticias"
          className="font-medium text-marca underline-offset-4 hover:underline"
        >
          Ver todas las noticias
        </Link>
      </p>
    </section>
  );
}

"use client";

import type { MouseEvent } from "react";

import {
  construirUrlCatalogo,
  type FiltrosCatalogo,
} from "@/lib/catalogo-productos.ts";

import estilos from "./catalogo.module.css";

type PaginacionCatalogoProps = {
  filtros: FiltrosCatalogo;
  pagina: number;
  totalPaginas: number;
  onIrA: (pagina: number) => void;
};

/**
 * Enlaces reales a `?pagina=N` (se pueden abrir en otra pestaña o compartir); un clic normal
 * cambia de página sin recargar. Con Ctrl, Cmd o botón central se respeta el comportamiento del navegador.
 */
export function PaginacionCatalogo({
  filtros,
  pagina,
  totalPaginas,
  onIrA,
}: PaginacionCatalogoProps) {
  if (totalPaginas <= 1) {
    return null;
  }

  function irA(evento: MouseEvent<HTMLAnchorElement>, destino: number) {
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.button !== 0) {
      return;
    }
    evento.preventDefault();
    onIrA(destino);
  }

  return (
    <nav className={estilos.paginacion} aria-label="Paginación">
      {pagina > 1 ? (
        <a
          href={construirUrlCatalogo({ ...filtros, pagina: pagina - 1 })}
          className={estilos.paginaEnlace}
          onClick={(evento) => irA(evento, pagina - 1)}
        >
          Anterior
        </a>
      ) : null}
      <span className="px-2 text-sm text-texto/80">
        Página {pagina} de {totalPaginas}
      </span>
      {pagina < totalPaginas ? (
        <a
          href={construirUrlCatalogo({ ...filtros, pagina: pagina + 1 })}
          className={estilos.paginaEnlace}
          onClick={(evento) => irA(evento, pagina + 1)}
        >
          Siguiente
        </a>
      ) : null}
    </nav>
  );
}

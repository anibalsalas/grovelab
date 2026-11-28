"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { parseBuscarQuery } from "@/lib/buscar-query.ts";
import {
  construirUrlCatalogo,
  filtrosDesdeQuery,
  type FiltrosCatalogo,
} from "@/lib/catalogo-productos.ts";

export type ModoHistorial = "push" | "replace";

const CLAVES_URL = ["q", "cultivo", "plaga", "categoria", "pagina"] as const;

function leerFiltros(
  params: Pick<URLSearchParams, "get">,
  sanear: (filtros: FiltrosCatalogo) => FiltrosCatalogo,
): FiltrosCatalogo {
  const origen: Record<string, string | undefined> = {};
  for (const clave of CLAVES_URL) {
    origen[clave] = params.get(clave) ?? undefined;
  }
  return sanear(filtrosDesdeQuery(parseBuscarQuery(origen)));
}

type EstadoFiltros = {
  /** Última URL (canónica) que se vio en `useSearchParams`. */
  claveUrl: string;
  filtros: FiltrosCatalogo;
};

/**
 * Filtros del catálogo sincronizados con la URL, que es la fuente de verdad al entrar,
 * al compartir el enlace y al usar Atrás/Adelante.
 *
 * - Escritura: API nativa de historial (Next la sincroniza sin pedir de nuevo la página al
 *   servidor, porque el catálogo ya está en el cliente) y, a la vez, estado local. Así la
 *   interfaz responde en el mismo instante y no espera al router (INP).
 * - Lectura: si `useSearchParams` cambia por otra vía (Atrás, Adelante, un enlace), se adopta
 *   la URL; si es el eco de una escritura propia, no se toca nada.
 * - Una actualización que no cambia nada no crea entradas de historial ni renders.
 * - `actualizar` es estable y siempre parte de los filtros vigentes, por lo que un temporizador
 *   de búsqueda antiguo no puede pisar un filtro elegido después.
 */
export function useFiltrosUrl(sanear: (filtros: FiltrosCatalogo) => FiltrosCatalogo) {
  const searchParams = useSearchParams();
  const desdeUrl = useMemo(() => leerFiltros(searchParams, sanear), [searchParams, sanear]);
  const claveUrl = construirUrlCatalogo(desdeUrl);

  const [estado, setEstado] = useState<EstadoFiltros>({ claveUrl, filtros: desdeUrl });

  let filtros = estado.filtros;
  if (estado.claveUrl !== claveUrl) {
    // Ajuste durante el render (patrón recomendado por React en lugar de un efecto).
    if (construirUrlCatalogo(estado.filtros) !== claveUrl) {
      filtros = desdeUrl;
    }
    setEstado({ claveUrl, filtros });
  }

  const vigentes = useRef(filtros);
  useEffect(() => {
    vigentes.current = filtros;
  }, [filtros]);

  const actualizar = useCallback(
    (cambios: Partial<FiltrosCatalogo>, modo: ModoHistorial = "push") => {
      // Cualquier cambio de filtro vuelve a la primera página, salvo que se indique otra.
      const siguientes: FiltrosCatalogo = { ...vigentes.current, pagina: 1, ...cambios };
      const url = construirUrlCatalogo(siguientes);
      if (url === construirUrlCatalogo(vigentes.current)) {
        return;
      }
      vigentes.current = siguientes;
      setEstado((previo) => ({ claveUrl: previo.claveUrl, filtros: siguientes }));
      if (modo === "replace") {
        window.history.replaceState(null, "", url);
      } else {
        window.history.pushState(null, "", url);
      }
    },
    [],
  );

  return { filtros, actualizar };
}

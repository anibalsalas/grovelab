"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";

import { AnuncioResultados } from "@/components/ui/anuncio-resultados";
import {
  FACETAS,
  FILTROS_VACIOS,
  calcularOpciones,
  contarFacetasActivas,
  filtrarProductos,
  indexarCatalogo,
  paginar,
  sanearFiltros,
  type Faceta,
  type FiltrosCatalogo,
  type ProductoCatalogo,
} from "@/lib/catalogo-productos.ts";

import { BarraBusquedaCatalogo } from "./barra-busqueda-catalogo";
import estilos from "./catalogo.module.css";
import {
  ChipsFiltrosActivos,
  type ChipFiltro,
  type ClaveFiltro,
} from "./chips-filtros-activos";
import { EstadoSinResultados } from "./estado-sin-resultados";
import { FiltrosCatalogo as GruposFiltros, TEXTOS_FACETA } from "./filtros-catalogo";
import { PaginacionCatalogo } from "./paginacion-catalogo";
import { RejillaProductos } from "./rejilla-productos";
import { useFiltrosUrl } from "./use-filtros-url";

type CatalogoProductosProps = {
  productos: ProductoCatalogo[];
  enlaceConsulta: string | null;
};

/**
 * Catálogo interactivo de /productos. Recibe todos los productos publicados una sola vez y
 * resuelve búsqueda, filtros, contador y paginación en el navegador: no hay peticiones por
 * tecla (nada que duplicar ni respuestas fuera de orden) y los resultados son inmediatos.
 * La URL guarda el estado (`q`, `categoria`, `cultivo`, `plaga`, `pagina`).
 */
export function CatalogoProductos({ productos, enlaceConsulta }: CatalogoProductosProps) {
  const idPanel = useId();
  const titulo = useRef<HTMLHeadingElement>(null);
  const [panelAbierto, setPanelAbierto] = useState(false);

  const indexados = useMemo(() => indexarCatalogo(productos), [productos]);
  const opcionesBase = useMemo(
    () => calcularOpciones(indexados, FILTROS_VACIOS),
    [indexados],
  );
  const sanear = useCallback(
    (filtros: FiltrosCatalogo) => sanearFiltros(filtros, opcionesBase),
    [opcionesBase],
  );

  const { filtros, actualizar } = useFiltrosUrl(sanear);

  const resultados = useMemo(() => filtrarProductos(indexados, filtros), [indexados, filtros]);
  const opciones = useMemo(() => calcularOpciones(indexados, filtros), [indexados, filtros]);
  const pagina = useMemo(
    () => paginar(resultados, filtros.pagina),
    [resultados, filtros.pagina],
  );

  const facetasActivas = contarFacetasActivas(filtros);

  const chips = useMemo<ChipFiltro[]>(() => {
    const lista: ChipFiltro[] = [];
    if (filtros.q) {
      lista.push({ clave: "q", texto: `Búsqueda: «${filtros.q}»` });
    }
    for (const faceta of FACETAS) {
      const opcion = opciones[faceta].find((o) => o.slug === filtros[faceta]);
      if (opcion) {
        lista.push({ clave: faceta, texto: `${TEXTOS_FACETA[faceta].chip}: ${opcion.nombre}` });
      }
    }
    return lista;
  }, [filtros, opciones]);

  /** Lleva el foco (y la vista) al encabezado de resultados: lo leen los lectores de pantalla. */
  const enfocarResultados = useCallback(() => {
    requestAnimationFrame(() => titulo.current?.focus());
  }, []);

  const buscarTexto = useCallback(
    (texto: string, modo: "push" | "replace") => actualizar({ q: texto }, modo),
    [actualizar],
  );

  function cambiarFaceta(faceta: Faceta, slug: string) {
    actualizar({ [faceta]: slug });
  }

  function quitarFiltro(clave: ClaveFiltro) {
    actualizar({ [clave]: "" });
    enfocarResultados();
  }

  function limpiarFiltros() {
    actualizar({ q: "", categoria: "", cultivo: "", plaga: "" });
    enfocarResultados();
  }

  function irAPagina(numero: number) {
    actualizar({ pagina: numero });
    enfocarResultados();
  }

  return (
    <div className={estilos.catalogo}>
      <BarraBusquedaCatalogo valor={filtros.q} onBuscar={buscarTexto} />

      <div className={estilos.disposicion}>
        <aside className={estilos.lateral} aria-label="Filtros del catálogo">
          <button
            type="button"
            className={estilos.botonFiltros}
            aria-expanded={panelAbierto}
            aria-controls={idPanel}
            onClick={() => setPanelAbierto((abierto) => !abierto)}
          >
            Filtros
            {facetasActivas > 0 ? (
              <span className={estilos.insignia}>
                {facetasActivas}
                <span className="sr-only">
                  {facetasActivas === 1 ? " filtro activo" : " filtros activos"}
                </span>
              </span>
            ) : null}
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" className={estilos.chevron}>
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>

          <div id={idPanel} className={estilos.panelFiltros} data-abierto={panelAbierto}>
            <GruposFiltros opciones={opciones} filtros={filtros} onCambiar={cambiarFaceta} />
            <button
              type="button"
              className={`${estilos.botonPrimario} ${estilos.verResultados}`}
              onClick={() => setPanelAbierto(false)}
            >
              {resultados.length === 1
                ? "Ver 1 producto"
                : `Ver ${resultados.length} productos`}
            </button>
          </div>
        </aside>

        <section className={estilos.resultados} aria-labelledby={`${idPanel}-resultados`}>
          <h2 id={`${idPanel}-resultados`} ref={titulo} tabIndex={-1} className={estilos.tituloResultados}>
            Resultados
          </h2>

          <div className={estilos.barraEstado}>
            <AnuncioResultados total={resultados.length} className={estilos.contador} />
            <ChipsFiltrosActivos
              chips={chips}
              onQuitar={quitarFiltro}
              onLimpiar={limpiarFiltros}
            />
          </div>

          {pagina.items.length > 0 ? (
            <>
              <RejillaProductos productos={pagina.items} />
              <PaginacionCatalogo
                filtros={filtros}
                pagina={pagina.pagina}
                totalPaginas={pagina.totalPaginas}
                onIrA={irAPagina}
              />
            </>
          ) : (
            <EstadoSinResultados onLimpiar={limpiarFiltros} enlaceConsulta={enlaceConsulta} />
          )}
        </section>
      </div>
    </div>
  );
}

"use client";

import type { Faceta } from "@/lib/catalogo-productos.ts";

import estilos from "./catalogo.module.css";

export type ClaveFiltro = "q" | Faceta;

export type ChipFiltro = {
  clave: ClaveFiltro;
  /** Texto visible, p. ej. «Cultivo: Vid». */
  texto: string;
};

type ChipsFiltrosActivosProps = {
  chips: ChipFiltro[];
  onQuitar: (clave: ClaveFiltro) => void;
  onLimpiar: () => void;
};

/** Filtros activos como chips que se quitan uno a uno, más «Limpiar filtros». */
export function ChipsFiltrosActivos({ chips, onQuitar, onLimpiar }: ChipsFiltrosActivosProps) {
  if (chips.length === 0) {
    return null;
  }

  return (
    <>
      <ul className={estilos.chips} aria-label="Filtros activos">
        {chips.map((chip) => (
          <li key={chip.clave}>
            <button
              type="button"
              className={estilos.chip}
              aria-label={`Quitar filtro ${chip.texto}`}
              onClick={() => onQuitar(chip.clave)}
            >
              <span>{chip.texto}</span>
              <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false" className={estilos.chipCerrar}>
                <path d="M2.5 2.5 9.5 9.5M9.5 2.5 2.5 9.5" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className={estilos.limpiar} onClick={onLimpiar}>
        Limpiar filtros
      </button>
    </>
  );
}

"use client";

import { useId } from "react";

import {
  FACETAS,
  type Faceta,
  type FiltrosCatalogo,
  type OpcionFaceta,
} from "@/lib/catalogo-productos.ts";

import estilos from "./catalogo.module.css";

/** «Todas»/«Todos» se lee dentro de su grupo («Categoría»: «Todas»), por eso es corto. */
export const TEXTOS_FACETA: Record<Faceta, { titulo: string; todas: string; chip: string }> = {
  categoria: { titulo: "Categoría", todas: "Todas", chip: "Categoría" },
  cultivo: { titulo: "Cultivo", todas: "Todos", chip: "Cultivo" },
  plaga: { titulo: "Plaga objetivo", todas: "Todas", chip: "Plaga" },
};

type FiltrosCatalogoProps = {
  opciones: Record<Faceta, OpcionFaceta[]>;
  filtros: FiltrosCatalogo;
  onCambiar: (faceta: Faceta, slug: string) => void;
};

type GrupoFacetaProps = {
  faceta: Faceta;
  opciones: OpcionFaceta[];
  seleccionada: string;
  onCambiar: (faceta: Faceta, slug: string) => void;
};

function GrupoFaceta({ faceta, opciones, seleccionada, onCambiar }: GrupoFacetaProps) {
  const idBase = useId();
  const textos = TEXTOS_FACETA[faceta];

  return (
    <div className={estilos.grupo}>
      <fieldset className={estilos.faceta}>
        <legend className="mb-2 font-titular text-lg font-semibold text-marca">
          {textos.titulo}
        </legend>
        <ul className={estilos.lista}>
          <li>
            <label className={estilos.opcion}>
              <input
                type="radio"
                name={faceta}
                value=""
                checked={seleccionada === ""}
                onChange={() => onCambiar(faceta, "")}
                className={estilos.radio}
              />
              <span className={estilos.nombreOpcion}>{textos.todas}</span>
            </label>
          </li>
          {opciones.map((opcion) => {
            const elegida = seleccionada === opcion.slug;
            // Una opción sin productos con los demás filtros activos solo llevaría a cero resultados.
            const sinProductos = opcion.total === 0 && !elegida;
            return (
              <li key={opcion.slug}>
                <label className={estilos.opcion} htmlFor={`${idBase}-${opcion.slug}`}>
                  <input
                    id={`${idBase}-${opcion.slug}`}
                    type="radio"
                    name={faceta}
                    value={opcion.slug}
                    checked={elegida}
                    disabled={sinProductos}
                    onChange={() => onCambiar(faceta, opcion.slug)}
                    className={estilos.radio}
                  />
                  <span className={estilos.nombreOpcion}>{opcion.nombre}</span>
                  <span className={estilos.conteo} aria-hidden="true">
                    {opcion.total}
                  </span>
                  <span className="sr-only">
                    {opcion.total === 1 ? "1 producto" : `${opcion.total} productos`}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}

/** Grupos de filtros (categoría, cultivo y plaga). Un grupo sin opciones no se muestra. */
export function FiltrosCatalogo({ opciones, filtros, onCambiar }: FiltrosCatalogoProps) {
  return (
    <>
      {FACETAS.filter((faceta) => opciones[faceta].length > 0).map((faceta) => (
        <GrupoFaceta
          key={faceta}
          faceta={faceta}
          opciones={opciones[faceta]}
          seleccionada={filtros[faceta]}
          onCambiar={onCambiar}
        />
      ))}
    </>
  );
}

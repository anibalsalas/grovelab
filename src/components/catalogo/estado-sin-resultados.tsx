"use client";

import Link from "next/link";

import estilos from "./catalogo.module.css";

type EstadoSinResultadosProps = {
  onLimpiar: () => void;
  /** Enlace a WhatsApp si hay número configurado; si no, se ofrece la página de contacto. */
  enlaceConsulta: string | null;
};

/** Sin coincidencias: dice qué pasó y ofrece dos salidas (limpiar los filtros o preguntar a un asesor). */
export function EstadoSinResultados({ onLimpiar, enlaceConsulta }: EstadoSinResultadosProps) {
  return (
    <div className={estilos.sinResultados}>
      <h3 className="font-titular text-lg font-semibold text-marca">
        No encontramos productos con estos filtros
      </h3>
      <p className="mt-2 leading-relaxed">
        Prueba con otra palabra o quita algún filtro. También puedes ver el catálogo completo.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className={estilos.botonPrimario} onClick={onLimpiar}>
          Limpiar filtros
        </button>
        {enlaceConsulta ? (
          <a
            href={enlaceConsulta}
            className={estilos.botonSecundario}
            target="_blank"
            rel="noopener noreferrer"
          >
            Preguntar por WhatsApp
          </a>
        ) : (
          <Link href="/contacto" className={estilos.botonSecundario}>
            Contactar
          </Link>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

import { BotonEnlace } from "@/components/ui/boton-enlace";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { clasesMain, idContenidoPrincipal } from "@/lib/clases-sitio";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPagina({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error.digest ?? "error-frontend");
  }, [error]);

  return (
    <main id={idContenidoPrincipal} className={clasesMain}>
      <EncabezadoPagina
        titulo="Algo salió mal"
        descripcion="No pudimos cargar esta página. Intenta de nuevo en un momento."
      />
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center rounded-m bg-marca px-5 py-2 text-fondo shadow-s hover:bg-marca/90 focus-visible:rounded-m"
        >
          Reintentar
        </button>
        <BotonEnlace href="/" variante="secundario">
          Ir al inicio
        </BotonEnlace>
      </div>
    </main>
  );
}

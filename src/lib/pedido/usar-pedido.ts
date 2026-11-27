"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  CLAVE_ALMACEN,
  agregarFila,
  cambiarCantidad as cambiarCantidadFila,
  guardarFilas,
  leerFilas,
  quitarFila,
  type ResultadoAgregar,
} from "./almacen-local.ts";
import type { FilaPedido } from "./esquema.ts";

/** Aviso a las islas de la misma pestaña; las otras pestañas usan el evento `storage`. */
const EVENTO_LOCAL = "grovelab:pedido";

const SIN_FILAS: FilaPedido[] = [];

// `useSyncExternalStore` exige que `getSnapshot` devuelva la misma referencia
// mientras el contenido no cambie; por eso se guarda el texto leído por última vez.
let crudoAnterior: string | null | undefined;
let filasAnteriores: FilaPedido[] = SIN_FILAS;

function leerCrudo(): string | null {
  try {
    return window.localStorage.getItem(CLAVE_ALMACEN);
  } catch {
    return null;
  }
}

function obtenerFilas(): FilaPedido[] {
  const crudo = leerCrudo();
  if (crudo === crudoAnterior) {
    return filasAnteriores;
  }
  crudoAnterior = crudo;
  filasAnteriores = crudo === null ? SIN_FILAS : leerFilas(window.localStorage);
  return filasAnteriores;
}

function suscribir(avisar: () => void): () => void {
  const alCambiarAlmacen = (evento: StorageEvent) => {
    if (evento.key === null || evento.key === CLAVE_ALMACEN) {
      avisar();
    }
  };
  window.addEventListener("storage", alCambiarAlmacen);
  window.addEventListener(EVENTO_LOCAL, avisar);
  return () => {
    window.removeEventListener("storage", alCambiarAlmacen);
    window.removeEventListener(EVENTO_LOCAL, avisar);
  };
}

/** Aplica el cambio y avisa. Devuelve `false` si el navegador no dejó guardar. */
function guardarYAvisar(filas: readonly FilaPedido[]): boolean {
  const guardado = guardarFilas(window.localStorage, filas);
  if (guardado) {
    window.dispatchEvent(new Event(EVENTO_LOCAL));
  }
  return guardado;
}

export type ResultadoAgregarPedido =
  | ResultadoAgregar["resultado"]
  | "no-guardado";

/**
 * «Mi pedido» en el navegador. En el servidor y en la hidratación devuelve el
 * pedido vacío, así el HTML no cambia entre servidor y cliente.
 */
export function usePedido() {
  const filas = useSyncExternalStore(suscribir, obtenerFilas, () => SIN_FILAS);

  const agregar = useCallback((nueva: FilaPedido): ResultadoAgregarPedido => {
    const { filas: resultadoFilas, resultado } = agregarFila(
      obtenerFilas(),
      nueva,
    );
    if (resultado !== "agregado") {
      return resultado;
    }
    return guardarYAvisar(resultadoFilas) ? "agregado" : "no-guardado";
  }, []);

  const quitar = useCallback((slug: string, presentacion: string) => {
    guardarYAvisar(quitarFila(obtenerFilas(), slug, presentacion));
  }, []);

  const cambiarCantidad = useCallback(
    (slug: string, presentacion: string, cantidad: number) => {
      guardarYAvisar(
        cambiarCantidadFila(obtenerFilas(), slug, presentacion, cantidad),
      );
    },
    [],
  );

  const vaciar = useCallback(() => {
    guardarYAvisar([]);
  }, []);

  return { filas, agregar, quitar, cambiarCantidad, vaciar };
}

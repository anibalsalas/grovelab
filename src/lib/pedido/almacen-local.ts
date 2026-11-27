import {
  CANTIDAD_MAXIMA,
  CANTIDAD_MINIMA,
  LIMITE_FILAS,
  VERSION_ALMACEN,
  esquemaAlmacenPedido,
  esquemaFilaPedido,
  type FilaPedido,
} from "./esquema.ts";

export const CLAVE_ALMACEN = "grovelab.pedido.v1";

/** Subconjunto de `Storage` que se usa; permite probar sin navegador. */
export type AlmacenSimple = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type ResultadoAgregar = {
  filas: FilaPedido[];
  resultado: "agregado" | "lleno" | "invalido";
};

function mismaFila(
  fila: FilaPedido,
  slug: string,
  presentacion: string,
): boolean {
  return fila.slug === slug && fila.presentacion === presentacion;
}

function limitarCantidad(cantidad: number): number {
  return Math.min(CANTIDAD_MAXIMA, Math.max(CANTIDAD_MINIMA, cantidad));
}

/** Suma cantidades de la misma combinación producto + presentación y respeta los límites. */
export function consolidarFilas(filas: readonly FilaPedido[]): FilaPedido[] {
  const resultado: FilaPedido[] = [];
  for (const fila of filas) {
    const existente = resultado.find((r) =>
      mismaFila(r, fila.slug, fila.presentacion),
    );
    if (existente) {
      existente.cantidad = limitarCantidad(existente.cantidad + fila.cantidad);
    } else if (resultado.length < LIMITE_FILAS) {
      resultado.push({ ...fila });
    }
  }
  return resultado;
}

/** Lee el pedido guardado. Cualquier problema (JSON roto, versión vieja, datos fuera de rango) deja el pedido vacío. */
export function leerFilas(almacen: AlmacenSimple): FilaPedido[] {
  try {
    const crudo = almacen.getItem(CLAVE_ALMACEN);
    if (crudo === null) {
      return [];
    }
    const parseado = esquemaAlmacenPedido.safeParse(JSON.parse(crudo));
    return parseado.success ? consolidarFilas(parseado.data.filas) : [];
  } catch {
    return [];
  }
}

/** Guarda el pedido. Devuelve `false` si el navegador no deja escribir (modo privado, cuota llena). */
export function guardarFilas(
  almacen: AlmacenSimple,
  filas: readonly FilaPedido[],
): boolean {
  try {
    if (filas.length === 0) {
      almacen.removeItem(CLAVE_ALMACEN);
      return true;
    }
    almacen.setItem(
      CLAVE_ALMACEN,
      JSON.stringify({ version: VERSION_ALMACEN, filas }),
    );
    return true;
  } catch {
    return false;
  }
}

export function agregarFila(
  filas: readonly FilaPedido[],
  nueva: FilaPedido,
): ResultadoAgregar {
  const parseada = esquemaFilaPedido.safeParse(nueva);
  if (!parseada.success) {
    return { filas: [...filas], resultado: "invalido" };
  }
  const fila = parseada.data;
  const existe = filas.some((f) => mismaFila(f, fila.slug, fila.presentacion));
  if (!existe && filas.length >= LIMITE_FILAS) {
    return { filas: [...filas], resultado: "lleno" };
  }
  return {
    filas: consolidarFilas([...filas, fila]),
    resultado: "agregado",
  };
}

export function quitarFila(
  filas: readonly FilaPedido[],
  slug: string,
  presentacion: string,
): FilaPedido[] {
  return filas.filter((f) => !mismaFila(f, slug, presentacion));
}

/** Cambia la cantidad de una fila. Un valor que no es número entero deja la fila igual; fuera de rango se ajusta. */
export function cambiarCantidad(
  filas: readonly FilaPedido[],
  slug: string,
  presentacion: string,
  cantidad: number,
): FilaPedido[] {
  if (!Number.isFinite(cantidad)) {
    return [...filas];
  }
  const nueva = limitarCantidad(Math.trunc(cantidad));
  return filas.map((f) =>
    mismaFila(f, slug, presentacion) ? { ...f, cantidad: nueva } : f,
  );
}

/** Texto del contador: cuenta productos distintos, no unidades. */
export function totalProductos(filas: readonly FilaPedido[]): number {
  return filas.length;
}

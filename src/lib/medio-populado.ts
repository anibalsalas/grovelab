import type { Medio } from "@/payload-types";

/** Las relaciones de Payload llegan como id numérico si no se resolvieron (depth insuficiente). */
export function medioPopulado(
  valor: number | Medio | null | undefined,
): Medio | null {
  if (!valor || typeof valor === "number") {
    return null;
  }
  return valor;
}

/** Primera imagen resuelta de una galería (el orden ya lo decide quien carga el contenido en el panel). */
export function primeraImagen(
  galeria: (number | Medio)[] | null | undefined,
): Medio | null {
  for (const item of galeria ?? []) {
    const medio = medioPopulado(item);
    if (medio) {
      return medio;
    }
  }
  return null;
}

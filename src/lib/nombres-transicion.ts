/**
 * Nombres de transición compartidos entre la tarjeta y el título de destino.
 * Un solo lugar para que tarjeta y página no se desincronicen.
 *
 * `view-transition-name` debe ser un identificador CSS válido: el slug ya
 * es minúsculas, dígitos y guiones, pero se limpia por si acaso.
 */
function limpiar(slug: string): string {
  return slug.replace(/[^a-z0-9-]/gi, "-");
}

export function nombreTransicionProducto(slug: string): string {
  return `producto-${limpiar(slug)}`;
}

export function nombreTransicionCultivo(slug: string): string {
  return `cultivo-${limpiar(slug)}`;
}

import type { Payload } from "payload";

import type { ProductoCatalogo, RelacionCatalogo } from "./catalogo-productos.ts";
import { primeraImagen } from "./medio-populado.ts";

type RelacionPayload = { slug: string; nombre: string };

/** Las relaciones sin resolver (solo id) o sin permiso de lectura se omiten. */
function relacionesPobladas(
  valores: (number | RelacionPayload)[] | null | undefined,
): RelacionCatalogo[] {
  const relaciones: RelacionCatalogo[] = [];
  for (const valor of valores ?? []) {
    if (typeof valor === "object" && valor) {
      relaciones.push({ slug: valor.slug, nombre: valor.nombre });
    }
  }
  return relaciones;
}

/**
 * Carga el catálogo público completo (solo productos publicados, con las reglas de acceso
 * de Payload) en una sola consulta. Los filtros y la búsqueda se resuelven después en el
 * navegador sobre estos datos, sin nuevas peticiones. Mientras el catálogo sea de decenas
 * de productos (≈70 previstos) esto es más liviano que una petición por cada tecla.
 */
export async function cargarCatalogoProductos(
  payload: Payload,
): Promise<ProductoCatalogo[]> {
  const resultado = await payload.find({
    overrideAccess: false,
    collection: "productos",
    pagination: false,
    sort: "nombre",
    depth: 1,
  });

  return resultado.docs.map((doc) => {
    const categoria =
      typeof doc.categoria === "object" && doc.categoria
        ? {
            slug: doc.categoria.slug,
            nombre: doc.categoria.nombre,
            orden: doc.categoria.orden ?? 0,
          }
        : null;
    const medio = primeraImagen(doc.galeria);

    return {
      id: doc.id,
      slug: doc.slug,
      nombre: doc.nombre,
      resumen: doc.resumen ?? null,
      ingredienteActivo: doc.ingredienteActivo ?? null,
      categoria,
      cultivos: relacionesPobladas(doc.cultivos),
      plagas: relacionesPobladas(doc.plagas),
      imagen: medio
        ? {
            url: medio.url ?? "",
            alt: medio.alt,
            width: medio.width,
            height: medio.height,
          }
        : null,
    };
  });
}

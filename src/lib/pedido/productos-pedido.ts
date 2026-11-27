import {
  LIMITE_FILAS,
  PRESENTACION_A_CONSULTAR,
} from "@/lib/pedido/esquema.ts";
import { getPayloadClient } from "@/lib/payload-client";

export type ProductoDelPedido = {
  id: number;
  slug: string;
  nombre: string;
  /** Presentaciones válidas hoy; «A consultar con el asesor» si el producto no tiene ninguna cargada. */
  presentaciones: string[];
};

/**
 * Productos que se pueden pedir ahora: publicados y con «Admite pedido».
 * Lo guardado en el navegador no es confiable, así que esta es la fuente de verdad.
 * El filtro por `_status` es explícito: la Local API ignora el acceso público.
 */
export async function leerProductosPedido(
  slugs: readonly string[],
): Promise<ProductoDelPedido[]> {
  if (slugs.length === 0) {
    return [];
  }
  const payload = await getPayloadClient();
  const resultado = await payload.find({
    overrideAccess: false,
    collection: "productos",
    where: {
      and: [
        { slug: { in: [...slugs] } },
        { _status: { equals: "published" } },
        { admitePedido: { not_equals: false } },
      ],
    },
    depth: 0,
    limit: LIMITE_FILAS,
    pagination: false,
  });

  return resultado.docs.map((producto) => {
    const etiquetas = (producto.presentaciones ?? [])
      .map((p) => p.etiqueta?.trim() ?? "")
      .filter((etiqueta) => etiqueta !== "");
    return {
      id: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      presentaciones:
        etiquetas.length > 0 ? etiquetas : [PRESENTACION_A_CONSULTAR],
    };
  });
}

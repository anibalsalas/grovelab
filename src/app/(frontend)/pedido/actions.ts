"use server";

import { z } from "zod";

import {
  LIMITE_FILAS,
  PRESENTACION_A_CONSULTAR,
  esquemaFilaPedido,
} from "@/lib/pedido/esquema.ts";
import { getPayloadClient } from "@/lib/payload-client";

export type ProductoPedido = {
  slug: string;
  nombre: string;
  /** Presentaciones válidas hoy; «A consultar con el asesor» si el producto no tiene ninguna cargada. */
  presentaciones: string[];
};

const esquemaSlugs = z.array(esquemaFilaPedido.shape.slug).max(LIMITE_FILAS);

/**
 * Datos actuales de los productos que hay en «Mi pedido». Lo guardado en el
 * navegador no es confiable: aquí se vuelve a leer de Payload y solo se
 * devuelven productos publicados que admiten pedido. Solo lectura, sin datos
 * personales.
 */
export async function consultarProductosPedido(
  slugs: unknown,
): Promise<ProductoPedido[]> {
  const parseado = esquemaSlugs.safeParse(slugs);
  if (!parseado.success || parseado.data.length === 0) {
    return [];
  }

  const payload = await getPayloadClient();
  // El filtro por _status es explícito: la Local API ignora el acceso público.
  const resultado = await payload.find({
    collection: "productos",
    where: {
      and: [
        { slug: { in: parseado.data } },
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
      slug: producto.slug,
      nombre: producto.nombre,
      presentaciones:
        etiquetas.length > 0 ? etiquetas : [PRESENTACION_A_CONSULTAR],
    };
  });
}

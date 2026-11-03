import type { Payload, Where } from "payload";

import type { BuscarQuery } from "./buscar-query.ts";

type BuscarProductosResultado = {
  docs: Array<{
    id: number;
    nombre: string;
    slug: string;
    resumen?: string | null;
  }>;
};

async function idPorSlug(
  payload: Payload,
  coleccion: "cultivos" | "plagas" | "categorias",
  slug: string,
): Promise<number | null> {
  const resultado = await payload.find({
    collection: coleccion,
    limit: 1,
    depth: 0,
    where: {
      slug: { equals: slug },
    },
  });
  const doc = resultado.docs[0];
  if (!doc) {
    return null;
  }
  return doc.id;
}

export async function buscarProductos(
  payload: Payload,
  query: BuscarQuery,
): Promise<BuscarProductosResultado> {
  const condiciones: Where[] = [];

  if (query.q) {
    condiciones.push({
      or: [
        { nombre: { contains: query.q } },
        { resumen: { contains: query.q } },
      ],
    });
  }

  if (query.cultivo) {
    const cultivoId = await idPorSlug(payload, "cultivos", query.cultivo);
    if (cultivoId === null) {
      return { docs: [] };
    }
    condiciones.push({
      cultivos: { in: [cultivoId] },
    });
  }

  if (query.plaga) {
    const plagaId = await idPorSlug(payload, "plagas", query.plaga);
    if (plagaId === null) {
      return { docs: [] };
    }
    condiciones.push({
      plagas: { in: [plagaId] },
    });
  }

  if (query.categoria) {
    const categoriaId = await idPorSlug(
      payload,
      "categorias",
      query.categoria,
    );
    if (categoriaId === null) {
      return { docs: [] };
    }
    condiciones.push({
      categoria: { equals: categoriaId },
    });
  }

  const where: Where =
    condiciones.length > 0 ? { and: condiciones } : { id: { equals: -1 } };

  const resultado = await payload.find({
    collection: "productos",
    limit: 50,
    sort: "nombre",
    depth: 0,
    where,
  });

  return {
    docs: resultado.docs.map((doc) => ({
      id: doc.id,
      nombre: doc.nombre,
      slug: doc.slug,
      resumen: doc.resumen,
    })),
  };
}

import type { Payload, Where } from "payload";

import { PRODUCTOS_POR_PAGINA, type BuscarQuery } from "./buscar-query.ts";
import { primeraImagen } from "./medio-populado.ts";
import type { ImagenTarjeta } from "@/components/ui/tarjeta-producto";

type ProductoResultado = {
  id: number;
  nombre: string;
  slug: string;
  resumen?: string | null;
  categoria?: string | null;
  imagen?: ImagenTarjeta | null;
};

type BuscarProductosResultado = {
  docs: ProductoResultado[];
  totalDocs: number;
  totalPages: number;
  pagina: number;
};

const SIN_RESULTADOS: BuscarProductosResultado = {
  docs: [],
  totalDocs: 0,
  totalPages: 0,
  pagina: 1,
};

async function idPorSlug(
  payload: Payload,
  coleccion: "cultivos" | "plagas" | "categorias",
  slug: string,
): Promise<number | null> {
  const resultado = await payload.find({
    overrideAccess: false,
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
      return SIN_RESULTADOS;
    }
    condiciones.push({
      cultivos: { in: [cultivoId] },
    });
  }

  if (query.plaga) {
    const plagaId = await idPorSlug(payload, "plagas", query.plaga);
    if (plagaId === null) {
      return SIN_RESULTADOS;
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
      return SIN_RESULTADOS;
    }
    condiciones.push({
      categoria: { equals: categoriaId },
    });
  }

  const where: Where | undefined =
    condiciones.length > 0 ? { and: condiciones } : undefined;
  const pagina = query.pagina ?? 1;

  const resultado = await payload.find({
    overrideAccess: false,
    collection: "productos",
    limit: PRODUCTOS_POR_PAGINA,
    page: pagina,
    sort: "nombre",
    depth: 1,
    ...(where ? { where } : {}),
  });

  return {
    docs: resultado.docs.map((doc) => ({
      id: doc.id,
      nombre: doc.nombre,
      slug: doc.slug,
      resumen: doc.resumen,
      categoria:
        typeof doc.categoria === "object" && doc.categoria
          ? doc.categoria.nombre
          : null,
      imagen: (() => {
        const medio = primeraImagen(doc.galeria);
        return medio
          ? {
              url: medio.url ?? "",
              alt: medio.alt,
              width: medio.width,
              height: medio.height,
            }
          : null;
      })(),
    })),
    totalDocs: resultado.totalDocs,
    totalPages: resultado.totalPages,
    pagina: resultado.page ?? pagina,
  };
}

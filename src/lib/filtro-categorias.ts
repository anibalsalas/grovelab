import { z } from "zod";

export const PRODUCTOS_POR_PAGINA = 12;

export type ProductosQuery = {
  categoria?: string;
  pagina?: number;
};

const slugSchema = z
  .string()
  .max(120)
  .regex(/^[\p{L}\p{N}-]+$/u);

function primerValor(
  source: Record<string, string | string[] | undefined>,
  clave: string,
): string {
  const valor = source[clave];
  if (Array.isArray(valor)) {
    return valor[0]?.trim() ?? "";
  }
  return valor?.trim() ?? "";
}

function parseSlug(valor: string): string | undefined {
  if (valor === "") {
    return undefined;
  }
  const parsed = slugSchema.safeParse(valor);
  return parsed.success ? parsed.data : undefined;
}

function parsePagina(valor: string): number | undefined {
  if (valor === "") {
    return undefined;
  }
  const numero = Number.parseInt(valor, 10);
  if (!Number.isFinite(numero) || numero < 1) {
    return undefined;
  }
  return numero;
}

export function parseProductosQuery(
  source: Record<string, string | string[] | undefined>,
): ProductosQuery {
  return {
    categoria: parseSlug(primerValor(source, "categoria")),
    pagina: parsePagina(primerValor(source, "pagina")),
  };
}

export function paginaActual(query: ProductosQuery): number {
  return query.pagina ?? 1;
}

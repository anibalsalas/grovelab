import { z } from "zod";

export const PRODUCTOS_POR_PAGINA = 12;

export type BuscarQuery = {
  q?: string;
  cultivo?: string;
  plaga?: string;
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

function parseTexto(valor: string): string | undefined {
  if (valor === "") {
    return undefined;
  }
  const parsed = z.string().max(200).safeParse(valor);
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

export function parseBuscarQuery(
  source: Record<string, string | string[] | undefined>,
): BuscarQuery {
  return {
    q: parseTexto(primerValor(source, "q")),
    cultivo: parseSlug(primerValor(source, "cultivo")),
    plaga: parseSlug(primerValor(source, "plaga")),
    categoria: parseSlug(primerValor(source, "categoria")),
    pagina: parsePagina(primerValor(source, "pagina")),
  };
}

export function tieneFiltrosBuscar(query: BuscarQuery): boolean {
  return Boolean(query.q ?? query.cultivo ?? query.plaga ?? query.categoria);
}

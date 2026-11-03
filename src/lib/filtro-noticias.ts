import { z } from "zod";

export const NOTICIAS_POR_PAGINA = 12;

const esquemaPagina = z.coerce.number().int().min(1).max(500).catch(1);

export function paginaNoticiasActual(
  params: Record<string, string | string[] | undefined>,
): number {
  const crudo = params.pagina;
  const valor = Array.isArray(crudo) ? crudo[0] : crudo;
  return esquemaPagina.parse(valor);
}

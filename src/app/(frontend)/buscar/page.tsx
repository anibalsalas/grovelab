import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const CLAVES_FILTRO = ["q", "cultivo", "plaga", "categoria"] as const;

function primerValor(valor: string | string[] | undefined): string | undefined {
  if (Array.isArray(valor)) {
    return valor[0];
  }
  return valor;
}

/**
 * `/buscar` ya no tiene panel propio: el panel único de filtros vive en
 * `/productos` (ver docs/planes/02-sitio-y-catalogo.md). Esta ruta solo
 * traslada los filtros recibidos para no romper enlaces ya compartidos.
 */
export default async function BuscarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const destino = new URLSearchParams();

  for (const clave of CLAVES_FILTRO) {
    const valor = primerValor(params[clave]);
    if (valor !== undefined && valor !== "") {
      destino.set(clave, valor);
    }
  }

  const query = destino.toString();
  redirect(query ? `/productos?${query}` : "/productos");
}

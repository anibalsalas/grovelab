import { cache } from "react";

import { getPayloadClient } from "@/lib/payload-client";
import { reintentarConsulta } from "@/lib/reintentar-consulta.ts";

/**
 * Indica si existe al menos un cultivo publicado. Mientras no haya ninguno,
 * los enlaces a `/cultivos` (menú, sitemap, botones) no se muestran, para no
 * llevar al visitante a una página vacía (ver docs/planes/02-sitio-y-catalogo.md).
 *
 * El filtro por `_status` es explícito: la Local API ignora el acceso público
 * por defecto y contaría también los borradores.
 *
 * `cache` evita repetir la consulta cuando el layout y la página la piden en
 * la misma petición.
 */
export const hayCultivosPublicados = cache(async (): Promise<boolean> => {
  const payload = await getPayloadClient();
  const { totalDocs } = await reintentarConsulta(() =>
    payload.count({
      collection: "cultivos",
      where: { _status: { equals: "published" } },
    }),
  );
  return totalDocs > 0;
});

import { cache } from "react";

import { getPayloadClient } from "@/lib/payload-client";
import { reintentarConsulta } from "@/lib/reintentar-consulta.ts";

/**
 * Indica si existe al menos una zona comercial publicada. Mientras no haya
 * ninguna, `/zonas-comerciales` responde 404 y el enlace «Zonas» no aparece en
 * el menú, el sitemap ni los botones (misma regla que Cultivos).
 *
 * El filtro por `_status` es explícito: la Local API ignora el acceso público.
 */
export const hayZonasPublicadas = cache(async (): Promise<boolean> => {
  const payload = await getPayloadClient();
  const { totalDocs } = await reintentarConsulta(() =>
    payload.count({
      collection: "zonas-comerciales",
      where: { _status: { equals: "published" } },
    }),
  );
  return totalDocs > 0;
});

import { cache } from "react";

import { getPayloadClient } from "@/lib/payload-client";
import { obtenerWhatsAppNumber } from "@/lib/url-contacto.ts";

import { resolverDestino } from "./destino.ts";

/**
 * ¿Existe al menos un WhatsApp al que pueda ir un pedido? Es el número general
 * (`WHATSAPP_NUMBER`) o el de alguna zona publicada y autorizada. Sin destino,
 * la función de pedido no aparece en el sitio (botón «Agregar», contador y
 * `/pedido`), igual que hoy se oculta el botón de WhatsApp.
 *
 * El filtro por `_status` es explícito: la Local API ignora el acceso público.
 */
export const hayDestinoPedido = cache(async (): Promise<boolean> => {
  if (resolverDestino({ numeroGeneral: obtenerWhatsAppNumber() })) {
    return true;
  }
  const payload = await getPayloadClient();
  const { totalDocs } = await payload.count({
    collection: "zonas-comerciales",
    where: {
      and: [
        { _status: { equals: "published" } },
        { numeroAutorizado: { equals: true } },
        { whatsapp: { exists: true } },
      ],
    },
  });
  return totalDocs > 0;
});

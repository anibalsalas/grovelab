import { normalizarWhatsapp } from "./normalizar-whatsapp.ts";

export type Destino = {
  /** Qué número recibió el mensaje; es lo único que se guarda del destino. */
  tipo: "zona" | "general";
  digitos: string;
};

export type ZonaDestino = {
  whatsapp?: string | null;
  numeroAutorizado?: boolean | null;
};

/**
 * Elige a quién va el pedido: el WhatsApp de la zona (solo si Grovelab lo
 * autorizó para publicar), luego el número general y, si no hay ninguno, `null`.
 * Con `null` la función de pedido no debe mostrarse en el sitio.
 */
export function resolverDestino(entrada: {
  zona?: ZonaDestino | null;
  numeroGeneral?: string | null;
}): Destino | null {
  if (entrada.zona?.numeroAutorizado) {
    const digitosZona = normalizarWhatsapp(entrada.zona.whatsapp);
    if (digitosZona) {
      return { tipo: "zona", digitos: digitosZona };
    }
  }
  const digitosGeneral = normalizarWhatsapp(entrada.numeroGeneral);
  return digitosGeneral ? { tipo: "general", digitos: digitosGeneral } : null;
}

export function urlWhatsapp(destino: Destino, mensaje: string): string {
  return `https://wa.me/${destino.digitos}?text=${encodeURIComponent(mensaje)}`;
}

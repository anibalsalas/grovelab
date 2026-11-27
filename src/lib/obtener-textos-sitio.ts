import { cache } from "react";

import type { TextosSitio } from "@/payload-types";
import { getPayloadClient } from "@/lib/payload-client";

export const obtenerTextosSitio = cache(async (): Promise<TextosSitio> => {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: "textos-sitio", depth: 0 });
});

export function certificacionesPublicadas(
  textos: TextosSitio,
): { etiqueta: string; valor: string }[] {
  const filas = textos.certificaciones ?? [];
  return filas
    .filter((fila) => fila.confirmada && fila.etiqueta?.trim() && fila.valor?.trim())
    .map((fila) => ({
      etiqueta: fila.etiqueta.trim(),
      valor: fila.valor.trim(),
    }));
}

export function serviciosLeadPublico(textos: TextosSitio): string {
  const lead = textos.serviciosLead?.trim();
  if (lead) {
    return lead;
  }
  return "Importación, asesoría y registro para el campo.";
}

export function serviciosPublicados(
  textos: TextosSitio,
): { titulo: string; descripcion: string | null }[] {
  const items = textos.servicios ?? [];
  return items
    .filter((item) => item.titulo?.trim())
    .map((item) => ({
      titulo: item.titulo.trim(),
      descripcion: item.descripcion?.trim() || null,
    }));
}

export function politicaPrivacidadPublica(textos: TextosSitio): string | null {
  const texto = textos.textoPoliticaPrivacidad?.trim();
  return texto && texto.length > 0 ? texto : null;
}

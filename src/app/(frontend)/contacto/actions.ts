"use server";

import { z } from "zod";

import {
  obtenerTextosSitio,
  politicaPrivacidadPublica,
} from "@/lib/obtener-textos-sitio.ts";
import { getPayloadClient } from "@/lib/payload-client";

const esquemaConsulta = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre.").max(120),
  telefono: z.string().trim().min(6, "Ingresa un teléfono válido.").max(30),
  mensaje: z.string().trim().max(2000).optional(),
  productoConsulta: z.string().trim().max(200).optional(),
  aceptoPolitica: z.literal("true", {
    errorMap: () => ({ message: "Debes aceptar la política de privacidad." }),
  }),
});

export type ResultadoConsulta =
  | { ok: true }
  | { ok: false; mensaje: string };

export async function enviarConsulta(
  formData: FormData,
): Promise<ResultadoConsulta> {
  const textos = await obtenerTextosSitio();
  if (!politicaPrivacidadPublica(textos)) {
    return { ok: false, mensaje: "El formulario no está disponible." };
  }

  const parseado = esquemaConsulta.safeParse({
    nombre: formData.get("nombre"),
    telefono: formData.get("telefono"),
    mensaje: formData.get("mensaje") || undefined,
    productoConsulta: formData.get("productoConsulta") || undefined,
    aceptoPolitica: formData.get("aceptoPolitica"),
  });

  if (!parseado.success) {
    const primerError = parseado.error.errors[0]?.message;
    return {
      ok: false,
      mensaje: primerError ?? "Revisa los datos del formulario.",
    };
  }

  const datos = parseado.data;
  const payload = await getPayloadClient();

  await payload.create({
    collection: "consultas",
    data: {
      nombre: datos.nombre,
      telefono: datos.telefono,
      mensaje: datos.mensaje ?? "",
      productoConsulta: datos.productoConsulta,
      aceptoPolitica: true,
    },
    overrideAccess: true,
  });

  return { ok: true };
}

import type { MetadataRoute } from "next";

import {
  obtenerTextosSitio,
  politicaPrivacidadPublica,
} from "@/lib/obtener-textos-sitio.ts";
import { getPayloadClient } from "@/lib/payload-client";

const rutasEstaticas = [
  "",
  "/cultivos",
  "/productos",
  "/buscar",
  "/nosotros",
  "/servicios",
  "/noticias",
  "/contacto",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const ahora = new Date();

  const payload = await getPayloadClient();
  const [textos, noticias] = await Promise.all([
    obtenerTextosSitio(),
    payload.find({
      collection: "noticias",
      limit: 500,
      depth: 0,
      sort: "-fecha",
    }),
  ]);

  const entradas: MetadataRoute.Sitemap = rutasEstaticas.map((ruta) => ({
    url: `${base}${ruta}`,
    lastModified: ahora,
    changeFrequency: ruta === "" ? "weekly" : "monthly",
    priority: ruta === "" ? 1 : 0.7,
  }));

  if (politicaPrivacidadPublica(textos)) {
    entradas.push({
      url: `${base}/privacidad`,
      lastModified: ahora,
      changeFrequency: "yearly",
      priority: 0.3,
    });
  }

  for (const noticia of noticias.docs) {
    entradas.push({
      url: `${base}/noticias/${noticia.slug}`,
      lastModified: noticia.updatedAt ? new Date(noticia.updatedAt) : ahora,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entradas;
}

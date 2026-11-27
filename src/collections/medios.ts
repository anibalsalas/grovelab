import type { CollectionConfig } from "payload";
import { APIError } from "payload";

import { escrituraPanel } from "../lib/acceso-contenido.ts";

const TIPOS_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

const TAMANO_MAXIMO_BYTES = 10 * 1024 * 1024;

/** El cliente declara el mimetype; esto confirma que el contenido realmente lo es (no solo la extensión). */
function coincideConFirma(data: Buffer, mimetype: string): boolean {
  switch (mimetype) {
    case "image/jpeg":
      return data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
    case "image/png":
      return (
        data[0] === 0x89 &&
        data[1] === 0x50 &&
        data[2] === 0x4e &&
        data[3] === 0x47
      );
    case "image/webp":
      return (
        data.subarray(0, 4).toString("ascii") === "RIFF" &&
        data.subarray(8, 12).toString("ascii") === "WEBP"
      );
    case "application/pdf":
      return data.subarray(0, 4).toString("ascii") === "%PDF";
    default:
      return false;
  }
}

export const Medios: CollectionConfig = {
  slug: "medios",
  labels: {
    singular: "Medio",
    plural: "Medios",
  },
  admin: {
    group: "Catálogo",
    useAsTitle: "alt",
  },
  access: {
    create: escrituraPanel,
    delete: escrituraPanel,
    read: () => true,
    update: escrituraPanel,
  },
  upload: {
    mimeTypes: [...TIPOS_PERMITIDOS],
    // Sin recorte del lado del servidor por URL externa: reduce superficie de ataque (SSRF) sin quitarle nada al editor, que sigue subiendo el archivo directo.
    pasteURL: false,
  },
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        if (operation !== "create" && operation !== "update") {
          return;
        }
        const archivo = req.file;
        if (!archivo) {
          return;
        }
        if (
          !TIPOS_PERMITIDOS.includes(
            archivo.mimetype as (typeof TIPOS_PERMITIDOS)[number],
          )
        ) {
          throw new APIError("Tipo de archivo no permitido.", 400);
        }
        if (archivo.size > TAMANO_MAXIMO_BYTES) {
          throw new APIError("El archivo supera el límite de 10 MB.", 400);
        }
        if (!coincideConFirma(archivo.data, archivo.mimetype)) {
          throw new APIError(
            "El contenido del archivo no coincide con el tipo declarado.",
            400,
          );
        }
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texto alternativo",
      admin: {
        description:
          "Describe la imagen para accesibilidad. No hace falta en PDF.",
      },
    },
  ],
};

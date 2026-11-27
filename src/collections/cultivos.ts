import type { CollectionConfig } from "payload";

import {
  escrituraPanel,
  lecturaPublicaOEditor,
  ocultoParaVentas,
} from "../lib/acceso-contenido.ts";

export const Cultivos: CollectionConfig = {
  slug: "cultivos",
  labels: {
    singular: "Cultivo",
    plural: "Cultivos",
  },
  admin: {
    group: "Catálogo",
    hidden: ocultoParaVentas,
    useAsTitle: "nombre",
    defaultColumns: ["nombre", "destacado", "_status", "updatedAt"],
  },
  versions: {
    drafts: true,
  },
  access: {
    create: escrituraPanel,
    delete: escrituraPanel,
    read: lecturaPublicaOEditor,
    update: escrituraPanel,
  },
  fields: [
    {
      name: "nombre",
      type: "text",
      label: "Nombre",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "resumen",
      type: "textarea",
      label: "Resumen",
    },
    {
      name: "imagen",
      type: "relationship",
      relationTo: "medios",
      label: "Imagen",
      filterOptions: {
        mimeType: { contains: "image/" },
      },
    },
    {
      name: "destacado",
      type: "checkbox",
      label: "Destacado en inicio",
      defaultValue: false,
    },
  ],
};

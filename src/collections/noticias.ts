import type { CollectionConfig } from "payload";

import {
  escrituraPanel,
  lecturaPublicaOEditor,
} from "../lib/acceso-contenido.ts";

export const Noticias: CollectionConfig = {
  slug: "noticias",
  labels: {
    singular: "Noticia",
    plural: "Noticias",
  },
  admin: {
    group: "Contenido",
    useAsTitle: "titulo",
    defaultColumns: ["titulo", "fecha", "_status", "updatedAt"],
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
      name: "titulo",
      type: "text",
      label: "Título",
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
      name: "fecha",
      type: "date",
      label: "Fecha de publicación",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "resumen",
      type: "textarea",
      label: "Resumen",
    },
    {
      name: "cuerpo",
      type: "textarea",
      label: "Cuerpo",
      required: true,
    },
  ],
};

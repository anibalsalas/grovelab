import type { CollectionConfig } from "payload";

import {
  escrituraPanel,
  lecturaPublicaOEditor,
  ocultoParaVentas,
} from "../lib/acceso-contenido.ts";

export const Categorias: CollectionConfig = {
  slug: "categorias",
  labels: {
    singular: "Categoría",
    plural: "Categorías",
  },
  admin: {
    group: "Catálogo",
    hidden: ocultoParaVentas,
    useAsTitle: "nombre",
    defaultColumns: ["nombre", "orden", "_status", "updatedAt"],
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
      admin: {
        description: "URL en /productos (filtro por categoría).",
      },
    },
    {
      name: "orden",
      type: "number",
      label: "Orden",
      defaultValue: 0,
      admin: {
        description: "Menor número aparece primero.",
      },
    },
    {
      name: "descripcion",
      type: "textarea",
      label: "Descripción",
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
  ],
};

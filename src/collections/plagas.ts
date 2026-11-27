import type { CollectionConfig } from "payload";

import {
  escrituraPanel,
  lecturaPublicaOEditor,
  ocultoParaVentas,
} from "../lib/acceso-contenido.ts";

export const Plagas: CollectionConfig = {
  slug: "plagas",
  labels: {
    singular: "Plaga",
    plural: "Plagas",
  },
  admin: {
    group: "Catálogo",
    hidden: ocultoParaVentas,
    useAsTitle: "nombre",
    defaultColumns: ["nombre", "_status", "updatedAt"],
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
  ],
};

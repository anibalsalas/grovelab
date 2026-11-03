import type { CollectionConfig } from "payload";

import {
  escrituraPanel,
  lecturaPublicaOEditor,
} from "../lib/acceso-contenido.ts";

export const Productos: CollectionConfig = {
  slug: "productos",
  labels: {
    singular: "Producto",
    plural: "Productos",
  },
  admin: {
    group: "Catálogo",
    useAsTitle: "nombre",
    defaultColumns: ["nombre", "categoria", "_status", "updatedAt"],
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
      name: "categoria",
      type: "relationship",
      relationTo: "categorias",
      label: "Categoría",
      required: true,
    },
    {
      name: "cultivos",
      type: "relationship",
      relationTo: "cultivos",
      label: "Cultivos",
      hasMany: true,
    },
    {
      name: "plagas",
      type: "relationship",
      relationTo: "plagas",
      label: "Plagas",
      hasMany: true,
    },
    {
      name: "resumen",
      type: "textarea",
      label: "Resumen",
    },
    {
      name: "ingredienteActivo",
      type: "text",
      label: "Ingrediente activo",
    },
    {
      name: "formulacion",
      type: "text",
      label: "Formulación",
    },
    {
      name: "registroSenasa",
      type: "text",
      label: "Registro SENASA",
    },
    {
      name: "destacado",
      type: "checkbox",
      label: "Destacado en inicio",
      defaultValue: false,
    },
    {
      name: "dosis",
      type: "array",
      label: "Tabla de dosis",
      labels: {
        singular: "Fila",
        plural: "Filas",
      },
      fields: [
        {
          name: "cultivo",
          type: "relationship",
          relationTo: "cultivos",
          label: "Cultivo",
          required: true,
        },
        {
          name: "plaga",
          type: "relationship",
          relationTo: "plagas",
          label: "Plaga",
        },
        {
          name: "dosis",
          type: "text",
          label: "Dosis",
          required: true,
        },
        {
          name: "nota",
          type: "text",
          label: "Nota",
        },
      ],
    },
  ],
};

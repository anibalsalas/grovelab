import type { CollectionConfig } from "payload";

import {
  escrituraPanel,
  lecturaPublicaOEditor,
  ocultoParaVentas,
} from "../lib/acceso-contenido.ts";

export const Productos: CollectionConfig = {
  slug: "productos",
  labels: {
    singular: "Producto",
    plural: "Productos",
  },
  admin: {
    group: "Catálogo",
    hidden: ocultoParaVentas,
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
      name: "galeria",
      type: "relationship",
      relationTo: "medios",
      label: "Galería",
      hasMany: true,
      filterOptions: {
        mimeType: { contains: "image/" },
      },
      admin: {
        description:
          "Foto principal primero. El texto alternativo de cada foto se edita en Medios.",
      },
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
      name: "fichaTecnica",
      type: "relationship",
      relationTo: "medios",
      label: "Ficha técnica (PDF)",
      filterOptions: {
        mimeType: { equals: "application/pdf" },
      },
    },
    {
      name: "hojaSeguridad",
      type: "relationship",
      relationTo: "medios",
      label: "Hoja de seguridad (PDF)",
      filterOptions: {
        mimeType: { equals: "application/pdf" },
      },
    },
    {
      name: "presentaciones",
      type: "array",
      label: "Presentaciones",
      admin: {
        description:
          "Formatos en que se vende el producto (p. ej. 1 L, 25 kg). Solo los que Grovelab confirme.",
      },
      labels: {
        singular: "Presentación",
        plural: "Presentaciones",
      },
      fields: [
        {
          name: "etiqueta",
          type: "text",
          label: "Presentación",
          required: true,
          maxLength: 40,
        },
      ],
    },
    {
      name: "composicion",
      type: "array",
      label: "Composición",
      admin: {
        description:
          "Para nutricionales y bioestimulantes: elemento y porcentaje o concentración. Solo datos de la etiqueta.",
      },
      labels: {
        singular: "Componente",
        plural: "Componentes",
      },
      fields: [
        {
          name: "elemento",
          type: "text",
          label: "Elemento",
          required: true,
          maxLength: 80,
        },
        {
          name: "valor",
          type: "text",
          label: "Porcentaje o concentración",
          required: true,
          maxLength: 40,
        },
      ],
    },
    {
      name: "destacado",
      type: "checkbox",
      label: "Destacado en inicio",
      defaultValue: false,
    },
    {
      name: "admitePedido",
      type: "checkbox",
      label: "Admite pedido",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description:
          "Si se apaga, la ficha muestra solo «Pedir información» y el producto no se puede agregar a «Mi pedido».",
      },
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

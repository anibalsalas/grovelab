import type { CollectionConfig } from "payload";

import {
  escrituraPanel,
  ocultoParaVentas,
} from "../lib/acceso-contenido.ts";

export const Consultas: CollectionConfig = {
  slug: "consultas",
  labels: {
    singular: "Consulta",
    plural: "Consultas",
  },
  admin: {
    group: "Contenido",
    hidden: ocultoParaVentas,
    useAsTitle: "nombre",
    defaultColumns: ["nombre", "telefono", "createdAt"],
  },
  access: {
    create: () => false,
    read: escrituraPanel,
    update: escrituraPanel,
    delete: escrituraPanel,
  },
  fields: [
    {
      name: "nombre",
      type: "text",
      label: "Nombre",
      required: true,
    },
    {
      name: "telefono",
      type: "text",
      label: "Teléfono",
      required: true,
    },
    {
      name: "mensaje",
      type: "textarea",
      label: "Mensaje",
      maxLength: 2000,
    },
    {
      name: "productoConsulta",
      type: "text",
      label: "Producto (consulta desde ficha)",
      maxLength: 200,
    },
    {
      name: "aceptoPolitica",
      type: "checkbox",
      label: "Aceptó política de privacidad",
      required: true,
      defaultValue: false,
    },
  ],
};

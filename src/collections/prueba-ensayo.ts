import type { CollectionConfig } from "payload";

/** Colección mínima del ensayo; se puede quitar al cerrar la fase de prueba. */
export const PruebaEnsayo: CollectionConfig = {
  slug: "prueba-ensayo",
  labels: {
    singular: "Prueba de ensayo",
    plural: "Pruebas de ensayo",
  },
  admin: {
    group: "Ensayo",
  },
  fields: [
    {
      name: "titulo",
      type: "text",
      label: "Título",
      required: true,
    },
  ],
};

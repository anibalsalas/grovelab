import type { CollectionConfig } from "payload";

import {
  escrituraPanel,
  lecturaPublicaOEditor,
} from "../lib/acceso-contenido.ts";
import { normalizarWhatsapp } from "../lib/pedido/normalizar-whatsapp.ts";

export const ZonasComerciales: CollectionConfig = {
  slug: "zonas-comerciales",
  labels: {
    singular: "Zona comercial",
    plural: "Zonas comerciales",
  },
  admin: {
    group: "Ventas",
    useAsTitle: "nombre",
    defaultColumns: ["nombre", "asesorNombre", "orden", "_status", "updatedAt"],
    description:
      "Cada zona con su asesor. Los datos salen de lo que Grovelab confirme por escrito; no se copian de la web antigua sin validar.",
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
      label: "Nombre de la zona",
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
      name: "cobertura",
      type: "array",
      label: "Cobertura",
      admin: {
        description:
          "Departamentos o ciudades que atiende la zona, en el orden en que se muestran.",
      },
      labels: {
        singular: "Lugar",
        plural: "Lugares",
      },
      fields: [
        {
          name: "lugar",
          type: "text",
          label: "Lugar",
          required: true,
          maxLength: 80,
        },
      ],
    },
    {
      name: "asesorNombre",
      type: "text",
      label: "Nombre del asesor",
      admin: {
        description: "Opcional. Sin nombre se muestra «Asesor comercial».",
      },
    },
    {
      name: "asesorCargo",
      type: "text",
      label: "Cargo del asesor",
      admin: {
        description: "Opcional (por ejemplo, RTC).",
      },
    },
    {
      name: "whatsapp",
      type: "text",
      label: "WhatsApp de la zona",
      admin: {
        description:
          "Celular de 9 dígitos o con código de país (+51…). Solo se muestra en la web si marcas «Número autorizado para publicar».",
      },
      validate: (valor: string | null | undefined) => {
        if (!valor || valor.trim() === "") {
          return true;
        }
        return normalizarWhatsapp(valor)
          ? true
          : "Ingresa un número válido: 9 dígitos o con código de país (de 9 a 15 dígitos).";
      },
      access: {
        // Lectura pública solo si Grovelab autorizó publicar este número.
        read: ({ req, doc }) =>
          Boolean(req.user) || doc?.numeroAutorizado === true,
      },
    },
    {
      name: "numeroAutorizado",
      type: "checkbox",
      label: "Número autorizado para publicar",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Márcalo solo con autorización escrita de Grovelab y de la persona. Sin la marca, el número no sale del servidor y el pedido de esta zona va al número general.",
      },
    },
    {
      name: "orden",
      type: "number",
      label: "Orden",
      defaultValue: 0,
      admin: {
        position: "sidebar",
      },
    },
  ],
};

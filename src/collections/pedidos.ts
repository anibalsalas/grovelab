import type { CollectionConfig } from "payload";

import {
  accesoPedidos,
  nadieEditaCampo,
  rolDe,
  soloAdministrador,
} from "../lib/acceso-contenido.ts";

/**
 * Pedidos enviados desde la web. Se crean solo desde el servidor (Server Action,
 * con datos ya validados): `create: () => false` cierra la API pública. El equipo
 * solo cambia el estado y la nota interna; el contenido del pedido no se edita.
 */
export const Pedidos: CollectionConfig = {
  slug: "pedidos",
  labels: {
    singular: "Pedido",
    plural: "Pedidos",
  },
  admin: {
    group: "Ventas",
    useAsTitle: "id",
    defaultColumns: ["id", "estado", "zona", "createdAt"],
    description:
      "Solicitudes de cotización enviadas desde la web. No son ventas: no llevan precios. Contienen datos personales: solo administrador y ventas.",
    hidden: ({ user }) => {
      const rol = rolDe(user);
      return rol !== "administrador" && rol !== "ventas";
    },
  },
  access: {
    create: () => false,
    read: accesoPedidos,
    update: accesoPedidos,
    delete: soloAdministrador,
  },
  fields: [
    {
      name: "estado",
      type: "select",
      label: "Estado",
      required: true,
      defaultValue: "nuevo",
      index: true,
      options: [
        { label: "Nuevo", value: "nuevo" },
        { label: "Contactado", value: "contactado" },
        { label: "Cotizado", value: "cotizado" },
        { label: "Cerrado", value: "cerrado" },
        { label: "Descartado", value: "descartado" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "notaInterna",
      type: "textarea",
      label: "Nota interna",
      admin: {
        description: "Solo la ve el equipo. No se muestra en la web.",
      },
    },
    {
      name: "items",
      type: "array",
      label: "Productos",
      access: { update: nadieEditaCampo },
      admin: {
        readOnly: true,
        description:
          "Nombre y presentación se copiaron al enviar el pedido, para que no cambien si luego se edita el producto.",
      },
      labels: { singular: "Producto", plural: "Productos" },
      fields: [
        {
          name: "producto",
          type: "relationship",
          relationTo: "productos",
          label: "Producto",
        },
        {
          name: "nombreProducto",
          type: "text",
          label: "Nombre",
          required: true,
        },
        {
          name: "presentacion",
          type: "text",
          label: "Presentación",
          required: true,
        },
        {
          name: "cantidad",
          type: "number",
          label: "Cantidad",
          required: true,
          min: 1,
          max: 9999,
        },
      ],
    },
    {
      name: "nombre",
      type: "text",
      label: "Nombre",
      access: { update: nadieEditaCampo },
      admin: {
        readOnly: true,
        description: "Vacío si se envió sin datos personales (sin política publicada).",
      },
    },
    {
      name: "telefono",
      type: "text",
      label: "Teléfono",
      access: { update: nadieEditaCampo },
      admin: { readOnly: true },
    },
    {
      name: "zona",
      type: "relationship",
      relationTo: "zonas-comerciales",
      label: "Zona",
      access: { update: nadieEditaCampo },
      admin: { readOnly: true },
    },
    {
      name: "ciudad",
      type: "text",
      label: "Ciudad",
      maxLength: 80,
      access: { update: nadieEditaCampo },
      admin: { readOnly: true },
    },
    {
      name: "cultivo",
      type: "relationship",
      relationTo: "cultivos",
      label: "Cultivo",
      access: { update: nadieEditaCampo },
      admin: { readOnly: true },
    },
    {
      name: "hectareas",
      type: "number",
      label: "Hectáreas",
      min: 0.1,
      max: 100000,
      access: { update: nadieEditaCampo },
      admin: { readOnly: true },
    },
    {
      name: "destino",
      type: "select",
      label: "Número que recibió el mensaje",
      options: [
        { label: "Asesor de la zona", value: "zona" },
        { label: "Número general", value: "general" },
      ],
      access: { update: nadieEditaCampo },
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Solo se guarda el tipo de destino, no el número.",
      },
    },
    {
      name: "aceptoPolitica",
      type: "checkbox",
      label: "Aceptó la política de privacidad",
      defaultValue: false,
      access: { update: nadieEditaCampo },
      admin: { readOnly: true, position: "sidebar" },
    },
  ],
};

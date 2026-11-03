import type { GlobalConfig } from "payload";

import { escrituraPanel } from "../lib/acceso-contenido.ts";

export const TextosSitio: GlobalConfig = {
  slug: "textos-sitio",
  label: "Textos del sitio",
  admin: {
    description:
      "Checklist Grovelab: contacto (teléfono, correo, dirección, mapa); Nosotros (lead + bloques cortos); Servicios (lead + ítems); certificaciones solo si están confirmadas; política de privacidad antes de activar el formulario. Semilla local: npm run seed:textos-sitio.",
  },
  access: {
    read: () => true,
    update: escrituraPanel,
  },
  fields: [
    {
      name: "titularPortada",
      type: "text",
      label: "Titular de portada",
      admin: {
        description:
          "Pendiente de confirmación con el logo y marca de Grovelab.",
      },
    },
    {
      name: "subtituloPortada",
      type: "textarea",
      label: "Subtítulo de portada",
    },
    {
      type: "group",
      name: "contacto",
      label: "Contacto",
      fields: [
        {
          name: "telefono",
          type: "text",
          label: "Teléfono",
        },
        {
          name: "correo",
          type: "email",
          label: "Correo",
        },
        {
          name: "direccion",
          type: "textarea",
          label: "Dirección",
        },
        {
          name: "urlMapa",
          type: "text",
          label: "Enlace a mapa (URL)",
        },
      ],
    },
    {
      type: "group",
      name: "nosotros",
      label: "Nosotros",
      fields: [
        {
          name: "descripcionLead",
          type: "textarea",
          label: "Descripción breve (encabezado)",
        },
        {
          name: "bloques",
          type: "array",
          label: "Bloques de contenido",
          fields: [
            {
              name: "titulo",
              type: "text",
              label: "Título",
              required: true,
            },
            {
              name: "cuerpo",
              type: "textarea",
              label: "Texto",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "serviciosLead",
      type: "textarea",
      label: "Descripción breve (página Servicios)",
      admin: {
        description: "Texto bajo el título en /servicios.",
      },
    },
    {
      name: "servicios",
      type: "array",
      label: "Servicios (máx. 3 en portada)",
      maxRows: 6,
      admin: {
        description:
          "Texto público. Referencias a normas, SENASA o trámites deben revisarse con Grovelab antes de publicar.",
      },
      fields: [
        {
          name: "titulo",
          type: "text",
          label: "Título",
          required: true,
        },
        {
          name: "descripcion",
          type: "textarea",
          label: "Descripción",
        },
      ],
    },
    {
      name: "certificaciones",
      type: "array",
      label: "Certificaciones y cifras",
      admin: {
        description:
          "Solo se muestran en la web las filas marcadas como confirmadas por Grovelab.",
      },
      fields: [
        {
          name: "etiqueta",
          type: "text",
          label: "Etiqueta",
          required: true,
        },
        {
          name: "valor",
          type: "text",
          label: "Cifra o texto",
          required: true,
        },
        {
          name: "confirmada",
          type: "checkbox",
          label: "Confirmada para publicación",
          defaultValue: false,
        },
      ],
    },
    {
      type: "group",
      name: "testimonio",
      label: "Testimonio en video",
      fields: [
        {
          name: "titulo",
          type: "text",
          label: "Título de la sección",
        },
        {
          name: "urlVideo",
          type: "text",
          label: "URL del video (YouTube o Vimeo)",
        },
      ],
    },
    {
      name: "textoPoliticaPrivacidad",
      type: "textarea",
      label: "Política de privacidad (texto completo)",
      admin: {
        description:
          "Sin texto aprobado no hay formulario de contacto ni ruta /privacidad pública.",
      },
    },
  ],
};

/**
 * Textos institucionales tomados de grovelabperu.com.pe (WordPress, ~2019).
 * Revisar con Grovelab antes de producción. Origen documentado en seed:textos-sitio.
 */
export const contenidoTextosLegacy = {
  titularPortada: "Productos para el sector agrícola",
  subtituloPortada:
    "Importación, formulación y asistencia técnica con enfoque en el medio ambiente y fuentes orgánicas naturales.",
  contacto: {
    telefono: "(01) 7436140",
    correo: "info@grovelabperu.com",
    direccion: "Av. Tambo Río Lt.16, Comas, Lima, Perú",
  },
  nosotros: {
    descripcionLead:
      "Somos una empresa peruana dedicada a la importación, formulación y comercialización de productos para el sector agrícola, con asistencia técnica bajo el control al medio ambiente y el aprovechamiento de recursos de fuente orgánica natural.",
    bloques: [
      {
        titulo: "Formulaciones solubles",
        cuerpo:
          "Nuestros productos son formulaciones altamente solubles y asimilables, con nutrientes quelatizados con sustancias naturales de alta calidad. Complementan la nutrición del suelo y evitan carencias para lograr el máximo potencial de los cultivos; pueden aplicarse a todo tipo de cultivo y en todas las etapas de desarrollo.",
      },
      {
        titulo: "Modos de aplicación",
        cuerpo:
          "Gracias a los altos niveles de hidrosolubilidad, pueden aplicarse por riego, aspersión foliar, microaspersión o goteo. Las moléculas orgánicas de fuente natural son de origen vegetal y no generan daños al medio ambiente como ciertos insumos convencionales.",
      },
      {
        titulo: "Enfoque por cultivo",
        cuerpo:
          "Tradicionalmente los agricultores adquieren formulaciones generalizadas y no siempre las requeridas para su cultivo. Grovelab suplanta ese esquema con formulaciones específicas según la necesidad del suelo y del cultivo, apoyados en capacidad técnica y fabril.",
      },
      {
        titulo: "Calidad y confianza",
        cuerpo:
          "Contamos con profesionales que verifican cada etapa del proceso de producción. Buscamos posicionarnos en especialidades agrícolas, garantizando autenticidad y calidad en cada formulación, con la confianza que agroexportadores y productores esperan.",
      },
    ],
  },
  serviciosLead:
    "Importación directa, asesoría en trámites y logística para insumos agrícolas en el Perú.",
  servicios: [
    {
      titulo: "Importación directa",
      descripcion:
        "Importadores directos de agroquímicos genéricos bajo el régimen de consumo propio de la Ley 30.190, además de productos nutricionales y bioestimulantes según las necesidades de cada cultivo y de acuerdo con agricultores, agroindustria y distribuidores.",
    },
    {
      titulo: "Asesoría y logística en importaciones",
      descripcion:
        "Asesoramos a empresas y personas naturales que deseen importar insumos agrícolas amparados en la Ley 30.190 y con autorización de SENASA. Apoyamos en nacionalización y transporte local para evitar costos imprevistos.",
    },
  ],
} as const;

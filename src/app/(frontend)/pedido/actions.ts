"use server";

import { z } from "zod";

import {
  obtenerTextosSitio,
  politicaPrivacidadPublica,
} from "@/lib/obtener-textos-sitio.ts";
import { getPayloadClient } from "@/lib/payload-client";
import { resolverDestino, urlWhatsapp } from "@/lib/pedido/destino.ts";
import {
  LIMITE_FILAS,
  ZONA_OTRA,
  esquemaEnvioConDatos,
  esquemaEnvioSinDatos,
  esquemaFilaPedido,
  type EnvioConDatos,
} from "@/lib/pedido/esquema.ts";
import { construirMensaje } from "@/lib/pedido/mensaje-whatsapp.ts";
import { leerProductosPedido } from "@/lib/pedido/productos-pedido.ts";
import { obtenerWhatsAppNumber } from "@/lib/url-contacto.ts";

export type ProductoPedido = {
  slug: string;
  nombre: string;
  presentaciones: string[];
};

const esquemaSlugs = z.array(esquemaFilaPedido.shape.slug).max(LIMITE_FILAS);

/**
 * Datos actuales de los productos que hay en «Mi pedido». Solo lectura, sin
 * datos personales.
 */
export async function consultarProductosPedido(
  slugs: unknown,
): Promise<ProductoPedido[]> {
  const parseado = esquemaSlugs.safeParse(slugs);
  if (!parseado.success) {
    return [];
  }
  const productos = await leerProductosPedido(parseado.data);
  return productos.map(({ slug, nombre, presentaciones }) => ({
    slug,
    nombre,
    presentaciones,
  }));
}

// ---------------------------------------------------------------------------
// Envío del pedido
// ---------------------------------------------------------------------------

/** Tiempo mínimo entre que carga el formulario y el envío (antiabuso, sin servicios externos). */
const MS_MINIMOS_EN_FORMULARIO = 3000;
/** Máximo de pedidos guardados por teléfono en una hora. */
const PEDIDOS_POR_TELEFONO_Y_HORA = 3;
/** Tope global de pedidos guardados por hora; pasado el tope se envía igual por WhatsApp, sin guardar. */
const PEDIDOS_GUARDADOS_POR_HORA = 200;
const UNA_HORA_MS = 60 * 60 * 1000;

export type CampoEnvio =
  | "zona"
  | "ciudad"
  | "cultivo"
  | "hectareas"
  | "nombre"
  | "telefono"
  | "aceptoPolitica";

export type ProductoNoDisponible = {
  slug: string;
  presentacion: string;
  motivo: string;
};

export type ResultadoEnvio =
  | {
      ok: true;
      /** `null` solo cuando se descartó un envío automático (campo trampa). */
      url: string | null;
      /** Número del pedido guardado; `null` si no se pudo o no se quiso guardar. */
      numero: number | null;
    }
  | {
      ok: false;
      mensaje?: string;
      errores?: Partial<Record<CampoEnvio, string>>;
      productosNoDisponibles?: ProductoNoDisponible[];
    };

const esquemaMeta = z.object({
  sitioWeb: z.string().max(500).optional(),
  msDesdeCarga: z.number().finite().optional(),
});

const CAMPOS_CON_ERROR: readonly CampoEnvio[] = [
  "zona",
  "ciudad",
  "cultivo",
  "hectareas",
  "nombre",
  "telefono",
  "aceptoPolitica",
];

function erroresPorCampo(
  error: z.ZodError,
): Partial<Record<CampoEnvio, string>> {
  const errores: Partial<Record<CampoEnvio, string>> = {};
  for (const incidencia of error.issues) {
    const campo = incidencia.path[0];
    if (
      typeof campo === "string" &&
      (CAMPOS_CON_ERROR as readonly string[]).includes(campo) &&
      !errores[campo as CampoEnvio]
    ) {
      errores[campo as CampoEnvio] = incidencia.message;
    }
  }
  return errores;
}

/**
 * Valida el pedido, vuelve a leer todo en el servidor, lo guarda y devuelve la
 * URL de WhatsApp. El número de destino lo elige el servidor, nunca el navegador.
 *
 * Con política de privacidad publicada se piden y guardan nombre y teléfono.
 * Sin ella no se pide ni se guarda ningún dato personal: el pedido se guarda
 * solo con productos, zona, ciudad, cultivo y hectáreas.
 *
 * No se escribe en logs ningún dato del pedido.
 */
export async function enviarPedido(entrada: unknown): Promise<ResultadoEnvio> {
  const meta = esquemaMeta.safeParse(entrada);
  const { sitioWeb, msDesdeCarga } = meta.success ? meta.data : {};

  // Campo trampa: una persona no lo ve ni lo rellena. Se responde «ok» sin hacer nada.
  if (sitioWeb) {
    return { ok: true, url: null, numero: null };
  }
  if (msDesdeCarga !== undefined && msDesdeCarga < MS_MINIMOS_EN_FORMULARIO) {
    return {
      ok: false,
      mensaje: "Espera unos segundos e inténtalo de nuevo.",
    };
  }

  const textos = await obtenerTextosSitio();
  const conPolitica = politicaPrivacidadPublica(textos) !== null;

  const parseado = conPolitica
    ? esquemaEnvioConDatos.safeParse(entrada)
    : esquemaEnvioSinDatos.safeParse(entrada);
  if (!parseado.success) {
    const filasVacias = parseado.error.issues.some(
      (i) => i.path[0] === "filas",
    );
    return {
      ok: false,
      errores: erroresPorCampo(parseado.error),
      mensaje: filasVacias
        ? "Tu pedido está vacío o tiene datos no válidos."
        : undefined,
    };
  }
  const datos = parseado.data;
  // `conPolitica` decidió el esquema: solo en ese caso hay nombre y teléfono validados.
  const datosPersonales = conPolitica ? (datos as EnvioConDatos) : null;

  if (!datos.zona) {
    return {
      ok: false,
      errores: { zona: "Elige tu zona o «Otra zona / no sé»." },
    };
  }

  const payload = await getPayloadClient();

  // Productos: se revalida cada fila contra lo publicado hoy.
  const productos = await leerProductosPedido([
    ...new Set(datos.filas.map((f) => f.slug)),
  ]);
  const porSlug = new Map(productos.map((p) => [p.slug, p]));
  const noDisponibles: ProductoNoDisponible[] = [];
  for (const fila of datos.filas) {
    const producto = porSlug.get(fila.slug);
    if (!producto) {
      noDisponibles.push({
        slug: fila.slug,
        presentacion: fila.presentacion,
        motivo: "Un producto de tu pedido ya no está disponible y lo quitamos.",
      });
    } else if (!producto.presentaciones.includes(fila.presentacion)) {
      noDisponibles.push({
        slug: fila.slug,
        presentacion: fila.presentacion,
        motivo: `La presentación ${fila.presentacion} de ${producto.nombre} ya no está disponible y la quitamos de tu pedido.`,
      });
    }
  }
  if (noDisponibles.length > 0) {
    return {
      ok: false,
      productosNoDisponibles: noDisponibles,
      mensaje: "Revisamos tu pedido: quitamos lo que ya no está disponible. Revísalo y vuelve a enviar.",
    };
  }

  // Zona y cultivo: por slug, solo publicados.
  let zona: {
    id: number;
    nombre: string;
    whatsapp?: string | null;
    numeroAutorizado?: boolean | null;
  } | null = null;
  if (datos.zona !== ZONA_OTRA) {
    const encontrada = await payload.find({
      collection: "zonas-comerciales",
      where: {
        and: [
          { slug: { equals: datos.zona } },
          { _status: { equals: "published" } },
        ],
      },
      depth: 0,
      limit: 1,
    });
    const doc = encontrada.docs[0];
    if (!doc) {
      return { ok: false, errores: { zona: "Elige una zona de la lista." } };
    }
    zona = doc;
  }

  let cultivo: { id: number; nombre: string } | null = null;
  if (datos.cultivo) {
    const encontrado = await payload.find({
      collection: "cultivos",
      where: {
        and: [
          { slug: { equals: datos.cultivo } },
          { _status: { equals: "published" } },
        ],
      },
      depth: 0,
      limit: 1,
    });
    const doc = encontrado.docs[0];
    if (!doc) {
      return {
        ok: false,
        errores: { cultivo: "Elige un cultivo de la lista." },
      };
    }
    cultivo = doc;
  }

  const destino = resolverDestino({
    zona,
    numeroGeneral: obtenerWhatsAppNumber(),
  });
  if (!destino) {
    return {
      ok: false,
      mensaje: "El pedido no está disponible en este momento.",
    };
  }

  // Límites de guardado. Se cuentan sin leer datos personales.
  const haceUnaHora = new Date(Date.now() - UNA_HORA_MS).toISOString();
  if (datosPersonales) {
    const recientes = await payload.count({
      collection: "pedidos",
      where: {
        and: [
          { telefono: { equals: datosPersonales.telefono } },
          { createdAt: { greater_than: haceUnaHora } },
        ],
      },
    });
    if (recientes.totalDocs >= PEDIDOS_POR_TELEFONO_Y_HORA) {
      return {
        ok: false,
        mensaje:
          "Ya enviaste varios pedidos en la última hora. Escríbenos por WhatsApp o inténtalo más tarde.",
      };
    }
  }
  const guardadosHora = await payload.count({
    collection: "pedidos",
    where: { createdAt: { greater_than: haceUnaHora } },
  });

  // Guardar nunca debe impedir que el pedido salga por WhatsApp.
  let numero: number | null = null;
  if (guardadosHora.totalDocs < PEDIDOS_GUARDADOS_POR_HORA) {
    try {
      const creado = await payload.create({
        collection: "pedidos",
        data: {
          items: datos.filas.map((fila) => {
            const producto = porSlug.get(fila.slug)!;
            return {
              producto: producto.id,
              nombreProducto: producto.nombre,
              presentacion: fila.presentacion,
              cantidad: fila.cantidad,
            };
          }),
          estado: "nuevo",
          zona: zona?.id,
          ciudad: datos.ciudad,
          cultivo: cultivo?.id,
          hectareas: datos.hectareas,
          destino: destino.tipo,
          nombre: datosPersonales?.nombre,
          telefono: datosPersonales?.telefono,
          aceptoPolitica: datosPersonales !== null,
        },
        overrideAccess: true,
      });
      numero = creado.id;
    } catch (error) {
      // Solo el tipo de error: el contenido puede traer datos del pedido.
      console.error(
        "[pedido] no se pudo guardar el pedido:",
        error instanceof Error ? error.name : "error",
      );
    }
  }

  const mensaje = construirMensaje({
    items: datos.filas.map((fila) => ({
      nombre: porSlug.get(fila.slug)!.nombre,
      presentacion: fila.presentacion,
      cantidad: fila.cantidad,
    })),
    numeroPedido: numero ?? undefined,
    nombre: datosPersonales?.nombre,
    zona: zona?.nombre,
    ciudad: datos.ciudad,
    cultivo: cultivo?.nombre,
    hectareas: datos.hectareas,
  });

  return { ok: true, url: urlWhatsapp(destino, mensaje), numero };
}

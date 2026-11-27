import { z } from "zod";

/** Límites del pedido (plan 04). Lo que llega del navegador no es confiable: se revalida siempre. */
export const LIMITE_FILAS = 20;
export const CANTIDAD_MINIMA = 1;
export const CANTIDAD_MAXIMA = 9999;
export const VERSION_ALMACEN = 1;

/** Presentación para productos que no tienen ninguna cargada. No es un dato inventado: remite al asesor. */
export const PRESENTACION_A_CONSULTAR = "A consultar con el asesor";

/** Valor de zona cuando la persona no sabe o no está en ninguna. */
export const ZONA_OTRA = "otra";

const slugSchema = z
  .string()
  .max(120)
  .regex(/^[\p{L}\p{N}-]+$/u);

export const esquemaFilaPedido = z.object({
  slug: slugSchema,
  presentacion: z.string().trim().min(1).max(40),
  cantidad: z.number().int().min(CANTIDAD_MINIMA).max(CANTIDAD_MAXIMA),
});

export type FilaPedido = z.infer<typeof esquemaFilaPedido>;

/** Contenido de `localStorage`. Versionado para poder descartar formatos viejos. */
export const esquemaAlmacenPedido = z.object({
  version: z.literal(VERSION_ALMACEN),
  filas: z.array(esquemaFilaPedido).max(LIMITE_FILAS),
});

export type AlmacenPedido = z.infer<typeof esquemaAlmacenPedido>;

function textoOpcional(max: number) {
  return z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((valor) => (valor ? valor : undefined));
}

const hectareas = z.preprocess(
  (valor) => {
    if (valor === undefined || valor === null) {
      return undefined;
    }
    if (typeof valor === "string") {
      const texto = valor.trim().replace(",", ".");
      return texto === "" ? undefined : Number(texto);
    }
    return valor;
  },
  z
    .number({ invalid_type_error: "Ingresa un número de hectáreas válido." })
    .finite()
    .min(0.1, "Las hectáreas deben ser al menos 0,1.")
    .max(100_000, "Revisa las hectáreas ingresadas.")
    .optional(),
);

const filasEnvio = z
  .array(esquemaFilaPedido)
  .min(1, "Tu pedido está vacío.")
  .max(LIMITE_FILAS);

const camposComunes = {
  filas: filasEnvio,
  zona: textoOpcional(120),
  ciudad: textoOpcional(80),
  cultivo: textoOpcional(120),
  hectareas,
};

/** Envío sin política publicada: no se piden ni se guardan datos personales. */
export const esquemaEnvioSinDatos = z.object(camposComunes);

/** Envío con política publicada: nombre, teléfono y aceptación obligatorios. */
export const esquemaEnvioConDatos = z.object({
  ...camposComunes,
  nombre: z.string().trim().min(2, "Ingresa tu nombre.").max(120),
  telefono: z.string().trim().min(6, "Ingresa un teléfono válido.").max(30),
  aceptoPolitica: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la política de privacidad." }),
  }),
});

export type EnvioSinDatos = z.infer<typeof esquemaEnvioSinDatos>;
export type EnvioConDatos = z.infer<typeof esquemaEnvioConDatos>;

/**
 * Carga los 6 productos reales documentados en docs/solicitados/6 productos/*.docx
 * (ver docs/planes/03-contenido-real-y-medios.md, paso 6). Requiere que el paso 5
 * (categorías, cultivos y plagas) ya se haya corrido: npm run seed:catalogo-real.
 * Sube la foto de cada producto a Medios. Idempotente por nombre de producto.
 * Ejecutar: npm run seed:productos-real
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getPayload } from "payload";

import config from "../payload.config.ts";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const CARPETA_PRODUCTOS = path.resolve(
  dirname,
  "../../docs/solicitados/6 productos",
);

function slugificar(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type FilaDosis = {
  cultivo: string;
  plaga?: string;
  dosis: string;
  nota?: string;
};

type DatosProducto = {
  nombre: string;
  categoria: string;
  cultivos: string[];
  plagas?: string[];
  registroSenasa?: string;
  presentaciones?: string[];
  ingredienteActivo?: string;
  formulacion?: string;
  composicion?: { elemento: string; valor: string }[];
  dosis: FilaDosis[];
  destacado?: boolean;
  carpeta: string;
  archivoFoto: string;
};

// --- Datos transcritos de cada .docx (ver docs/solicitados/6 productos) ---

const NOTA_ALMACIGOS_ESPARRAGO =
  "Almácigos: Aplicar 2 o 3 veces con intervalos de 10 días hasta antes del aporque. Campo definitivo: Aplicaciones a partir de los 30 días hasta la cosecha con intervalos de 2 o 3 veces con intervalos de cada 15 días.";

const CUAJADO: DatosProducto = {
  nombre: "Cuajado",
  categoria: "Bio nutricionales",
  cultivos: [
    "Manzano", "Peral", "Cerezo", "Ciruelo", "Tomate", "Ají", "Pimiento", "Páprika",
    "Vid", "Fresa", "Naranjo", "Mandarina", "Limón", "Tangelo", "Toronja", "Papa",
    "Café", "Algodón", "Espárrago", "Olivo", "Alcachofa", "Palto", "Piña", "Cacao",
    "Papaya", "Estevia", "Arroz",
  ],
  presentaciones: ["500 ml", "1 L", "20 L", "200 L"],
  formulacion: "Suspensión Concentrada",
  // Composición Química transcrita de la etiqueta real (CUAJADO.png).
  composicion: [
    { elemento: "Potasio", valor: "50.00%" },
    { elemento: "Azufre", valor: "0.70%" },
    { elemento: "Magnesio", valor: "0.70%" },
    { elemento: "Boro", valor: "0.07%" },
    { elemento: "Hierro", valor: "0.35%" },
    { elemento: "Zinc", valor: "0.17%" },
    { elemento: "Ácido fúlvico", valor: "0.70%" },
  ],
  destacado: true,
  carpeta: "CUAJADO",
  archivoFoto: "CUAJADO.png",
  dosis: [
    ...["Manzano", "Peral", "Cerezo", "Ciruelo"].map((cultivo) => ({
      cultivo,
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "Realizar de 2 a 3 aplicaciones luego del cuajado del fruto, siendo muy importante los tratamientos en el periodo de crecimiento y maduración del fruto.",
    })),
    ...["Tomate", "Ají", "Pimiento", "Páprika"].map((cultivo) => ({
      cultivo,
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "Empezar las aplicaciones al inicio del desarrollo vegetativo con una frecuencia de 10 días.",
    })),
    {
      cultivo: "Vid",
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "Iniciar las aplicaciones cuando los granos de la uva se encuentran en pleno crecimiento hasta el inicio de la maduración de los racimos.",
    },
    {
      cultivo: "Fresa",
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "Empezar las aplicaciones desde el inicio del desarrollo vegetativo, con una frecuencia de 10 días.",
    },
    ...["Naranjo", "Mandarina", "Limón", "Tangelo", "Toronja"].map((cultivo) => ({
      cultivo,
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "Empezar las aplicaciones desde el brotamiento hasta la cosecha, evitando hacer la aplicación durante el periodo de máxima floración.",
    })),
    {
      cultivo: "Papa",
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "Aplicaciones florales durante la floración y repetidas con un intervalo de 10 a 16 días.",
    },
    {
      cultivo: "Café",
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "Iniciar las aplicaciones luego del cuajado de los granos, con intervalo de 15 días.",
    },
    {
      cultivo: "Algodón",
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "Iniciar las aplicaciones cuando la planta tiene bellotas formadas y repetidas cada 10 a 15 días.",
    },
    {
      cultivo: "Espárrago",
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: NOTA_ALMACIGOS_ESPARRAGO,
    },
    {
      cultivo: "Olivo",
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "Iniciar las aplicaciones después del cuajado de las frutas y repetirlo con frecuencia de 10 a 15 días.",
    },
    {
      cultivo: "Alcachofa",
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "Aplicar luego de la formación del capítulo y después de cada 15 días hasta la cosecha.",
    },
    {
      cultivo: "Palto",
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "1era aplicación del cuajado y luego cada 20 días hasta la cosecha.",
    },
    ...["Piña", "Cacao"].map((cultivo) => ({
      cultivo,
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "Aplicar en fructificación, mezcla FOLIKELT CA-B-ZN y repetir cada 20 días.",
    })),
    {
      cultivo: "Papaya",
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "Aplicar a los 180 días en mezcla con FOLIKELT CA-B-ZN.",
    },
    {
      cultivo: "Estevia",
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "Aplicar a los 45 - 65 días después del transplante en mezcla con FOLIKELT CA-B-ZN.",
    },
    {
      cultivo: "Arroz",
      dosis: "500 ml - 1 L (200 L de agua)",
      nota: "Aplicar al 10% de espigado y 70% del espigado para cuajado y llenado de grano.",
    },
  ],
};

const KOALA: DatosProducto = {
  nombre: "Koala",
  categoria: "Fungicida",
  cultivos: ["Vid"],
  plagas: ["Oidiosis"],
  registroSenasa: "PQUA N° 2725-SENASA",
  presentaciones: ["500 ml", "1 L", "20 L", "200 L"],
  // Composición transcrita de la etiqueta real (KOALA.png).
  ingredienteActivo: "Azoxystrobin 200 g/L + Difenoconazole 125 g/L",
  formulacion: "Suspensión Concentrada (SC)",
  destacado: true,
  carpeta: "KOALA",
  archivoFoto: "KOALA.png",
  dosis: [
    {
      cultivo: "Vid",
      plaga: "Oidiosis",
      dosis: "0.5 L/ha",
      nota: "Periodo de carencia: 14 días. LMR: 2 ppm¹ / 3 ppm².",
    },
  ],
};

const LIGNOFOL: DatosProducto = {
  nombre: "Lignofol",
  categoria: "Bioestimulante",
  cultivos: [
    "Algodón", "Papa", "Arroz", "Trigo", "Cebada", "Vid", "Espárrago", "Café",
    "Cacao", "Palto", "Cítricos", "Mango", "Hortalizas", "Coliflor", "Brócoli",
    "Alcachofa", "Leguminosas", "Manzano", "Peral", "Melocotonero", "Ciruelo",
    "Cerezo", "Olivo", "Granadilla", "Maracuyá", "Papaya", "Páprika", "Ají",
    "Pimiento", "Tomate", "Rocoto",
  ],
  presentaciones: ["500 ml", "1 L", "20 L", "200 L"],
  carpeta: "LIGNOFOL",
  archivoFoto: "LIGNOFOL.png",
  dosis: [
    {
      cultivo: "Algodón",
      dosis: "250 - 500 mL/200 L",
      nota: "1° 45 días de la siembra. 2° Inicio de la floración. 3° Inicio de formación de bellota.",
    },
    {
      cultivo: "Papa",
      dosis: "250 - 500 mL/200 L",
      nota: "1° Brotamiento. 2° Crecimiento vegetativo. 3° Inicio de Tuberización.",
    },
    ...["Arroz", "Trigo", "Cebada"].map((cultivo) => ({
      cultivo,
      dosis: "250 - 500 mL/200 L",
      nota: "1° Después del trasplante (arroz). 2° Macollamiento. 3° Llenado de grano.",
    })),
    {
      cultivo: "Vid",
      dosis: "250 - 500 mL/200 L",
      nota: "1° Inicio del brotamiento. 2° A los 15 días después de la aplicación. 3° Floración.",
    },
    {
      cultivo: "Espárrago",
      dosis: "250 - 500 mL/200 L",
      nota: "1° Al inicio del brotamiento. 2° Crecimiento vegetativo.",
    },
    ...["Café", "Cacao"].map((cultivo) => ({
      cultivo,
      dosis: "250 - 500 mL/200 L",
      nota: "1° Al brotamiento. 2° Pre-Floración. 3° Al cuajado de frutos.",
    })),
    ...["Palto", "Cítricos", "Mango"].map((cultivo) => ({
      cultivo,
      dosis: "250 - 500 mL/200 L",
      nota: "1° Pre-Floración. 2° Cuajado de frutos. 3° Crecimiento de frutos.",
    })),
    {
      cultivo: "Hortalizas",
      dosis: "250 - 500 mL/200 L",
      nota: "1° Brotamiento. 2° Crecimiento vegetativo.",
    },
    ...["Coliflor", "Brócoli", "Alcachofa"].map((cultivo) => ({
      cultivo,
      dosis: "250 - 500 mL/200 L",
      nota: "1° 15 días después del trasplante. 2° Pre-Floración.",
    })),
    {
      cultivo: "Leguminosas",
      dosis: "250 - 500 mL/200 L",
      nota: "1° Pre-Floración. 2° Llenado de vainas.",
    },
    ...["Manzano", "Peral", "Melocotonero", "Ciruelo", "Cerezo", "Olivo"].map(
      (cultivo) => ({
        cultivo,
        dosis: "250 - 500 mL/200 L",
        nota: "1° Pre-Floración. 2° Después del cuajado de frutos.",
      }),
    ),
    ...["Granadilla", "Maracuyá"].map((cultivo) => ({
      cultivo,
      dosis: "250 - 500 mL/200 L",
      nota: "1° Desarrollo vegetativo. 2° Pre-Floración. 3° Llenado de fruto.",
    })),
    {
      cultivo: "Papaya",
      dosis: "250 - 500 mL/200 L",
      nota: "1° Crecimiento vegetativo. 2° En la floración. Repetir cada 20 días durante la cosecha.",
    },
    ...["Páprika", "Ají", "Pimiento", "Tomate", "Rocoto"].map((cultivo) => ({
      cultivo,
      dosis: "250 - 500 mL/200 L",
      nota: "1° Después del trasplante. 2° Pre-Floración. 3° Crecimiento del fruto.",
    })),
  ],
};

const NOT_FLY: DatosProducto = {
  nombre: "Not-Fly",
  categoria: "Insecticida agrícola",
  cultivos: ["Arroz"],
  plagas: ["Mosca minadora del arroz"],
  registroSenasa: "PQUA N° 3125-SENASA",
  // Composición transcrita de la etiqueta real (NOT FLY.png).
  ingredienteActivo: "Thiamethoxam 350 g/L + Fipronil 200 g/L",
  formulacion: "Suspensión Concentrada (SC)",
  carpeta: "NOT FLY",
  archivoFoto: "NOT FLY.png",
  dosis: [
    {
      cultivo: "Arroz",
      plaga: "Mosca minadora del arroz",
      dosis: "0.25 L/ha",
      nota: "Periodo de carencia: 29 días. LMR: 0.01 ppm¹ / 0.01 ppm².",
    },
  ],
};

const PK_65: DatosProducto = {
  nombre: "PK 65",
  categoria: "Fertilizante foliar",
  cultivos: [
    "Arroz", "Algodón", "Alcachofa", "Sandía", "Melón", "Zapallo", "Espárrago",
    "Frutales", "Hortalizas", "Maíz", "Papa", "Soya", "Frijol", "Tomate", "Ají",
    "Vid",
  ],
  presentaciones: ["1 L"],
  // Composición Química transcrita de la etiqueta real (PK65.png).
  composicion: [
    { elemento: "Fósforo (P2O5)", valor: "28.00%" },
    { elemento: "Potasio (K2O)", valor: "37.00%" },
    { elemento: "Nitrógeno Total", valor: "5.00%" },
    { elemento: "Hierro (Fe)", valor: "0.08%" },
    { elemento: "Manganeso (Mn)", valor: "0.06%" },
    { elemento: "Boro (B)", valor: "0.04%" },
    { elemento: "Zinc (Zn)", valor: "0.04%" },
    { elemento: "Molibdeno (Mo)", valor: "0.01%" },
    { elemento: "Cobalto (Co)", valor: "0.01%" },
    { elemento: "Vitaminas", valor: "0.1%" },
    { elemento: "Extracto de Algas", valor: "4.5%" },
  ],
  carpeta: "PK 65",
  archivoFoto: "PK65.png",
  dosis: [
    {
      cultivo: "Arroz",
      dosis: "1000 cc/ha",
      nota: "1.- En punto de algodón. 2.- Al cuajado de granos.",
    },
    {
      cultivo: "Algodón",
      dosis: "1000 cc/ha",
      nota: "1.- Al inicio del botón floral. 2.- A la formación de bellotas.",
    },
    {
      cultivo: "Alcachofa",
      dosis: "1000 cc/ha",
      nota: "1.- Al inicio de inflorescencia. 2.- Al llenado de frutos.",
    },
    ...["Sandía", "Melón", "Zapallo"].map((cultivo) => ({
      cultivo,
      dosis: "1000 cc/ha",
      nota: "1.- En prefloración. 2.- Al llenado de frutos.",
    })),
    {
      cultivo: "Espárrago",
      dosis: "1000 cc/ha",
      nota: "Aplicar en desarrollo del primero y segundo brote.",
    },
    {
      cultivo: "Frutales",
      dosis: "1000 cc/ha",
      nota: "1.- En prefloración. 2.- Al inicio de la floración.",
    },
    {
      cultivo: "Hortalizas",
      dosis: "1000 cc/ha",
      nota: "A los 2 días después de la siembra.",
    },
    {
      cultivo: "Maíz",
      dosis: "1000 cc/ha",
      nota: "1.- En prefloración. 2.- Al inicio de la floración.",
    },
    {
      cultivo: "Papa",
      dosis: "1000 cc/ha",
      nota: "1.- En sarcillo o botón floral. 2.- Al llenado de los tubérculos.",
    },
    ...["Soya", "Frijol"].map((cultivo) => ({
      cultivo,
      dosis: "1000 cc/ha",
      nota: "1.- Al inicio del botón floral. 2.- 15 días después de la primera.",
    })),
    ...["Tomate", "Ají"].map((cultivo) => ({
      cultivo,
      dosis: "1000 cc/ha",
      nota: "1.- Al inicio de la floración. 2.- Después de 15 días de la primera.",
    })),
    {
      cultivo: "Vid",
      dosis: "1000 cc/ha",
      nota: "1.- En prefloración. 2.- Al cuajado. 3.- Al llenado de racimos.",
    },
  ],
};

const TODYM: DatosProducto = {
  nombre: "Todym",
  categoria: "Fungicida",
  cultivos: ["Café", "Espárrago", "Vid"],
  plagas: ["Roya del cafeto", "Mancha del peral", "Oidiosis"],
  registroSenasa: "PQUA N° 3584-SENASA",
  // Composición transcrita de la etiqueta real (TODYM.png).
  ingredienteActivo: "Azoxystrobin 250 g/kg + Tebuconazole 500 g/kg",
  formulacion: "Gránulos Dispersables (WG)",
  carpeta: "TODYM",
  archivoFoto: "TODYM.png",
  dosis: [
    {
      cultivo: "Café",
      plaga: "Roya del cafeto",
      dosis: "0.2% en 200 L de agua",
      nota:
        "Periodo de carencia: 30 días. LMR: 0.03 ppm azoxistrobina + 0.15 ppm tebuconazol. Unidad de dosis POR CONFIRMAR: la columna de la tabla original está cortada en el documento entregado.",
    },
    {
      cultivo: "Espárrago",
      plaga: "Mancha del peral",
      dosis: "0.3 (unidad POR CONFIRMAR) por hectárea, en 200 L de agua",
      nota:
        "Periodo de carencia: 40 días. LMR: 0.04 ppm azoxistrobina + 0.05 ppm tebuconazol. Unidad de dosis POR CONFIRMAR: la columna de la tabla original está cortada en el documento entregado.",
    },
    {
      cultivo: "Vid",
      plaga: "Oidiosis",
      dosis: "0.25 (unidad POR CONFIRMAR) por hectárea, en 200 L de agua",
      nota:
        "Periodo de carencia: 14 días. LMR: 3 ppm azoxistrobina + 0.5 ppm tebuconazol. Unidad de dosis POR CONFIRMAR: la columna de la tabla original está cortada en el documento entregado.",
    },
  ],
};

const PRODUCTOS: DatosProducto[] = [CUAJADO, KOALA, LIGNOFOL, NOT_FLY, PK_65, TODYM];

type PayloadLocal = Awaited<ReturnType<typeof getPayload>>;

async function idPorNombre(
  payload: PayloadLocal,
  coleccion: "categorias" | "cultivos" | "plagas",
  nombre: string,
): Promise<number> {
  const resultado = await payload.find({
    collection: coleccion,
    limit: 1,
    depth: 0,
    where: { nombre: { equals: nombre } },
  });
  const doc = resultado.docs[0];
  if (!doc) {
    throw new Error(
      `No existe "${nombre}" en ${coleccion}. Corre primero npm run seed:catalogo-real.`,
    );
  }
  return doc.id;
}

async function subirFotoProducto(
  payload: PayloadLocal,
  datos: DatosProducto,
): Promise<number> {
  const ruta = path.join(CARPETA_PRODUCTOS, datos.carpeta, datos.archivoFoto);
  const data = fs.readFileSync(ruta);
  const medio = await payload.create({
    collection: "medios",
    data: { alt: `Envase de ${datos.nombre}` },
    file: {
      data,
      mimetype: "image/png",
      name: slugificar(datos.nombre) + ".png",
      size: data.length,
    },
  });
  return medio.id;
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error("seed:productos-real no se ejecuta con NODE_ENV=production.");
    process.exit(1);
  }

  const payload = await getPayload({ config });

  let creados = 0;
  let actualizados = 0;
  for (const datos of PRODUCTOS) {
    const existente = await payload.find({
      collection: "productos",
      limit: 1,
      depth: 0,
      where: { nombre: { equals: datos.nombre } },
    });
    const doc = existente.docs[0];
    if (doc) {
      const actualizacion: Record<string, unknown> = {};
      if (datos.ingredienteActivo && !doc.ingredienteActivo) {
        actualizacion.ingredienteActivo = datos.ingredienteActivo;
      }
      if (datos.formulacion && !doc.formulacion) {
        actualizacion.formulacion = datos.formulacion;
      }
      if (datos.composicion && (!doc.composicion || doc.composicion.length === 0)) {
        actualizacion.composicion = datos.composicion;
      }
      if (Object.keys(actualizacion).length > 0) {
        await payload.update({
          collection: "productos",
          id: doc.id,
          data: actualizacion,
          draft: false,
        });
        actualizados++;
        console.log(
          `Actualizado "${datos.nombre}": ${Object.keys(actualizacion).join(", ")}.`,
        );
      } else {
        console.log(`Ya existe "${datos.nombre}" con esos campos completos, se omite.`);
      }
      continue;
    }

    const categoriaId = await idPorNombre(payload, "categorias", datos.categoria);
    const cultivoIds = await Promise.all(
      datos.cultivos.map((nombre) => idPorNombre(payload, "cultivos", nombre)),
    );
    const plagaIds = datos.plagas
      ? await Promise.all(
          datos.plagas.map((nombre) => idPorNombre(payload, "plagas", nombre)),
        )
      : [];
    const imagenId = await subirFotoProducto(payload, datos);

    const dosis = await Promise.all(
      datos.dosis.map(async (fila) => ({
        cultivo: await idPorNombre(payload, "cultivos", fila.cultivo),
        plaga: fila.plaga
          ? await idPorNombre(payload, "plagas", fila.plaga)
          : undefined,
        dosis: fila.dosis,
        nota: fila.nota,
      })),
    );

    await payload.create({
      collection: "productos",
      data: {
        nombre: datos.nombre,
        slug: slugificar(datos.nombre),
        categoria: categoriaId,
        cultivos: cultivoIds,
        plagas: plagaIds.length > 0 ? plagaIds : undefined,
        registroSenasa: datos.registroSenasa,
        presentaciones: datos.presentaciones?.map((etiqueta) => ({ etiqueta })),
        ingredienteActivo: datos.ingredienteActivo,
        formulacion: datos.formulacion,
        composicion: datos.composicion,
        galeria: [imagenId],
        destacado: datos.destacado ?? false,
        dosis,
        // Sin esto Payload crea en borrador (valor por defecto de _status) y el pedido no lo ve.
        _status: "published",
      },
      draft: false,
    });
    creados++;
    console.log(`Creado: ${datos.nombre} (${datos.dosis.length} filas de dosis).`);
  }

  console.log(
    `Productos creados: ${creados}/${PRODUCTOS.length}. Actualizados: ${actualizados}/${PRODUCTOS.length}.`,
  );
  process.exit(0);
}

try {
  await main();
} catch (error: unknown) {
  console.error("Error en seed:productos-real");
  console.error(error);
  process.exit(1);
}

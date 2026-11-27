/**
 * Carga categorías, cultivos y plagas reales a partir de los 6 productos documentados en
 * docs/solicitados/6 productos/*.docx (ver docs/planes/03-contenido-real-y-medios.md, paso 5).
 * Sube además las 3 fotos de cultivo entregadas (Palto, Arándano, Vid) a Medios.
 * Idempotente: si el nombre ya existe, no lo duplica. No carga productos (paso 6).
 * Ejecutar: npm run seed:catalogo-real
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getPayload } from "payload";

import config from "../payload.config.ts";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const CARPETA_FOTOS_CULTIVOS = path.resolve(
  dirname,
  "../../docs/solicitados/cultivos",
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

const CATEGORIAS = [
  "Bio nutricionales",
  "Fungicida",
  "Bioestimulante",
  "Insecticida agrícola",
  "Fertilizante foliar",
];

// Cultivos que aparecen en CUAJADO, KOALA, LIGNOFOL, NOT FLY, PK 65 y TODYM, más
// Arándano (foto entregada, sin producto propio todavía en el lote de 6).
const CULTIVOS = [
  "Manzano", "Peral", "Cerezo", "Ciruelo", "Tomate", "Ají", "Pimiento", "Páprika",
  "Vid", "Fresa", "Naranjo", "Mandarina", "Limón", "Tangelo", "Toronja", "Papa",
  "Café", "Algodón", "Espárrago", "Olivo", "Alcachofa", "Palto", "Piña", "Cacao",
  "Papaya", "Estevia", "Arroz", "Trigo", "Cebada", "Cítricos", "Mango", "Hortalizas",
  "Coliflor", "Brócoli", "Leguminosas", "Melocotonero", "Granadilla", "Maracuyá",
  "Rocoto", "Sandía", "Melón", "Zapallo", "Frutales", "Maíz", "Soya", "Frijol",
  "Arándano",
];

const CULTIVOS_CON_FOTO: Record<string, string> = {
  Palto: "PALTO.jpeg",
  Arándano: "ARANDANO 1.jpeg",
  Vid: "VID.jpeg",
};

const PLAGAS = [
  "Oidiosis",
  "Roya del cafeto",
  "Mancha del peral",
  "Mosca minadora del arroz",
];

type PayloadLocal = Awaited<ReturnType<typeof getPayload>>;

async function subirFotoCultivo(
  payload: PayloadLocal,
  archivo: string,
  alt: string,
): Promise<number> {
  const ruta = path.join(CARPETA_FOTOS_CULTIVOS, archivo);
  const data = fs.readFileSync(ruta);
  const medio = await payload.create({
    collection: "medios",
    data: { alt },
    file: {
      data,
      mimetype: "image/jpeg",
      name: archivo.toLowerCase().replace(/\s+/g, "-"),
      size: data.length,
    },
  });
  return medio.id;
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error("seed:catalogo-real no se ejecuta con NODE_ENV=production.");
    process.exit(1);
  }

  const payload = await getPayload({ config });

  let categoriasCreadas = 0;
  for (const [indice, nombre] of CATEGORIAS.entries()) {
    const existente = await payload.find({
      collection: "categorias",
      limit: 1,
      depth: 0,
      where: { nombre: { equals: nombre } },
    });
    if (existente.docs.length > 0) {
      continue;
    }
    await payload.create({
      collection: "categorias",
      data: {
        nombre,
        slug: slugificar(nombre),
        orden: indice,
        // Sin esto Payload crea en borrador y la web pública no lo muestra.
        _status: "published",
      },
      draft: false,
    });
    categoriasCreadas++;
  }

  let cultivosCreados = 0;
  let fotosSubidas = 0;
  for (const nombre of CULTIVOS) {
    const existente = await payload.find({
      collection: "cultivos",
      limit: 1,
      depth: 0,
      where: { nombre: { equals: nombre } },
    });
    if (existente.docs.length > 0) {
      continue;
    }

    const archivoFoto = CULTIVOS_CON_FOTO[nombre];
    let imagenId: number | undefined;
    if (archivoFoto) {
      imagenId = await subirFotoCultivo(
        payload,
        archivoFoto,
        `Cultivo de ${nombre.toLowerCase()}`,
      );
      fotosSubidas++;
    }

    await payload.create({
      collection: "cultivos",
      data: {
        nombre,
        slug: slugificar(nombre),
        ...(imagenId ? { imagen: imagenId } : {}),
        _status: "published",
      },
      draft: false,
    });
    cultivosCreados++;
  }

  let plagasCreadas = 0;
  for (const nombre of PLAGAS) {
    const existente = await payload.find({
      collection: "plagas",
      limit: 1,
      depth: 0,
      where: { nombre: { equals: nombre } },
    });
    if (existente.docs.length > 0) {
      continue;
    }
    await payload.create({
      collection: "plagas",
      data: { nombre, slug: slugificar(nombre), _status: "published" },
      draft: false,
    });
    plagasCreadas++;
  }

  console.log(
    `Categorías creadas: ${categoriasCreadas}/${CATEGORIAS.length}. ` +
      `Cultivos creados: ${cultivosCreados}/${CULTIVOS.length} (${fotosSubidas} con foto). ` +
      `Plagas creadas: ${plagasCreadas}/${PLAGAS.length}.`,
  );
  process.exit(0);
}

try {
  await main();
} catch (error: unknown) {
  console.error("Error en seed:catalogo-real");
  console.error(error);
  process.exit(1);
}

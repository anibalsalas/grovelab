/**
 * Semilla del global textos-sitio. Contacto, historia, titular y subtítulo de
 * portada vienen de los datos reales entregados por Grovelab
 * (contenido-grovelab-2026.ts); solo los servicios siguen del sitio legacy
 * (grovelabperu.com.pe, 2019) hasta que haya reemplazo real para ese campo.
 * Ejecutar: npm run seed:textos-sitio
 * Por defecto solo rellena campos vacíos. SEED_TEXTOS_FORCE=1 sobrescribe institucional.
 */
import { getPayload } from "payload";

import config from "../payload.config.ts";
import { contenidoGrovelab2026 } from "./contenido-grovelab-2026.ts";
import { contenidoTextosLegacy } from "./contenido-textos-legacy.ts";

function forzarSemilla(): boolean {
  return process.env.SEED_TEXTOS_FORCE === "1";
}

function vacio(valor: string | null | undefined): boolean {
  return !valor?.trim();
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "seed:textos-sitio no se ejecuta con NODE_ENV=production.",
    );
    process.exit(1);
  }

  const payload = await getPayload({ config });
  const actual = await payload.findGlobal({
    slug: "textos-sitio",
    depth: 0,
  });

  const forzar = forzarSemilla();
  const bloquesActuales = actual.nosotros?.bloques?.length ?? 0;
  const serviciosActuales = actual.servicios?.length ?? 0;

  const data: Record<string, unknown> = {};

  if (forzar || vacio(actual.titularPortada)) {
    data.titularPortada = contenidoGrovelab2026.titularPortada;
  }
  if (forzar || vacio(actual.subtituloPortada)) {
    data.subtituloPortada = contenidoGrovelab2026.subtituloPortada;
  }

  const contacto = actual.contacto ?? {};
  const contactoNuevo: Record<string, string> = {};
  if (forzar || vacio(contacto.telefono)) {
    contactoNuevo.telefono = contenidoGrovelab2026.contacto.telefono;
  }
  if (forzar || vacio(contacto.correo)) {
    contactoNuevo.correo = contenidoGrovelab2026.contacto.correo;
  }
  if (forzar || vacio(contacto.direccion)) {
    contactoNuevo.direccion = contenidoGrovelab2026.contacto.direccion;
  }
  if (forzar || vacio(contacto.urlMapa)) {
    contactoNuevo.urlMapa = contenidoGrovelab2026.contacto.urlMapa;
  }
  if (Object.keys(contactoNuevo).length > 0) {
    data.contacto = { ...contacto, ...contactoNuevo };
  }

  if (forzar || vacio(actual.serviciosLead)) {
    data.serviciosLead = contenidoTextosLegacy.serviciosLead;
  }

  if (forzar || serviciosActuales === 0) {
    data.servicios = contenidoTextosLegacy.servicios.map((s) => ({
      titulo: s.titulo,
      descripcion: s.descripcion,
    }));
  }

  const leadActual = actual.nosotros?.descripcionLead;
  if (forzar || bloquesActuales === 0 || vacio(leadActual)) {
    data.nosotros = {
      descripcionLead: contenidoGrovelab2026.nosotros.descripcionLead,
      bloques: contenidoGrovelab2026.nosotros.bloques.map((b) => ({
        titulo: b.titulo,
        cuerpo: b.cuerpo,
      })),
    };
  }

  if (Object.keys(data).length === 0) {
    console.log("Nada que actualizar en textos-sitio.");
    process.exit(0);
  }

  await payload.updateGlobal({
    slug: "textos-sitio",
    data,
    overrideAccess: true,
  });

  console.log(
    "Global textos-sitio actualizado (contacto, historia y subtítulo: datos reales de Grovelab, 2026; servicios: aún del sitio 2019). Revisar en Admin antes de producción.",
  );
}

try {
  await main();
} catch (error: unknown) {
  console.error("Error en seed:textos-sitio");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
}

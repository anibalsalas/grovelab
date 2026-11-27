import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Guarda contra una fuga ya ocurrida: la Local API de Payload ignora el acceso
 * por defecto (`overrideAccess: true`), así que una consulta pública sin más
 * devuelve también los borradores. Toda lectura de estas colecciones desde la
 * web debe usar `overrideAccess: false` o filtrar `_status` de forma explícita.
 */
const COLECCIONES_CON_BORRADORES = [
  "categorias",
  "cultivos",
  "plagas",
  "productos",
  "noticias",
  "zonas-comerciales",
];

const RAIZ = path.resolve(__dirname, "..");
// La semilla corre con permisos de administrador a propósito; los tests no son código público.
const EXCLUIDOS = [`${path.sep}seed${path.sep}`, ".test.ts", "payload-types.ts"];

function archivos(dir: string): string[] {
  return readdirSync(dir).flatMap((nombre) => {
    const ruta = path.join(dir, nombre);
    if (statSync(ruta).isDirectory()) {
      return archivos(ruta);
    }
    return /\.(ts|tsx)$/.test(ruta) && !EXCLUIDOS.some((x) => ruta.includes(x))
      ? [ruta]
      : [];
  });
}

/** Texto de la llamada completa, desde `payload.find({` hasta su llave de cierre. */
function cuerpoDeLlamada(texto: string, inicio: number): string {
  let profundidad = 0;
  for (let i = inicio; i < texto.length; i++) {
    if (texto[i] === "{") profundidad++;
    if (texto[i] === "}") {
      profundidad--;
      if (profundidad === 0) return texto.slice(inicio, i + 1);
    }
  }
  return texto.slice(inicio);
}

describe("consultas públicas a Payload", () => {
  const sinProteger: string[] = [];
  let revisadas = 0;

  for (const archivo of archivos(RAIZ)) {
    const texto = readFileSync(archivo, "utf8");
    for (const m of texto.matchAll(/payload\.(find|count)\(\{/g)) {
      const cuerpo = cuerpoDeLlamada(texto, (m.index ?? 0) + m[0].length - 1);
      const coleccion = cuerpo.match(/collection:\s*"([^"]+)"/)?.[1];
      if (!coleccion || !COLECCIONES_CON_BORRADORES.includes(coleccion)) {
        continue;
      }
      revisadas++;
      const protegida =
        /overrideAccess:\s*false/.test(cuerpo) || /_status/.test(cuerpo);
      if (!protegida) {
        const linea = texto.slice(0, m.index).split("\n").length;
        sinProteger.push(`${path.relative(RAIZ, archivo)}:${linea} (${coleccion})`);
      }
    }
  }

  it("encuentra consultas que revisar", () => {
    expect(revisadas).toBeGreaterThan(10);
  });

  it("todas filtran borradores (overrideAccess: false o _status)", () => {
    expect(sinProteger).toEqual([]);
  });
});

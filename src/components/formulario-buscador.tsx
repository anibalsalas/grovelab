import Link from "next/link";

import { EncabezadoSeccion } from "@/components/ui/encabezado-seccion";
import { BotonEnlace } from "@/components/ui/boton-enlace";
import {
  claseCampoFormulario,
  clasePanelFormulario,
} from "@/lib/clases-sitio";
import type { BuscarQuery } from "@/lib/buscar-query.ts";

type Opcion = {
  slug: string;
  nombre: string;
};

type FormularioBuscadorProps = {
  accion?: string;
  titulo?: string;
  /** En false solo se muestra el formulario (p. ej. cuando la página ya tiene H1). */
  mostrarIntro?: boolean;
  valoresIniciales?: BuscarQuery;
  cultivos: Opcion[];
  plagas: Opcion[];
  categorias: Opcion[];
};

const etiquetaCampo = "block text-sm font-semibold text-texto";

export function FormularioBuscador({
  accion = "/buscar",
  titulo = "Buscar productos",
  mostrarIntro = true,
  valoresIniciales,
  cultivos,
  plagas,
  categorias,
}: FormularioBuscadorProps) {
  const hayFiltros = Boolean(
    valoresIniciales?.q ||
      valoresIniciales?.cultivo ||
      valoresIniciales?.plaga ||
      valoresIniciales?.categoria,
  );

  return (
    <div className="w-full max-w-3xl mx-auto" aria-labelledby="buscador-titulo">
      {mostrarIntro ? (
        <EncabezadoSeccion
          id="buscador-titulo"
          destacado="Catálogo"
          titulo={titulo}
          descripcion="Filtra por cultivo, plaga, categoría o palabra clave."
        />
      ) : (
        <h2 id="buscador-titulo" className="sr-only">{titulo}</h2>
      )}
      <form
        action={accion}
        method="get"
        className={`${clasePanelFormulario} grid gap-4 md:grid-cols-3 ${mostrarIntro ? "mt-6" : "mt-4"}`}
      >
        <label className="block md:col-span-3">
          <span className={etiquetaCampo}>Palabra clave</span>
          <input
            type="search"
            name="q"
            defaultValue={valoresIniciales?.q ?? ""}
            maxLength={200}
            className={claseCampoFormulario}
            placeholder="Nombre o uso del producto"
          />
        </label>
        <label className="block">
          <span className={etiquetaCampo}>Cultivo</span>
          <select
            name="cultivo"
            defaultValue={valoresIniciales?.cultivo ?? ""}
            className={claseCampoFormulario}
          >
            <option value="">Todos</option>
            {cultivos.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={etiquetaCampo}>Plaga</span>
          <select
            name="plaga"
            defaultValue={valoresIniciales?.plaga ?? ""}
            className={claseCampoFormulario}
          >
            <option value="">Todas</option>
            {plagas.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={etiquetaCampo}>Categoría</span>
          <select
            name="categoria"
            defaultValue={valoresIniciales?.categoria ?? ""}
            className={claseCampoFormulario}
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
        <div
          className="flex flex-wrap items-center gap-3 border-t border-marca/15 pt-4 md:col-span-3"
        >
          <BotonEnlace type="submit" variante="primario">
            Buscar
          </BotonEnlace>
          <Link
            href="/cultivos"
            className="inline-flex min-h-11 items-center rounded-m px-2 text-sm font-medium text-marca underline-offset-4 hover:underline"
          >
            Ver cultivos
          </Link>
          {hayFiltros ? (
            <Link
              href="/buscar"
              className="inline-flex min-h-11 items-center rounded-m px-2 text-sm font-medium text-marca underline-offset-4 hover:underline"
            >
              Quitar filtros
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}

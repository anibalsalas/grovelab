"use client";

import { usePathname, useRouter } from "next/navigation";
import { useId, useRef, useState, type FormEvent } from "react";

import { BotonEnlace } from "@/components/ui/boton-enlace";
import { claseCampoFormulario, clasePanelFormulario } from "@/lib/clases-sitio";

type Opcion = { slug: string; nombre: string };

type Filtros = {
  q: string;
  cultivo: string;
  plaga: string;
  categoria: string;
};

type PanelFiltrosProductosProps = {
  cultivos: Opcion[];
  plagas: Opcion[];
  categorias: Opcion[];
  valoresIniciales: {
    q?: string;
    cultivo?: string;
    plaga?: string;
    categoria?: string;
  };
};

const etiquetaCampo = "block text-sm font-semibold text-texto";

function construirUrl(pathname: string, filtros: Filtros): string {
  const params = new URLSearchParams();
  if (filtros.q) params.set("q", filtros.q);
  if (filtros.cultivo) params.set("cultivo", filtros.cultivo);
  if (filtros.plaga) params.set("plaga", filtros.plaga);
  if (filtros.categoria) params.set("categoria", filtros.categoria);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function PanelFiltrosProductos({
  cultivos,
  plagas,
  categorias,
  valoresIniciales,
}: PanelFiltrosProductosProps) {
  const router = useRouter();
  const pathname = usePathname();
  const panelId = useId();

  const hayFiltrosIniciales = Boolean(
    valoresIniciales.q ||
      valoresIniciales.cultivo ||
      valoresIniciales.plaga ||
      valoresIniciales.categoria,
  );

  const [abierto, setAbierto] = useState(hayFiltrosIniciales);
  const [filtros, setFiltros] = useState<Filtros>({
    q: valoresIniciales.q ?? "",
    cultivo: valoresIniciales.cultivo ?? "",
    plaga: valoresIniciales.plaga ?? "",
    categoria: valoresIniciales.categoria ?? "",
  });
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  function aplicar(siguientes: Filtros) {
    setFiltros(siguientes);
    router.push(construirUrl(pathname, siguientes), { scroll: false });
  }

  function onCambioSelect(campo: "cultivo" | "plaga" | "categoria", valor: string) {
    if (temporizador.current) {
      clearTimeout(temporizador.current);
    }
    aplicar({ ...filtros, [campo]: valor });
  }

  function onCambioTexto(valor: string) {
    const siguientes = { ...filtros, q: valor };
    setFiltros(siguientes);
    if (temporizador.current) {
      clearTimeout(temporizador.current);
    }
    temporizador.current = setTimeout(() => {
      aplicar(siguientes);
    }, 400);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (temporizador.current) {
      clearTimeout(temporizador.current);
    }
    aplicar(filtros);
  }

  function onQuitarFiltros() {
    if (temporizador.current) {
      clearTimeout(temporizador.current);
    }
    setFiltros({ q: "", cultivo: "", plaga: "", categoria: "" });
    router.push(pathname, { scroll: false });
  }

  const hayFiltrosActivos = Boolean(
    filtros.q || filtros.cultivo || filtros.plaga || filtros.categoria,
  );

  return (
    <div className="mt-8">
      <div className="min-[48rem]:hidden">
        <button
          type="button"
          className="inline-flex min-h-11 items-center rounded-m border border-marca/25 px-4 text-sm font-medium text-marca"
          aria-expanded={abierto}
          aria-controls={panelId}
          onClick={() => setAbierto((valor) => !valor)}
        >
          {abierto ? "Ocultar filtros" : "Filtrar"}
        </button>
      </div>

      <form
        id={panelId}
        action={pathname}
        method="get"
        onSubmit={onSubmit}
        className={`${clasePanelFormulario} mt-4 grid gap-4 md:grid-cols-4 ${
          abierto ? "block" : "hidden"
        } min-[48rem]:block`}
      >
        <label className="block md:col-span-4">
          <span className={etiquetaCampo}>Buscar por palabra</span>
          <input
            type="search"
            name="q"
            value={filtros.q}
            onChange={(event) => onCambioTexto(event.target.value)}
            maxLength={200}
            className={claseCampoFormulario}
            placeholder="Nombre o uso del producto"
          />
        </label>

        <label className="block">
          <span className={etiquetaCampo}>Cultivo</span>
          <select
            name="cultivo"
            value={filtros.cultivo}
            onChange={(event) => onCambioSelect("cultivo", event.target.value)}
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
          <span className={etiquetaCampo}>Plaga objetivo</span>
          <select
            name="plaga"
            value={filtros.plaga}
            onChange={(event) => onCambioSelect("plaga", event.target.value)}
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
            value={filtros.categoria}
            onChange={(event) => onCambioSelect("categoria", event.target.value)}
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

        <div className="flex flex-wrap items-center gap-3 border-t border-marca/15 pt-4 md:col-span-4">
          <BotonEnlace type="submit" variante="primario">
            Aplicar filtros
          </BotonEnlace>
          {hayFiltrosActivos ? (
            <button
              type="button"
              onClick={onQuitarFiltros}
              className="inline-flex min-h-11 items-center rounded-m px-2 text-sm font-medium text-marca underline-offset-4 hover:underline"
            >
              Quitar filtros
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

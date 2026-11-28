"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { RUTA_PRODUCTOS } from "@/lib/catalogo-productos.ts";

import type { ModoHistorial } from "./use-filtros-url";
import estilos from "./catalogo.module.css";

/** Pausa tras la última tecla antes de buscar. */
export const RETARDO_BUSQUEDA_MS = 300;

type BarraBusquedaCatalogoProps = {
  /** Texto de búsqueda que hoy tiene la URL. */
  valor: string;
  onBuscar: (texto: string, modo: ModoHistorial) => void;
};

/**
 * Búsqueda en vivo: filtra 300 ms después de la última tecla y, además, de inmediato con
 * Enter o con la lupa. Mientras se escribe reemplaza la entrada del historial (no la llena
 * de una entrada por palabra); Enter o la lupa sí crean una. La caja nunca se bloquea ni se
 * reescribe mientras la persona teclea: solo se sincroniza con la URL si el cambio vino de
 * otro lado (quitar un chip, «Limpiar filtros», Atrás/Adelante).
 */
export function BarraBusquedaCatalogo({ valor, onBuscar }: BarraBusquedaCatalogoProps) {
  const idCampo = useId();
  const entrada = useRef<HTMLInputElement>(null);
  const [texto, setTexto] = useState(valor);
  /** Último texto que esta caja mandó a la URL; distingue el eco propio de un cambio externo. */
  const ultimoEnviado = useRef(valor);

  useEffect(() => {
    if (valor !== ultimoEnviado.current) {
      ultimoEnviado.current = valor;
      setTexto(valor);
    }
  }, [valor]);

  useEffect(() => {
    const limpio = texto.trim();
    if (limpio === ultimoEnviado.current) {
      return;
    }
    const temporizador = setTimeout(() => {
      ultimoEnviado.current = limpio;
      onBuscar(limpio, "replace");
    }, RETARDO_BUSQUEDA_MS);
    return () => clearTimeout(temporizador);
  }, [texto, onBuscar]);

  function buscarAhora(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const limpio = texto.trim();
    ultimoEnviado.current = limpio;
    onBuscar(limpio, "push");
    // En pantallas táctiles se cierra el teclado para ver los resultados.
    if (window.matchMedia("(pointer: coarse)").matches) {
      entrada.current?.blur();
    }
  }

  function borrarTexto() {
    setTexto("");
    ultimoEnviado.current = "";
    onBuscar("", "push");
    entrada.current?.focus();
  }

  return (
    <form
      role="search"
      action={RUTA_PRODUCTOS}
      method="get"
      onSubmit={buscarAhora}
      className={estilos.busqueda}
    >
      <label htmlFor={idCampo} className="sr-only">
        Buscar productos
      </label>
      <input
        ref={entrada}
        id={idCampo}
        type="search"
        name="q"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        maxLength={200}
        autoComplete="off"
        enterKeyHint="search"
        placeholder="Nombre, cultivo o plaga"
        className={estilos.entrada}
      />
      {texto ? (
        <button
          type="button"
          className={estilos.borrar}
          aria-label="Borrar búsqueda"
          onClick={borrarTexto}
        >
          <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
            <path d="M2.5 2.5 9.5 9.5M9.5 2.5 2.5 9.5" />
          </svg>
        </button>
      ) : null}
      <button type="submit" className={estilos.lupa} aria-label="Buscar">
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <circle cx="9" cy="9" r="6" />
          <path d="M13.5 13.5 18 18" />
        </svg>
      </button>
    </form>
  );
}

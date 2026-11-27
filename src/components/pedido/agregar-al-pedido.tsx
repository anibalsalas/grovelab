"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";

import { BotonEnlace } from "@/components/ui/boton-enlace";
import {
  CANTIDAD_MAXIMA,
  CANTIDAD_MINIMA,
  LIMITE_FILAS,
} from "@/lib/pedido/esquema.ts";
import { usePedido } from "@/lib/pedido/usar-pedido.ts";

import estilos from "./pedido.module.css";

type AgregarAlPedidoProps = {
  slug: string;
  nombre: string;
  /** Ya resueltas en el servidor; si el producto no tiene ninguna llega «A consultar con el asesor». */
  presentaciones: string[];
};

export function AgregarAlPedido({
  slug,
  nombre,
  presentaciones,
}: AgregarAlPedidoProps) {
  const { filas, agregar } = usePedido();
  const idGrupo = useId();
  const idCantidad = useId();
  const idError = useId();
  const grupoRef = useRef<HTMLFieldSetElement>(null);

  const [seleccion, setSeleccion] = useState<string | null>(
    presentaciones.length === 1 ? (presentaciones[0] ?? null) : null,
  );
  const [cantidadTexto, setCantidadTexto] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [confirmacion, setConfirmacion] = useState<string | null>(null);

  const lleno = filas.length >= LIMITE_FILAS;
  const yaEnPedido =
    seleccion !== null &&
    filas.some((f) => f.slug === slug && f.presentacion === seleccion);
  const sinCupo = lleno && !yaEnPedido;

  function ajustarCantidad(delta: number) {
    const actual = Number.parseInt(cantidadTexto, 10);
    const base = Number.isFinite(actual) ? actual : CANTIDAD_MINIMA;
    const nueva = Math.min(CANTIDAD_MAXIMA, Math.max(CANTIDAD_MINIMA, base + delta));
    setCantidadTexto(String(nueva));
    setError(null);
  }

  function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setConfirmacion(null);

    if (seleccion === null) {
      setError("Elige una presentación.");
      grupoRef.current?.querySelector<HTMLInputElement>("input")?.focus();
      return;
    }
    const cantidad = Number(cantidadTexto);
    if (
      !Number.isInteger(cantidad) ||
      cantidad < CANTIDAD_MINIMA ||
      cantidad > CANTIDAD_MAXIMA
    ) {
      setError(
        `Ingresa una cantidad entre ${CANTIDAD_MINIMA} y ${CANTIDAD_MAXIMA}.`,
      );
      document.getElementById(idCantidad)?.focus();
      return;
    }

    const resultado = agregar({ slug, presentacion: seleccion, cantidad });
    if (resultado === "agregado") {
      setError(null);
      setConfirmacion(`Agregaste ${nombre}, ${seleccion} × ${cantidad}.`);
    } else if (resultado === "lleno") {
      setError(
        `Tu pedido ya tiene ${LIMITE_FILAS} productos. Envíalo o quita alguno.`,
      );
    } else if (resultado === "no-guardado") {
      setError(
        "No pudimos guardar tu pedido en este navegador. Prueba con otra ventana o usa «Pedir información».",
      );
    } else {
      setError("Revisa la presentación y la cantidad.");
    }
  }

  return (
    <form
      className={estilos.bloque}
      onSubmit={alEnviar}
      aria-labelledby={`${idGrupo}-titulo`}
      noValidate
    >
      <h2 id={`${idGrupo}-titulo`} className="font-titular text-lg text-marca">
        Agregar a mi pedido
      </h2>

      <fieldset
        className={estilos.grupo}
        ref={grupoRef}
        aria-describedby={error ? idError : undefined}
      >
        <legend className={estilos.leyenda}>Presentación</legend>
        <ul className={estilos.opciones}>
          {presentaciones.map((presentacion) => (
            <li key={presentacion} className={estilos.opcion}>
              <input
                type="radio"
                name={`${idGrupo}-presentacion`}
                value={presentacion}
                checked={seleccion === presentacion}
                onChange={() => {
                  setSeleccion(presentacion);
                  setError(null);
                }}
                aria-label={presentacion}
              />
              <span className={estilos.opcionTexto} aria-hidden="true">
                {presentacion}
              </span>
            </li>
          ))}
        </ul>
      </fieldset>

      <div>
        <label htmlFor={idCantidad} className={estilos.leyenda}>
          Cantidad
        </label>
        <div className={estilos.cantidad}>
          <button
            type="button"
            className={estilos.pasoCantidad}
            aria-label="Disminuir cantidad"
            onClick={() => ajustarCantidad(-1)}
          >
            −
          </button>
          <input
            id={idCantidad}
            className={estilos.campoCantidad}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={cantidadTexto}
            aria-describedby={error ? idError : undefined}
            onChange={(e) => {
              setCantidadTexto(e.target.value.replace(/\D/g, "").slice(0, 4));
              setError(null);
            }}
          />
          <button
            type="button"
            className={estilos.pasoCantidad}
            aria-label="Aumentar cantidad"
            onClick={() => ajustarCantidad(1)}
          >
            +
          </button>
        </div>
      </div>

      {sinCupo ? (
        <p className={estilos.aviso}>
          Tu pedido ya tiene {LIMITE_FILAS} productos. Envíalo o quita alguno
          para agregar más.
        </p>
      ) : null}

      <p
        id={idError}
        className={estilos.error}
        role={error ? "alert" : undefined}
        hidden={!error}
      >
        {error}
      </p>

      <div>
        <BotonEnlace type="submit" disabled={sinCupo}>
          Agregar a mi pedido
        </BotonEnlace>
      </div>

      <p className={estilos.estado} role="status" aria-live="polite">
        {confirmacion ? (
          <>
            {confirmacion}{" "}
            <Link href="/pedido" className={estilos.enlaceEstado}>
              Revisar mi pedido ({filas.length})
            </Link>
          </>
        ) : null}
      </p>
    </form>
  );
}

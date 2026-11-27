"use client";

import { useState, useTransition } from "react";

import {
  enviarConsulta,
  type ResultadoConsulta,
} from "@/app/(frontend)/contacto/actions";
import { BotonEnlace } from "@/components/ui/boton-enlace";
import estilos from "@/components/formulario-buscador.module.css";

type FormularioContactoProps = {
  productoConsulta?: string | null;
};

export function FormularioContacto({ productoConsulta }: FormularioContactoProps) {
  const [resultado, setResultado] = useState<ResultadoConsulta | null>(null);
  const [pendiente, startTransition] = useTransition();

  return (
    <form
      className={estilos.formulario}
      onSubmit={(event) => {
        event.preventDefault();
        const formulario = event.currentTarget;
        const datos = new FormData(formulario);
        if (productoConsulta) {
          datos.set("productoConsulta", productoConsulta);
        }
        startTransition(async () => {
          const respuesta = await enviarConsulta(datos);
          setResultado(respuesta);
          if (respuesta.ok) {
            formulario.reset();
          }
        });
      }}
    >
      {productoConsulta ? (
        <input type="hidden" name="productoConsulta" value={productoConsulta} />
      ) : null}

      <div>
        <label className={estilos.etiqueta} htmlFor="contacto-nombre">
          Nombre
        </label>
        <input
          id="contacto-nombre"
          name="nombre"
          type="text"
          required
          autoComplete="name"
          maxLength={120}
          className="mt-1 w-full min-h-11 rounded-m border border-marca/25 px-3"
        />
      </div>

      <div>
        <label className={estilos.etiqueta} htmlFor="contacto-telefono">
          Teléfono
        </label>
        <input
          id="contacto-telefono"
          name="telefono"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          maxLength={30}
          className="mt-1 w-full min-h-11 rounded-m border border-marca/25 px-3"
        />
      </div>

      <div className={estilos.campoAncho}>
        <label className={estilos.etiqueta} htmlFor="contacto-mensaje">
          Mensaje (opcional)
        </label>
        <textarea
          id="contacto-mensaje"
          name="mensaje"
          rows={4}
          maxLength={2000}
          className="mt-1 w-full rounded-m border border-marca/25 px-3 py-2"
        />
      </div>

      <div className={`${estilos.campoAncho} flex items-start gap-2`}>
        <input
          id="contacto-politica"
          name="aceptoPolitica"
          type="checkbox"
          value="true"
          required
          className="mt-1 size-5 shrink-0 accent-marca"
        />
        <label htmlFor="contacto-politica" className="text-sm leading-relaxed">
          Acepto la{" "}
          <a href="/privacidad" className="text-marca underline-offset-4 hover:underline">
            política de privacidad
          </a>
          .
        </label>
      </div>

      <div className={estilos.acciones}>
        <BotonEnlace type="submit" variante="primario" disabled={pendiente}>
          {pendiente ? "Enviando…" : "Enviar consulta"}
        </BotonEnlace>
      </div>

      {resultado?.ok ? (
        <p className={`${estilos.campoAncho} text-sm text-marca`} role="status">
          Gracias. Recibimos tu consulta y te contactaremos pronto.
        </p>
      ) : null}
      {resultado && !resultado.ok ? (
        <p className={`${estilos.campoAncho} text-sm text-aviso`} role="alert">
          {resultado.mensaje}
        </p>
      ) : null}
    </form>
  );
}

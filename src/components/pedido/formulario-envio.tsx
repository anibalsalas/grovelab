"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useTransition } from "react";

import {
  enviarPedido,
  type CampoEnvio,
  type ResultadoEnvio,
} from "@/app/(frontend)/pedido/actions";
import { BotonEnlace } from "@/components/ui/boton-enlace";
import { claseCampoFormulario } from "@/lib/clases-sitio";
import { ZONA_OTRA, type FilaPedido } from "@/lib/pedido/esquema.ts";

import estilos from "./pedido.module.css";

export type OpcionLista = { slug: string; nombre: string };

type FormularioEnvioProps = {
  filas: readonly FilaPedido[];
  zonas: readonly OpcionLista[];
  cultivos: readonly OpcionLista[];
  /** Con política publicada se piden nombre y teléfono; sin ella, ningún dato personal. */
  conPolitica: boolean;
  onResultado: (resultado: ResultadoEnvio) => void;
};

const claseEtiqueta = "block text-sm font-semibold text-marca";

export function FormularioEnvio({
  filas,
  zonas,
  cultivos,
  conPolitica,
  onResultado,
}: FormularioEnvioProps) {
  const id = useId();
  const [pendiente, iniciarEnvio] = useTransition();
  const [errores, setErrores] = useState<Partial<Record<CampoEnvio, string>>>({});
  const [mensaje, setMensaje] = useState<string | null>(null);
  const cargadoEn = useRef<number | null>(null);

  // Marca de tiempo para el antiabuso del servidor (mínimo de segundos en el formulario).
  useEffect(() => {
    cargadoEn.current = Date.now();
  }, []);

  const idCampo = (campo: CampoEnvio) => `${id}-${campo}`;
  const idError = (campo: CampoEnvio) => `${id}-${campo}-error`;
  const propsError = (campo: CampoEnvio) =>
    errores[campo]
      ? { "aria-invalid": true as const, "aria-describedby": idError(campo) }
      : {};
  const errorDe = (campo: CampoEnvio) =>
    errores[campo] ? (
      <p id={idError(campo)} className={estilos.error}>
        {errores[campo]}
      </p>
    ) : null;

  function alEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const texto = (nombre: string) => String(datos.get(nombre) ?? "");

    setErrores({});
    setMensaje(null);

    iniciarEnvio(async () => {
      const resultado = await enviarPedido({
        filas,
        // Sin zonas publicadas no hay selector: se envía como «otra».
        zona: zonas.length > 0 ? texto("zona") : ZONA_OTRA,
        ciudad: texto("ciudad"),
        cultivo: texto("cultivo"),
        hectareas: texto("hectareas"),
        ...(conPolitica
          ? {
              nombre: texto("nombre"),
              telefono: texto("telefono"),
              aceptoPolitica: datos.get("aceptoPolitica") === "on",
            }
          : {}),
        sitioWeb: texto("sitioWeb"),
        msDesdeCarga:
          cargadoEn.current === null ? 0 : Date.now() - cargadoEn.current,
      });

      if (!resultado.ok) {
        setErrores(resultado.errores ?? {});
        setMensaje(resultado.mensaje ?? null);
        const primero = (Object.keys(resultado.errores ?? {}) as CampoEnvio[])[0];
        if (primero) {
          document.getElementById(idCampo(primero))?.focus();
        }
      }
      onResultado(resultado);
    });
  }

  return (
    <section
      aria-labelledby={`${id}-titulo`}
      className="mt-10 max-w-xl rounded-m border border-marca/20 bg-superficie p-5 shadow-m sm:p-6"
    >
      <h2 id={`${id}-titulo`} className="font-titular text-xl text-marca">
        Enviar mi pedido
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-texto/85">
        {conPolitica
          ? "Con estos datos un asesor de Grovelab te contacta para cotizar tu pedido."
          : "No guardamos tu nombre ni tu teléfono. Cuando se abra WhatsApp, escribe tu nombre en el chat."}
      </p>

      <form className="mt-5 grid gap-4" onSubmit={alEnviar} noValidate>
        {/* Campo trampa: fuera de pantalla y del teclado; una persona no lo rellena. */}
        <div className={estilos.trampa} aria-hidden="true">
          <label htmlFor={`${id}-sitioWeb`}>No completar este campo</label>
          <input
            id={`${id}-sitioWeb`}
            name="sitioWeb"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {conPolitica ? (
          <>
            <div>
              <label className={claseEtiqueta} htmlFor={idCampo("nombre")}>
                Nombre
              </label>
              <input
                id={idCampo("nombre")}
                name="nombre"
                type="text"
                required
                autoComplete="name"
                maxLength={120}
                className={claseCampoFormulario}
                {...propsError("nombre")}
              />
              {errorDe("nombre")}
            </div>
            <div>
              <label className={claseEtiqueta} htmlFor={idCampo("telefono")}>
                Teléfono
              </label>
              <input
                id={idCampo("telefono")}
                name="telefono"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                maxLength={30}
                className={claseCampoFormulario}
                {...propsError("telefono")}
              />
              {errorDe("telefono")}
            </div>
          </>
        ) : null}

        {zonas.length > 0 ? (
          <div>
            <label className={claseEtiqueta} htmlFor={idCampo("zona")}>
              Zona
            </label>
            <select
              id={idCampo("zona")}
              name="zona"
              required
              defaultValue=""
              className={claseCampoFormulario}
              {...propsError("zona")}
            >
              <option value="" disabled>
                Elige tu zona
              </option>
              {zonas.map((zona) => (
                <option key={zona.slug} value={zona.slug}>
                  {zona.nombre}
                </option>
              ))}
              <option value={ZONA_OTRA}>Otra zona / no sé</option>
            </select>
            {errorDe("zona")}
          </div>
        ) : null}

        <div>
          <label className={claseEtiqueta} htmlFor={idCampo("ciudad")}>
            Ciudad (opcional)
          </label>
          <input
            id={idCampo("ciudad")}
            name="ciudad"
            type="text"
            autoComplete="address-level2"
            maxLength={80}
            className={claseCampoFormulario}
            {...propsError("ciudad")}
          />
          {errorDe("ciudad")}
        </div>

        {cultivos.length > 0 ? (
          <div>
            <label className={claseEtiqueta} htmlFor={idCampo("cultivo")}>
              Cultivo (opcional)
            </label>
            <select
              id={idCampo("cultivo")}
              name="cultivo"
              defaultValue=""
              className={claseCampoFormulario}
              {...propsError("cultivo")}
            >
              <option value="">Sin indicar</option>
              {cultivos.map((cultivo) => (
                <option key={cultivo.slug} value={cultivo.slug}>
                  {cultivo.nombre}
                </option>
              ))}
            </select>
            {errorDe("cultivo")}
          </div>
        ) : null}

        <div>
          <label className={claseEtiqueta} htmlFor={idCampo("hectareas")}>
            Hectáreas (opcional)
          </label>
          <input
            id={idCampo("hectareas")}
            name="hectareas"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            maxLength={10}
            className={claseCampoFormulario}
            {...propsError("hectareas")}
          />
          {errorDe("hectareas")}
        </div>

        {conPolitica ? (
          <div>
            <label className="flex items-start gap-3 text-sm leading-relaxed">
              <input
                id={idCampo("aceptoPolitica")}
                name="aceptoPolitica"
                type="checkbox"
                required
                className="mt-1 size-5 shrink-0 accent-marca"
                {...propsError("aceptoPolitica")}
              />
              <span>
                Acepto la{" "}
                <Link
                  href="/privacidad"
                  className="font-medium text-marca underline underline-offset-2"
                  target="_blank"
                >
                  política de privacidad
                </Link>
                .
              </span>
            </label>
            {errorDe("aceptoPolitica")}
          </div>
        ) : null}

        {mensaje ? (
          <p role="alert" className={estilos.error}>
            {mensaje}
          </p>
        ) : null}

        <div>
          <BotonEnlace type="submit" disabled={pendiente}>
            {pendiente ? "Enviando…" : "Enviar por WhatsApp"}
          </BotonEnlace>
        </div>
      </form>
    </section>
  );
}

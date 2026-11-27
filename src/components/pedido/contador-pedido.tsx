"use client";

import Link from "next/link";

import { usePedido } from "@/lib/pedido/usar-pedido.ts";

import estilos from "./pedido.module.css";

/** Enlace «Mi pedido» de la cabecera. No se muestra hasta que hay al menos un producto. */
export function ContadorPedido({ className = "" }: { className?: string }) {
  const { filas } = usePedido();
  const total = filas.length;

  if (total === 0) {
    return null;
  }

  return (
    <Link
      href="/pedido"
      className={`${estilos.contador} ${className}`.trim()}
      aria-label={`Mi pedido, ${total} ${total === 1 ? "producto" : "productos"}`}
    >
      <span className={estilos.etiquetaContador} aria-hidden="true">
        Mi pedido
      </span>
      <span className={estilos.cifra} aria-hidden="true">
        {total}
      </span>
    </Link>
  );
}

"use client";

import { useRef } from "react";

import {
  gsap,
  MOVIMIENTO_NORMAL,
  movimiento,
  prepararAparicion,
  useGSAP,
} from "@/lib/gsap/registro";
import type { ProductoCatalogo } from "@/lib/catalogo-productos.ts";

import estilos from "./catalogo.module.css";
import { TarjetaProductoCatalogo } from "./tarjeta-producto-catalogo";

/** Máximo de tarjetas que se animan (las de la primera pantalla): el resto aparece al instante. */
const MAX_ANIMADAS = 8;
const DESPLAZAMIENTO_PX = 14;
const DURACION_S = 0.4;
const ESCALON_S = 0.04;

type RejillaProductosProps = {
  productos: ProductoCatalogo[];
};

/**
 * Cuadrícula de resultados con entrada escalonada (GSAP). Se repite cada vez que cambia el
 * conjunto de productos mostrado, pero nunca frena la interacción:
 * - el contenido ya está en el DOM; solo se anima `opacity` y `transform` de las tarjetas
 *   visibles en pantalla (como mucho 8, unos 0,7 s en total);
 * - no toca el campo de búsqueda, que queda fuera de este componente;
 * - cada cambio revierte la animación anterior antes de empezar la nueva (sin estados viejos);
 * - con `prefers-reduced-motion` no se crea ninguna animación.
 */
export function RejillaProductos({ productos }: RejillaProductosProps) {
  const raiz = useRef<HTMLUListElement>(null);
  const clave = productos.map((producto) => producto.id).join(",");

  useGSAP(
    () => {
      const lista = raiz.current;
      if (!lista) {
        return;
      }

      const mm = gsap.matchMedia();
      mm.add(MOVIMIENTO_NORMAL, () => {
        // Primero se lee (posiciones) y después se escribe (estilos): sin layout thrashing.
        const altoVentana = window.innerHeight;
        const visibles = gsap.utils
          .toArray<HTMLElement>("[data-aparece]", lista)
          .filter((tarjeta) => tarjeta.getBoundingClientRect().top < altoVentana)
          .slice(0, MAX_ANIMADAS);

        if (visibles.length === 0) {
          lista.dataset.listo = "true";
          return;
        }

        prepararAparicion(lista, visibles, { autoAlpha: 0, y: DESPLAZAMIENTO_PX });
        gsap.to(visibles, {
          autoAlpha: 1,
          y: 0,
          duration: DURACION_S,
          ease: movimiento.curva,
          stagger: ESCALON_S,
          // Devuelve el `transform` al CSS: el hover de las tarjetas sigue funcionando.
          clearProps: "transform,opacity,visibility",
        });
      });

      return () => mm.revert();
    },
    { scope: raiz, dependencies: [clave], revertOnUpdate: true },
  );

  return (
    <ul ref={raiz} className={estilos.rejilla}>
      {productos.map((producto, indice) => (
        <li key={producto.id} data-aparece>
          <TarjetaProductoCatalogo
            producto={producto}
            carga={indice < 4 ? "alta" : indice < MAX_ANIMADAS ? "inmediata" : undefined}
          />
        </li>
      ))}
    </ul>
  );
}

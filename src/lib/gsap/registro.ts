/**
 * Punto único de entrada a GSAP. Solo se importa desde componentes de cliente
 * de la portada: así el código de GSAP viaja únicamente en las rutas que lo usan.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

/** Solo si la persona no pidió menos movimiento. Sin esto, todo queda estático y visible. */
export const MOVIMIENTO_NORMAL = "(prefers-reduced-motion: no-preference)";

/** Mismo punto de quiebre de los módulos CSS de la portada (dos columnas, efectos de scroll). */
export const PANTALLA_ANCHA = "(min-width: 56rem)";

/** Valores de movimiento compartidos (el equivalente en JS de los tokens de movimiento). */
export const movimiento = {
  duracion: 0.8,
  curva: "power3.out",
  escalon: 0.12,
  /** Desplazamiento inicial de las apariciones, en px (GSAP trabaja en px). */
  ascenso: 28,
} as const;

/**
 * Prepara una aparición sin parpadeo: aplica el estado inicial inline y recién
 * entonces marca la raíz como lista, que es lo que apaga la regla CSS que ocultaba
 * el contenido mientras GSAP cargaba (ver aparicion-gsap.module.css).
 */
export function prepararAparicion(
  raiz: HTMLElement,
  objetivos: gsap.TweenTarget,
  desde: gsap.TweenVars = { autoAlpha: 0, y: movimiento.ascenso },
): void {
  gsap.set(objetivos, desde);
  raiz.dataset.listo = "true";
}

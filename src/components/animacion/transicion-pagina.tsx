import { ViewTransition, type ReactNode } from "react";

type TransicionPaginaProps = {
  children: ReactNode;
};

/**
 * Transición entre páginas (catálogo de efectos, docs/DISENO.md): el contenido
 * saliente se desvanece rápido y el entrante llega con un leve ascenso. Las
 * clases `salir` y `entrar` se animan en globals.css.
 *
 * Va en cada page.tsx, no en el layout: el layout persiste entre navegaciones
 * y ahí enter/exit nunca se disparan. `default="none"` evita animar cambios
 * dentro de la misma página (p. ej. filtros de /productos).
 *
 * Sin soporte de View Transitions en el navegador, la página cambia como siempre.
 */
export function TransicionPagina({ children }: TransicionPaginaProps) {
  return (
    <ViewTransition enter="entrar" exit="salir" default="none">
      {children}
    </ViewTransition>
  );
}

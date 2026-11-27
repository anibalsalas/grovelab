import { ViewTransition, type ReactElement } from "react";

type NombreCompartidoProps = {
  /** Identidad única en la página, p. ej. `producto-adentu-50-sc`. */
  nombre: string;
  /** Un solo elemento DOM (no un fragmento ni texto suelto). */
  children: ReactElement;
};

/**
 * Continuidad entre páginas: el mismo `nombre` en la tarjeta y en el título
 * de destino hace que el navegador lleve uno hasta el otro. `share="morph"`
 * con `default="none"`: solo se anima en ese par, no en otras transiciones.
 *
 * Dos elementos con el mismo nombre visibles a la vez anulan la transición:
 * cada nombre debe aparecer una sola vez por página.
 */
export function NombreCompartido({ nombre, children }: NombreCompartidoProps) {
  return (
    <ViewTransition name={nombre} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}

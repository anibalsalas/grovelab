import type { ReactNode } from "react";

import { anchoContenedor } from "@/lib/clases-sitio";

import estilos from "./cinta-seccion.module.css";

const tonos = {
  verde: "bg-fondo-banda",
  crema: "bg-fondo-banda-alt",
  neutra: "bg-fondo",
  marca:
    "bg-gradient-to-br from-marca to-exito text-fondo",
} as const;

type TonoCinta = keyof typeof tonos;

type CintaSeccionProps = {
  children: ReactNode;
  tono: TonoCinta;
  className?: string;
  /** Si es false, solo la franja de color; el hijo debe aplicar {anchoContenedor} por dentro. */
  contenedor?: boolean;
  /**
   * `surco`: el borde superior se ondula sobre la franja anterior. Solo en la
   * portada, para leerla como recorrido «del suelo a la cosecha». No usar en
   * la primera franja ni en la de tono `marca` (su degradado no continúa en el borde).
   */
  borde?: "recto" | "surco";
};

export function CintaSeccion({
  children,
  tono,
  className = "",
  contenedor = true,
  borde = "recto",
}: CintaSeccionProps) {
  const claseBorde = borde === "surco" && tono !== "marca" ? estilos.surco : "";
  const clasesFranja = `${tonos[tono]} w-full ${claseBorde} ${className}`.trim();

  if (!contenedor) {
    return <div className={clasesFranja}>{children}</div>;
  }

  return (
    <div className={clasesFranja}>
      <div className={`${anchoContenedor} py-10 sm:py-12 lg:py-14`}>
        {children}
      </div>
    </div>
  );
}

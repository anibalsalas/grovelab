import type { ReactNode } from "react";

import { anchoContenedor } from "@/lib/clases-sitio";

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
};

export function CintaSeccion({
  children,
  tono,
  className = "",
  contenedor = true,
}: CintaSeccionProps) {
  const clasesFranja = `${tonos[tono]} w-full ${className}`.trim();

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

import Link from "next/link";
import type { ReactNode } from "react";

const variantes = {
  primario:
    "inline-flex min-h-11 items-center rounded-m bg-marca px-5 py-2 text-fondo shadow-s hover:bg-marca/90 focus-visible:rounded-m",
  secundario:
    "inline-flex min-h-11 items-center rounded-m border border-marca bg-fondo/80 px-5 py-2 text-marca hover:bg-marca/5 focus-visible:rounded-m",
  sobreMarca:
    "inline-flex min-h-11 items-center rounded-m bg-fondo px-6 py-2 font-medium text-marca shadow-s hover:bg-fondo/90 focus-visible:rounded-m",
} as const;

type Variante = keyof typeof variantes;

type BotonEnlaceProps = {
  children: ReactNode;
  variante?: Variante;
  className?: string;
} & (
  | { href: string; prefetch?: boolean }
  | {
      type: "submit" | "button";
      disabled?: boolean;
      /** Solo desde componentes de cliente. */
      onClick?: () => void;
    }
);

export function BotonEnlace({
  children,
  variante = "primario",
  className = "",
  ...rest
}: BotonEnlaceProps) {
  const clases = `${variantes[variante]} ${className}`.trim();

  if ("href" in rest) {
    const { href, prefetch } = rest;
    return (
      <Link href={href} prefetch={prefetch} className={clases}>
        {children}
      </Link>
    );
  }

  const { type, disabled, onClick } = rest;
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clases}
    >
      {children}
    </button>
  );
}

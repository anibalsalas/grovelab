import Link from "next/link";

import sitio from "@/styles/sitio.module.css";

type TarjetaProductoProps = {
  slug: string;
  nombre: string;
  resumen?: string | null;
  categoria?: string | null;
};

export function TarjetaProducto({
  slug,
  nombre,
  resumen,
  categoria,
}: TarjetaProductoProps) {
  return (
    <Link href={`/productos/${slug}`} className={sitio.tarjetaPlana}>
      <span className="font-titular text-lg text-marca">{nombre}</span>
      {categoria ? (
        <p className="mt-1 text-sm text-texto/80">{categoria}</p>
      ) : null}
      {resumen ? (
        <p className="mt-2 text-sm leading-relaxed">{resumen}</p>
      ) : null}
    </Link>
  );
}

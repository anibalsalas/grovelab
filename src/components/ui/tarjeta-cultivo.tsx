import Link from "next/link";

import sitio from "@/styles/sitio.module.css";

type TarjetaCultivoProps = {
  slug: string;
  nombre: string;
  resumen?: string | null;
  efecto3d?: boolean;
};

export function TarjetaCultivo({
  slug,
  nombre,
  resumen,
  efecto3d = false,
}: TarjetaCultivoProps) {
  const clase = efecto3d ? sitio.tarjetaEnlace : sitio.tarjetaPlana;

  return (
    <Link href={`/cultivos/${slug}`} className={clase}>
      <span className="font-titular text-lg text-marca">{nombre}</span>
      {resumen ? (
        <p className="mt-2 text-sm leading-relaxed">{resumen}</p>
      ) : null}
    </Link>
  );
}

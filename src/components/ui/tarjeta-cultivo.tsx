import Image from "next/image";
import Link from "next/link";

import { NombreCompartido } from "@/components/animacion/nombre-compartido";
import { nombreTransicionCultivo } from "@/lib/nombres-transicion.ts";
import type { ImagenTarjeta } from "@/components/ui/tarjeta-producto";
import sitio from "@/styles/sitio.module.css";

type TarjetaCultivoProps = {
  slug: string;
  nombre: string;
  resumen?: string | null;
  efecto3d?: boolean;
  imagen?: ImagenTarjeta | null;
};

export function TarjetaCultivo({
  slug,
  nombre,
  resumen,
  efecto3d = false,
  imagen,
}: TarjetaCultivoProps) {
  const clase = efecto3d ? sitio.tarjetaEnlace : sitio.tarjetaPlana;

  return (
    <Link href={`/cultivos/${slug}`} className={clase}>
      {imagen ? (
        <div className="relative -mx-4 -mt-4 mb-4 aspect-[4/3] overflow-hidden rounded-t-m">
          <Image
            src={imagen.url}
            alt={imagen.alt?.trim() || nombre}
            fill
            sizes="(min-width: 56rem) 33vw, (min-width: 40rem) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <NombreCompartido nombre={nombreTransicionCultivo(slug)}>
        <span className="block w-fit font-titular text-lg text-marca">
          {nombre}
        </span>
      </NombreCompartido>
      {resumen ? (
        <p className="mt-2 text-sm leading-relaxed">{resumen}</p>
      ) : null}
    </Link>
  );
}

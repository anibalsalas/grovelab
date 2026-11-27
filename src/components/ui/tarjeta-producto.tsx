import Image from "next/image";
import Link from "next/link";

import { NombreCompartido } from "@/components/animacion/nombre-compartido";
import { nombreTransicionProducto } from "@/lib/nombres-transicion.ts";
import sitio from "@/styles/sitio.module.css";

export type ImagenTarjeta = {
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

type TarjetaProductoProps = {
  slug: string;
  nombre: string;
  resumen?: string | null;
  categoria?: string | null;
  imagen?: ImagenTarjeta | null;
};

export function TarjetaProducto({
  slug,
  nombre,
  resumen,
  categoria,
  imagen,
}: TarjetaProductoProps) {
  return (
    <Link href={`/productos/${slug}`} className={sitio.tarjetaPlana}>
      {imagen ? (
        // Foto de envase: se muestra completa (`contain`), nunca recortada. El fondo blanco de
        // la foto se funde con el de la caja (`multiply`) para que no se vea un recuadro.
        <div className="relative -mx-4 -mt-4 mb-4 aspect-square overflow-hidden rounded-t-m bg-superficie">
          <Image
            src={imagen.url}
            alt={imagen.alt?.trim() || nombre}
            fill
            sizes="(min-width: 56rem) 33vw, (min-width: 40rem) 50vw, 100vw"
            className="object-contain p-4 mix-blend-multiply"
          />
        </div>
      ) : null}
      <NombreCompartido nombre={nombreTransicionProducto(slug)}>
        <span className="block w-fit font-titular text-lg text-marca">
          {nombre}
        </span>
      </NombreCompartido>
      {categoria ? (
        <p className="mt-1 text-sm text-texto/80">{categoria}</p>
      ) : null}
      {resumen ? (
        <p className="mt-2 text-sm leading-relaxed">{resumen}</p>
      ) : null}
    </Link>
  );
}

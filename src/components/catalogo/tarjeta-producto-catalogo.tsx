import Image from "next/image";
import Link from "next/link";

import { NombreCompartido } from "@/components/animacion/nombre-compartido";
import type { ProductoCatalogo } from "@/lib/catalogo-productos.ts";
import { nombreTransicionProducto } from "@/lib/nombres-transicion.ts";

import estilos from "./catalogo.module.css";

type TarjetaProductoCatalogoProps = {
  producto: ProductoCatalogo;
  /**
   * Imágenes de la primera pantalla (LCP): `alta` también sube su prioridad de descarga;
   * `inmediata` solo evita la carga diferida. Sin valor, carga diferida normal.
   */
  carga?: "alta" | "inmediata";
};

/**
 * Tarjeta del catálogo: envase completo (`contain`, nunca recortado) sobre fondo suave,
 * nombre, categoría y acceso a la ficha. Toda la tarjeta es un solo enlace; la imagen es
 * decorativa para lectores de pantalla porque el nombre ya está en el enlace.
 * Sin foto no se reserva el espacio (no hay imágenes de relleno).
 */
export function TarjetaProductoCatalogo({
  producto,
  carga,
}: TarjetaProductoCatalogoProps) {
  const { slug, nombre, categoria, imagen } = producto;

  return (
    <Link href={`/productos/${slug}`} className={estilos.tarjeta}>
      {imagen ? (
        <div className={estilos.imagen}>
          <Image
            src={imagen.url}
            alt=""
            fill
            sizes="(min-width: 72rem) 18vw, (min-width: 56rem) 28vw, (min-width: 40rem) 30vw, 46vw"
            className={estilos.foto}
            fetchPriority={carga === "alta" ? "high" : undefined}
            loading={carga ? "eager" : undefined}
          />
        </div>
      ) : null}
      <div className={estilos.cuerpo}>
        <NombreCompartido nombre={nombreTransicionProducto(slug)}>
          <span className="block w-fit font-titular text-base leading-snug font-semibold text-marca sm:text-lg">
            {nombre}
          </span>
        </NombreCompartido>
        {categoria ? <p className="text-sm text-texto/80">{categoria.nombre}</p> : null}
        <span className={estilos.accion}>
          Ver detalle
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" className={estilos.flecha}>
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

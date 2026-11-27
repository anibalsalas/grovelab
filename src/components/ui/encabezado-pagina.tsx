import { NombreCompartido } from "@/components/animacion/nombre-compartido";

type EncabezadoPaginaProps = {
  destacado?: string;
  titulo: string;
  descripcion?: string;
  /** Si llega, el título continúa desde la tarjeta que lleva a esta página. */
  nombreTransicion?: string;
};

export function EncabezadoPagina({
  destacado,
  titulo,
  descripcion,
  nombreTransicion,
}: EncabezadoPaginaProps) {
  const h1 = (
    <h1
      className={`font-titular text-h1 font-bold leading-[var(--token-interlineado-h1)] tracking-tight text-marca ${destacado ? "mt-1" : ""} ${nombreTransicion ? "w-fit" : ""}`}
    >
      {titulo}
    </h1>
  );

  return (
    <header className="max-w-prose">
      {destacado ? (
        <p className="text-sm font-medium tracking-wide text-acento uppercase">
          {destacado}
        </p>
      ) : null}
      {nombreTransicion ? (
        <NombreCompartido nombre={nombreTransicion}>{h1}</NombreCompartido>
      ) : (
        h1
      )}
      {descripcion ? (
        <p className="mt-2 font-texto leading-relaxed text-texto/85">{descripcion}</p>
      ) : null}
    </header>
  );
}

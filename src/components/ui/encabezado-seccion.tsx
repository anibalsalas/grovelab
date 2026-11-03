type EncabezadoSeccionProps = {
  id: string;
  titulo: string;
  descripcion?: string;
  destacado?: string;
};

export function EncabezadoSeccion({
  id,
  titulo,
  descripcion,
  destacado,
}: EncabezadoSeccionProps) {
  return (
    <header className="max-w-prose">
      {destacado ? (
        <p className="text-sm font-medium tracking-wide text-acento uppercase">
          {destacado}
        </p>
      ) : null}
      <h2
        id={id}
        className={`font-titular text-2xl font-bold tracking-tight text-marca sm:text-3xl ${destacado ? "mt-1" : ""}`}
      >
        {titulo}
      </h2>
      {descripcion ? (
        <p className="mt-2 font-texto leading-relaxed text-texto/85">{descripcion}</p>
      ) : null}
    </header>
  );
}

type EncabezadoPaginaProps = {
  destacado?: string;
  titulo: string;
  descripcion?: string;
};

export function EncabezadoPagina({
  destacado,
  titulo,
  descripcion,
}: EncabezadoPaginaProps) {
  return (
    <header className="max-w-prose">
      {destacado ? (
        <p className="text-sm font-medium tracking-wide text-acento uppercase">
          {destacado}
        </p>
      ) : null}
      <h1
        className={`font-titular text-3xl font-bold tracking-tight text-marca sm:text-4xl ${destacado ? "mt-1" : ""}`}
      >
        {titulo}
      </h1>
      {descripcion ? (
        <p className="mt-2 font-texto leading-relaxed text-texto/85">{descripcion}</p>
      ) : null}
    </header>
  );
}

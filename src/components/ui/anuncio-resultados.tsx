type AnuncioResultadosProps = {
  total: number;
  /** Por defecto lleva margen superior; el catálogo lo coloca dentro de su propia barra. */
  className?: string;
};

/** role="status" + aria-live: el mismo nodo persiste entre navegaciones del panel, así que el cambio de texto se anuncia solo. */
export function AnuncioResultados({
  total,
  className = "mt-6 text-sm text-texto/80",
}: AnuncioResultadosProps) {
  const mensaje =
    total === 1 ? "1 producto encontrado" : `${total} productos encontrados`;

  return (
    <p role="status" aria-live="polite" className={className}>
      {mensaje}
    </p>
  );
}

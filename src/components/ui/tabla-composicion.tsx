import ficha from "@/styles/ficha-producto.module.css";

export type FilaComposicion = {
  id?: string | null;
  elemento: string;
  valor: string;
};

type TablaComposicionProps = {
  filas: FilaComposicion[];
  tituloId?: string;
};

export function TablaComposicion({
  filas,
  tituloId = "tabla-composicion",
}: TablaComposicionProps) {
  if (filas.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={tituloId}>
      <h2 id={tituloId} className="font-titular text-xl text-marca">
        Composición
      </h2>
      <div className={ficha.tablaDosisContenedor}>
        <table className={`${ficha.tablaDosis} ${ficha.tablaComposicion}`}>
          <caption className="sr-only">Composición del producto</caption>
          <thead>
            <tr>
              <th scope="col">Elemento</th>
              <th scope="col">Porcentaje o concentración</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.id ?? `${fila.elemento}-${fila.valor}`}>
                <td>{fila.elemento}</td>
                <td>{fila.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

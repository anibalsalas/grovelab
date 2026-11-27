import ficha from "@/styles/ficha-producto.module.css";

export type FilaDosis = {
  id?: string | null;
  cultivo: string;
  plaga: string;
  dosis: string;
  nota: string;
};

type TablaDosisProps = {
  filas: FilaDosis[];
  tituloId?: string;
};

export function TablaDosis({ filas, tituloId = "tabla-dosis" }: TablaDosisProps) {
  if (filas.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={tituloId}>
      <h2 id={tituloId} className="font-titular text-xl text-marca">
        Dosis recomendadas
      </h2>
      <div className={ficha.tablaDosisContenedor}>
        <table className={`tabla-dosis ${ficha.tablaDosis}`}>
          <caption className="sr-only">
            Dosis recomendadas por cultivo y plaga
          </caption>
          <thead>
            <tr>
              <th scope="col">Cultivo</th>
              <th scope="col">Plaga</th>
              <th scope="col">Dosis</th>
              <th scope="col">Nota</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.id ?? `${fila.cultivo}-${fila.dosis}`}>
                <td>{fila.cultivo}</td>
                <td>{fila.plaga}</td>
                <td>{fila.dosis}</td>
                <td>{fila.nota}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

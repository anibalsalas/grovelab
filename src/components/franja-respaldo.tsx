import institucional from "@/styles/institucional.module.css";

type ItemRespaldo = {
  etiqueta: string;
  valor: string;
};

type FranjaRespaldoProps = {
  items: ItemRespaldo[];
};

export function FranjaRespaldo({ items }: FranjaRespaldoProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="respaldo-titulo">
      <h2 id="respaldo-titulo" className="sr-only">
        Respaldo y certificaciones
      </h2>
      <ul className={institucional.franjaRespaldo}>
        {items.map((item) => (
          <li key={`${item.etiqueta}-${item.valor}`}>
            <p className={institucional.cifraRespaldo}>{item.valor}</p>
            <p className={institucional.etiquetaRespaldo}>{item.etiqueta}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

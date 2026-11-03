import Link from "next/link";

export type MigasItem = {
  etiqueta: string;
  href?: string;
};

type MigasProps = {
  items: MigasItem[];
};

export function Migas({ items }: MigasProps) {
  return (
    <nav aria-label="Migas de pan">
      <ol className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-texto/80">
        {items.map((item, indice) => {
          const esUltimo = indice === items.length - 1;
          return (
            <li key={`${item.etiqueta}-${indice}`} className="inline-flex items-center gap-2">
              {item.href && !esUltimo ? (
                <Link
                  href={item.href}
                  className="text-marca underline-offset-4 hover:underline"
                >
                  {item.etiqueta}
                </Link>
              ) : (
                <span className={esUltimo ? "text-texto" : undefined}>
                  {item.etiqueta}
                </span>
              )}
              {!esUltimo ? (
                <span aria-hidden="true" className="text-texto/50">/</span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

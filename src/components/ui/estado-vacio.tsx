import { BotonEnlace } from "@/components/ui/boton-enlace";
import sitio from "@/styles/sitio.module.css";

type EnlaceAccion = { href: string; etiqueta: string; externo?: boolean };

type EstadoVacioProps = {
  titulo: string;
  mensaje: string;
  enlace?: EnlaceAccion;
  /** Segunda salida (p. ej. contactar o abrir WhatsApp) junto al enlace principal. */
  enlaceSecundario?: EnlaceAccion;
};

const claseEnlaceExterno =
  "inline-flex min-h-11 items-center rounded-m border border-marca px-5 py-2 text-marca hover:bg-marca/5 focus-visible:rounded-m";

function Accion({ href, etiqueta, externo }: EnlaceAccion) {
  if (externo) {
    return (
      <a
        href={href}
        className={claseEnlaceExterno}
        target="_blank"
        rel="noopener noreferrer"
      >
        {etiqueta}
      </a>
    );
  }
  return (
    <BotonEnlace href={href} variante="secundario">
      {etiqueta}
    </BotonEnlace>
  );
}

export function EstadoVacio({
  titulo,
  mensaje,
  enlace,
  enlaceSecundario,
}: EstadoVacioProps) {
  return (
    <div className={`mt-8 p-6 ${sitio.tarjetaPlana}`}>
      <h2 className="font-titular text-lg text-marca">{titulo}</h2>
      <p className="mt-2 leading-relaxed">{mensaje}</p>
      {enlace || enlaceSecundario ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {enlace ? <Accion {...enlace} /> : null}
          {enlaceSecundario ? <Accion {...enlaceSecundario} /> : null}
        </div>
      ) : null}
    </div>
  );
}

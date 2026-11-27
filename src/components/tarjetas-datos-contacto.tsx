import type { TextosSitio } from "@/payload-types";
import institucional from "@/styles/institucional.module.css";

function valorOPlaceholder(valor?: string | null): string {
  const limpio = valor?.trim();
  return limpio && limpio.length > 0 ? limpio : "POR CONFIRMAR";
}

type TarjetasDatosContactoProps = {
  contacto: TextosSitio["contacto"];
};

export function TarjetasDatosContacto({ contacto }: TarjetasDatosContactoProps) {
  const telefono = valorOPlaceholder(contacto?.telefono);
  const correo = valorOPlaceholder(contacto?.correo);
  const direccion = valorOPlaceholder(contacto?.direccion);
  const urlMapa = contacto?.urlMapa?.trim();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className={institucional.tarjetaContacto}>
        <h2 className="font-titular text-lg text-marca">Teléfono</h2>
        {telefono === "POR CONFIRMAR" ? (
          <p className="mt-2 text-aviso">{telefono}</p>
        ) : (
          <p className="mt-2">
            <a href={`tel:${telefono.replace(/\s/g, "")}`} className="text-marca hover:underline">
              {telefono}
            </a>
          </p>
        )}
      </div>
      <div className={institucional.tarjetaContacto}>
        <h2 className="font-titular text-lg text-marca">Correo</h2>
        {correo === "POR CONFIRMAR" ? (
          <p className="mt-2 text-aviso">{correo}</p>
        ) : (
          <p className="mt-2">
            <a href={`mailto:${correo}`} className="text-marca hover:underline">
              {correo}
            </a>
          </p>
        )}
      </div>
      <div className={`${institucional.tarjetaContacto} sm:col-span-2 lg:col-span-1`}>
        <h2 className="font-titular text-lg text-marca">Dirección</h2>
        <p className={`mt-2 ${direccion === "POR CONFIRMAR" ? "text-aviso" : ""}`}>
          {direccion}
        </p>
        {urlMapa ? (
          <p className="mt-3">
            <a
              href={urlMapa}
              className="text-sm font-medium text-marca underline-offset-4 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Ver en mapa
            </a>
          </p>
        ) : null}
      </div>
    </div>
  );
}

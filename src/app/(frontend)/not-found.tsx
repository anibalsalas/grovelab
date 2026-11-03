import { BotonEnlace } from "@/components/ui/boton-enlace";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { clasesMain, idContenidoPrincipal } from "@/lib/clases-sitio";

export default function NotFound() {
  return (
    <main id={idContenidoPrincipal} className={clasesMain}>
      <EncabezadoPagina
        titulo="Página no encontrada"
        descripcion="La dirección que buscaste no existe o ya no está disponible."
      />
      <div className="mt-8 flex flex-wrap gap-3">
        <BotonEnlace href="/" variante="primario">
          Ir al inicio
        </BotonEnlace>
        <BotonEnlace href="/cultivos" variante="secundario">
          Ver cultivos
        </BotonEnlace>
      </div>
    </main>
  );
}

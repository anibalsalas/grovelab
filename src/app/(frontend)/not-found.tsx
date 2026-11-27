import { TransicionPagina } from "@/components/animacion/transicion-pagina";
import { BotonEnlace } from "@/components/ui/boton-enlace";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import { clasesMain, idContenidoPrincipal } from "@/lib/clases-sitio";
import { hayCultivosPublicados } from "@/lib/hay-cultivos-publicados.ts";

export default async function NotFound() {
  const hayCultivos = await hayCultivosPublicados();

  return (
    <TransicionPagina>
      <main id={idContenidoPrincipal} className={clasesMain}>
        <EncabezadoPagina
          titulo="Página no encontrada"
          descripcion="La dirección que buscaste no existe o ya no está disponible."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <BotonEnlace href="/" variante="primario">
            Ir al inicio
          </BotonEnlace>
          {hayCultivos ? (
            <BotonEnlace href="/cultivos" variante="secundario">
              Ver cultivos
            </BotonEnlace>
          ) : (
            <BotonEnlace href="/productos" variante="secundario">
              Ver productos
            </BotonEnlace>
          )}
        </div>
      </main>
    </TransicionPagina>
  );
}

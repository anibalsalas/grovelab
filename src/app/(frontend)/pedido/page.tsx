import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TransicionPagina } from "@/components/animacion/transicion-pagina";
import { CintaSeccion } from "@/components/layout/cinta-seccion";
import { ListaPedido } from "@/components/pedido/lista-pedido";
import { EncabezadoPagina } from "@/components/ui/encabezado-pagina";
import {
  contenedorPagina,
  idContenidoPrincipal,
  scrollMargenContenido,
} from "@/lib/clases-sitio";
import {
  obtenerTextosSitio,
  politicaPrivacidadPublica,
} from "@/lib/obtener-textos-sitio.ts";
import { getPayloadClient } from "@/lib/payload-client";
import { hayDestinoPedido } from "@/lib/pedido/hay-destino-pedido.ts";

export const dynamic = "force-dynamic";

// Página de uso personal: no tiene sentido en buscadores ni en el sitemap.
export const metadata: Metadata = {
  title: "Mi pedido",
  robots: { index: false, follow: false },
};

export default async function PedidoPage() {
  // Sin ningún WhatsApp de destino la función de pedido no existe en el sitio.
  if (!(await hayDestinoPedido())) {
    notFound();
  }

  const payload = await getPayloadClient();
  const [textos, zonas, cultivos] = await Promise.all([
    obtenerTextosSitio(),
    // El filtro por _status es explícito: la Local API ignora el acceso público.
    payload.find({
      collection: "zonas-comerciales",
      where: { _status: { equals: "published" } },
      sort: "orden",
      depth: 0,
      limit: 50,
      pagination: false,
    }),
    payload.find({
      collection: "cultivos",
      where: { _status: { equals: "published" } },
      sort: "nombre",
      depth: 0,
      limit: 100,
      pagination: false,
    }),
  ]);

  return (
    <TransicionPagina>
      <main id={idContenidoPrincipal} className={scrollMargenContenido}>
        <CintaSeccion tono="verde">
          <EncabezadoPagina
            destacado="Pedido"
            titulo="Mi pedido"
            descripcion="Revisa los productos, las presentaciones y las cantidades antes de enviar tu pedido."
          />
        </CintaSeccion>

        <div className={contenedorPagina}>
          <ListaPedido
            zonas={zonas.docs.map(({ slug, nombre }) => ({ slug, nombre }))}
            cultivos={cultivos.docs.map(({ slug, nombre }) => ({ slug, nombre }))}
            conPolitica={politicaPrivacidadPublica(textos) !== null}
          />
        </div>
      </main>
    </TransicionPagina>
  );
}

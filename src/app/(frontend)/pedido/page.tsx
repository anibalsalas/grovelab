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
          <ListaPedido />
        </div>
      </main>
    </TransicionPagina>
  );
}

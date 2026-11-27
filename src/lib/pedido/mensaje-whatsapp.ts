export type ItemMensaje = {
  nombre: string;
  presentacion: string;
  cantidad: number;
};

export type DatosMensaje = {
  items: readonly ItemMensaje[];
  /** Solo si el pedido se guardó en el panel. */
  numeroPedido?: number;
  /** Solo si hay política publicada y se pidió el dato. */
  nombre?: string;
  zona?: string;
  ciudad?: string;
  cultivo?: string;
  hectareas?: number;
};

function formatearNumeroPedido(numero: number): string {
  return String(numero).padStart(4, "0");
}

function formatearHectareas(valor: number): string {
  return valor.toLocaleString("es-PE", { maximumFractionDigits: 1 });
}

/** Texto del pedido que se abre en WhatsApp. No incluye el teléfono: WhatsApp ya lo muestra. */
export function construirMensaje(datos: DatosMensaje): string {
  const encabezado =
    datos.numeroPedido === undefined
      ? "Hola, quiero cotizar este pedido:"
      : `Hola, quiero cotizar este pedido (N.º ${formatearNumeroPedido(datos.numeroPedido)}):`;

  const lineas = [encabezado];
  for (const item of datos.items) {
    lineas.push(`• ${item.nombre} — ${item.presentacion} × ${item.cantidad}`);
  }

  if (datos.nombre) {
    lineas.push(`Nombre: ${datos.nombre}`);
  }

  const ubicacion = [
    datos.zona ? `Zona: ${datos.zona}` : null,
    datos.ciudad ? `Ciudad: ${datos.ciudad}` : null,
  ].filter((parte): parte is string => parte !== null);
  if (ubicacion.length > 0) {
    lineas.push(ubicacion.join(" · "));
  }

  const campo = [
    datos.cultivo ? `Cultivo: ${datos.cultivo}` : null,
    datos.hectareas !== undefined
      ? `${formatearHectareas(datos.hectareas)} ha`
      : null,
  ].filter((parte): parte is string => parte !== null);
  if (campo.length > 0) {
    lineas.push(campo.join(" · "));
  }

  return lineas.join("\n");
}

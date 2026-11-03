/** Número WhatsApp solo servidor; no exponer en logs. */
export function obtenerWhatsAppNumber(): string | undefined {
  const valor = process.env.WHATSAPP_NUMBER?.trim();
  return valor === "" ? undefined : valor;
}

export function enlaceWhatsAppGenerico(): string | null {
  const numero = obtenerWhatsAppNumber();
  if (!numero) {
    return null;
  }
  const digitos = numero.replace(/\D/g, "");
  if (digitos === "") {
    return null;
  }
  return `https://wa.me/${digitos}`;
}

export function enlaceWhatsAppConsulta(mensaje: string): string | null {
  const numero = obtenerWhatsAppNumber();
  if (!numero) {
    return null;
  }
  const digitos = numero.replace(/\D/g, "");
  if (digitos === "") {
    return null;
  }
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
}

export function enlaceWhatsAppInformacion(nombreProducto: string): string | null {
  return enlaceWhatsAppConsulta(`Hola, quiero información sobre ${nombreProducto}`);
}

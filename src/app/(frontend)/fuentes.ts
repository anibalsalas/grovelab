import { Fraunces, Inter } from "next/font/google";

/**
 * Una fuente variable por familia (subconjunto latino, swap).
 * La interfaz usa solo los pesos 400 y 600; el archivo variable cubre ambos
 * sin descargar un archivo estático por peso.
 * Titular: Fraunces — serif orgánica con detalles suaves, da un sentido
 * agrícola/artesanal distinto al redondeado de Fredoka, manteniendo legibilidad
 * en fichas técnicas y tablas de dosis.
 */
export const fuenteTitular = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo-titular",
  weight: ["600", "700"],
  adjustFontFallback: true,
  preload: true,
});

export const fuenteTexto = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo-texto",
  weight: ["400", "500", "600"],
  adjustFontFallback: true,
  preload: true,
});

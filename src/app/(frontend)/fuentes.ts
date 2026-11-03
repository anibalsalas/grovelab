import { Bricolage_Grotesque, Inter } from "next/font/google";

/**
 * Una fuente variable por familia (subconjunto latino, swap).
 * La interfaz usa solo los pesos 400 y 600; el archivo variable cubre ambos
 * sin descargar un archivo estático por peso.
 * Familias de trabajo: se confirman contra el logo real de Grovelab.
 */
export const fuenteTitular = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo-titular",
  weight: ["600", "700", "800"],
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

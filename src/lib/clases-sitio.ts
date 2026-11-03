/**
 * Mismo ritmo horizontal que la cabecera (max-w-6xl + padding lateral).
 * Tailwind explícito para que el contenido no quede pegado al borde del viewport.
 */
export const anchoContenedor =
  "mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10";

/** Campos de formulario (Tailwind; no depende de CSS Modules en Turbopack). */
export const claseCampoFormulario =
  "mt-2 w-full min-h-11 rounded-s border border-marca/30 bg-fondo px-3 py-2 text-texto focus-visible:border-marca";

export const clasePanelFormulario =
  "rounded-m border border-marca/20 bg-superficie p-5 shadow-m sm:p-6";

/** Contenedor estándar de páginas públicas. Ver docs/DISENO.md (Tailwind vs módulos). */
export const contenedorPagina = `${anchoContenedor} py-10 sm:py-12`;

/** Compensa cabecera sticky al usar ancla #contenido. */
export const scrollMargenContenido = "scroll-mt-20";

export const idContenidoPrincipal = "contenido";

export const clasesMain = `${contenedorPagina} ${scrollMargenContenido}`;

/** Main de portada: franjas a sangre; el scroll-mt sigue en #contenido. */
export const clasesMainPortada = scrollMargenContenido;

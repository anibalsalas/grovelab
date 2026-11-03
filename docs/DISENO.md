# Dirección de diseño — Grovelab (borrador)

> Borrador para aprobar con el cliente. Los valores marcados PROVISIONAL se confirman midiendo el logo y los materiales de marca actuales.

## Idea rectora
"Del suelo a la cosecha": la web cuenta que Grovelab formula productos específicos por cultivo. Se siente técnica, cercana y moderna; no un catálogo de distribuidor.

## Principio de coherencia
Un solo lenguaje visual en todo el sitio: mismos tokens, mismos componentes, mismo ritmo de movimiento. Máximo **un momento "wow" por página**.

## Estrategia de estilos
Solo **Tailwind v4 y CSS**, con un único juego de tokens:
- **Tailwind:** ideal cuando el resultado cabe en pocas utilidades legibles (layout, responsive, estados, transformaciones y degradados sencillos, e incluso efectos 3D o por scroll con valores arbitrarios).
- **CSS Modules (`*.module.css`) y CSS nativo:** ideal cuando hay `@keyframes` propios, muchas capas, selectores, cálculos, `@property`, scroll-driven animations, o cuando las clases de Tailwind se vuelven ilegibles.
- **Un enfoque por efecto dentro de un mismo componente.**
- **Tokens como variables CSS** en un solo archivo; Tailwind (vía `@theme inline`) y los módulos CSS consumen los mismos valores, sin duplicar literales.
- **SCSS no forma parte del proyecto.**

## Tokens y nombres (PROVISIONAL)

### Catálogo semántico
Colores: marca, texto, acento, fondo, éxito, error, aviso. Tipografía: titular y texto (`next/font`). Espacios en **rem**: paso base `0.25rem` (`--token-espacio-1` … `--token-espacio-16`, hasta `4rem`). Radios `radio-s`, `radio-m`, `radio-l`. Sombras `sombra-s`, `sombra-m`. Foco: `anillo-foco`.

### Convención en código (evitar colisión con Tailwind)

Tailwind v4 define utilidades a partir de variables del theme (`--color-*`, `--spacing-*`, `--radius-*`, etc.). Si en `:root` pones `--color-marca: #…` y en `@theme inline` escribes `--color-marca: var(--color-marca)`, la referencia es **circular**.

**Dos capas:**

1. **`src/styles/tokens.css` (`:root`)** — única fuente de valores literales. Prefijo **`--token-`**: `--token-color-marca`, `--token-color-texto`, `--token-espacio-4`, `--token-radio-s`, `--token-font-titular`, etc. Los comentarios del archivo marcan valores **PROVISIONAL** hasta medir el logo.
2. **`globals.css` — `@theme inline`** — solo puentes hacia Tailwind v4 (`--color-*`, `--spacing`, `--radius-*`, `--shadow-*`), sin hex ni px sueltos. Espaciado: una variable base `--spacing: var(--token-espacio-1)` (multiplicador; `p-8` = `2rem`). Ejemplo: `--color-marca: var(--token-color-marca);`, `--radius-s: var(--token-radio-s);`, `--shadow-s: var(--token-sombra-s);`.
3. **CSS Modules** — siempre `var(--token-…)`, no las variables del theme de Tailwind, para no acoplar el módulo al bundler.

En documentación y revisiones se habla de «color marca» o «radio s»; en CSS el identificador completo es `--token-color-marca`, `--token-radio-s`.

### Tipografía de trabajo

Titulares: **Bricolage Grotesque**. Texto: **Inter**. Ambas con `next/font`, archivos variables, subconjunto latino, `display: swap` y pocos pesos. Se asignan a `--token-font-titular` y `--token-font-texto`. La tabla de dosis usa `tabular-nums` para que las cifras no se muevan al alinear columnas. La carga no debe producir salto de diseño (CLS).

Estas familias no están medidas contra el logo. Son la elección de trabajo de la fase 2 y se confirman cuando Grovelab entregue el logo real. Si el logo pide otro par, se cambian las fuentes y se conservan los mismos tokens.

### Movimiento reducido
Regla **global** en `globals.css` para `prefers-reduced-motion: reduce`, más ajustes **por módulo** o por efecto cuando haga falta una versión estática más fina.

## Catálogo de efectos
| Efecto | Dónde | Técnica | Costo | Respaldo |
|---|---|---|---|---|
| Parallax de capas (hoja, campo) | Portada | CSS `transform` + scroll-driven animations | Bajo | Imagen fija |
| Planta que crece al desplazarse | Experiencia "Del suelo a la cosecha" | SVG + CSS, sin video | Medio | Ilustración estática por etapas |
| Inclinación 3D suave en tarjetas | Tarjetas de producto y cultivo | CSS `perspective` y `transform` | Bajo | Sin inclinación |
| Aparición al desplazarse | Secciones | `opacity` + `transform` con IntersectionObserver | Bajo | Visible sin animar |
| Visor 3D del envase | Ficha de producto, solo al pulsar "Ver en 3D" | Opcional; requiere modelos 3D de los envases y carga diferida | Alto | Galería de fotos |

El visor 3D solo se hace si Grovelab entrega fotos o modelos suficientes; si no, queda fuera.

## Componentes base (en orden)
Botón, enlace, tarjeta de producto, tarjeta de cultivo, cabecera con menú, pie con contacto, buscador, tabla de dosis, botón y lista "Mi pedido", formulario del pedido, tarjeta de noticia.

## Reglas de contenido
- Nada de datos inventados: productos, cifras, certificaciones y teléfonos salen de Grovelab.
- Imágenes reales de producto y campo; si no hay, marcador claro `POR CONFIRMAR`.

## Criterios de aceptación visual
Revisión en celular (360 px) y escritorio (1440 px); contraste AA; foco visible; con `prefers-reduced-motion` todo se ve completo y estático; LCP ≤ 2,5 s en celular de gama media.

## Metas frente a la referencia

Once metas comprobables, adaptadas de la columna "Meta para Grovelab" en `docs/referencia-tqc.md` (revisión de la referencia tqc.com.pe), con su fase y su forma de verificación.

| # | Fase | Meta | Cómo se verifica |
|---|---|---|---|
| 1 | 2 | Sin desplazar, en escritorio y celular, se lee una frase de qué hace Grovelab y hay un botón a Productos visible de inmediato | Captura a 360 px y 1440 px (`/revision-visual`) sin desplazar la página |
| 2 | 2 | Encontrar un producto filtrando por cultivo o plaga en un solo panel, sin recargar la página; la URL conserva los filtros aplicados (se puede compartir el enlace y el botón Atrás del navegador funciona) | Prueba manual: marcar un filtro, confirmar que la grilla cambia sin recarga y que la URL refleja el filtro; compartir ese enlace en otra pestaña y comprobar que carga igual; usar el botón Atrás tras cambiar de filtro; operar el panel completo con teclado |
| 3 | 2 | La tabla de dosis es HTML real (no imagen ni PDF), legible a 360 px sin que se corte (desplazamiento interno con foco, o reorganización en filas/tarjetas apiladas), con cifras alineadas (`tabular-nums`); el PDF queda como descarga opcional; un dato de dosis no confirmado dice `POR CONFIRMAR` o "Consultar con un asesor", nunca una cifra inventada | Inspección del código (debe ser `<table>` con encabezados reales, no imagen ni PDF incrustado) + captura a 360 px comprobando que no hay scroll horizontal de toda la página (solo, si hace falta, un desplazamiento interno accesible por teclado) + revisión de contenido para confirmar que no hay cifras sin respaldo |
| 4 | 3 | Desde la ficha de producto, abrir WhatsApp con el mensaje redactado toma como máximo tres acciones: agregar al pedido, revisar con los datos mínimos y el consentimiento en la misma pantalla, enviar | Prueba manual contando las tres acciones desde la ficha de producto hasta que se abre WhatsApp con el mensaje redactado |
| 5 | 2 | Mantener un solo lenguaje de tarjeta, color y tipografía en todo el sitio | Captura a 1440 px comparando tarjetas de Inicio, catálogo y fichas; además, búsqueda con `rg` de colores (`#[0-9a-fA-F]{3,8}`) o tamaños sueltos (`px`/`rem` fuera de `var(--token-...)`) en los componentes, excluyendo `src/styles/tokens.css`, para confirmar que no hay literales fuera de los tokens (se aceptan `0`, `1px` y `@media`; los colores con `#` deben ser cero) |
| 6 | 2 | Si Grovelab cuenta con fotografía real de campo y de producto en uso, priorizarla sobre tomas de estudio repetitivas (depende del material que entregue Grovelab) | Revisión de contenido al incorporar cada pieza; sin fotografía real entregada, se marca `POR CONFIRMAR` en vez de usar una imagen genérica |
| 7 | 2 | Cada efecto usado debe tener un propósito explícito | Decisión UX escrita (plantilla de `/ux-ui-2026`) antes de implementar el efecto; revisión con `/revision-calidad` antes de cada commit |
| 8 | 2 | Todas las páginas se usan a 360 px sin desplazamiento horizontal ni pérdida de contenido, y siguen usables con zoom de texto al 200 % | Captura a 360 px (`/revision-visual`) por página; prueba de zoom del navegador al 200 % confirmando que no se corta contenido ni aparece scroll horizontal |
| 9 | 2 | Foco visible en todo elemento interactivo, nombres accesibles correctos en cada componente reutilizado, tabla de dosis en HTML semántico | Recorrido completo por teclado (Tab/Shift+Tab) verificando foco visible y orden lógico; inspección del nombre accesible de cada componente reutilizado (p. ej. tarjetas de cultivo) |
| 10 | Todas (se mide al cerrar cada fase) | LCP ≤ 2,5 s, CLS ≤ 0,1 e INP ≤ 200 ms en celular de gama media | Lighthouse en modo móvil sobre `npm run build` seguido de `npm run start` (no en modo desarrollo) |
| 11 | 2 | Los estados vacíos y de error están en español, con encabezado y una salida clara (ver todos los productos, contactar a un asesor); nada se abre solo (chats, ventanas emergentes) | Probar una búsqueda sin resultados y confirmar que el mensaje está en español, tiene encabezado y ofrece una salida; revisar que ningún chat o ventana emergente se abra sin que la persona lo pida |

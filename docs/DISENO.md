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

Titulares: **Fraunces**. Texto: **Inter**. Ambas con `next/font`, archivos variables, subconjunto latino, `display: swap` y pocos pesos. Se asignan a `--token-font-titular` y `--token-font-texto`. La tabla de dosis usa `tabular-nums` para que las cifras no se muevan al alinear columnas. La carga no debe producir salto de diseño (CLS).

Fraunces reemplaza a Plus Jakarta Sans (geométrica corporativa) por pedido explícito de un sentido agrícola distinto al de Fredoka (geométrica redondeada, la primera elección tras medir el logo): es una serif orgánica, con detalles suaves y carácter artesanal, cercana a la tendencia "del campo a la mesa" sin caer en lo infantil. Mantiene legibilidad en fichas técnicas y tablas de dosis. El logo como imagen (`src/images/grovelab-logo.png`) sigue siendo la referencia de color de marca; la tipografía de titulares no busca imitar sus letras.

### Escala tipográfica (H1-H3)

Tamaños fluidos con `clamp()`, interpolados entre 360 px y 1440 px (mismo rango que las capturas de `/revision-visual`). Tokens de tamaño en `--token-font-tamano-h1/h2/h3` (`src/styles/tokens.css`), puenteados a las utilidades `text-h1`, `text-h2`, `text-h3` de Tailwind v4 vía `@theme inline` (`globals.css`). El interlineado va en tokens aparte (`--token-interlineado-h1/h2/h3`) aplicados con `leading-[var(--token-interlineado-hN)]`: Tailwind v4.3.3 descarta por completo la clave `--text-*` si se declara junto a su pareja `--text-*--line-height` dentro de `@theme inline` (confirmado inspeccionando el CSS compilado; sin la pareja, el tamaño sí se genera).

| Nivel | `clamp()` | Peso | Interlineado | Tracking |
|---|---|---|---|---|
| H1 | `clamp(1.875rem, 1.55rem + 1.45vw, 2.85rem)` | 700 (`font-bold`) | 1.1 | `tracking-tight` |
| H2 | `clamp(1.5rem, 1.375rem + 0.56vw, 1.875rem)` | 600 (`font-semibold`) | 1.2 | `tracking-tight` |
| H3 | `clamp(1.125rem, 1.04rem + 0.37vw, 1.375rem)` | 600 (`font-semibold`) | 1.3 | normal |
| Texto | `1rem` fijo (`text-base`) | 400 | 1.5 (1.7 en cuerpo largo, p. ej. noticias) | normal |
| Rótulos (mayúsculas) | `0.875rem` fijo (`text-sm`) | 500-600 | 1.2 | `tracking-wide` (+0.025em) |

Texto y rótulos se quedan en tamaño fijo a propósito: son etiquetas cortas o párrafos de lectura, no titulares, y no se benefician de escalar con el viewport.

**Medida de línea:** 60-75 caracteres por línea. `max-w-prose` (Tailwind, 65ch) ya cumple esto en los encabezados de página y sección.

**`tabular-nums`:** ya aplicado en la tabla de dosis (clase global `.tabla-dosis`) y en las cifras de respaldo (`.cifraRespaldo`); cualquier cifra nueva en tabla o contador debe usar la misma utilidad o clase.

**Pendiente:** el token H3 todavía no está aplicado a los subtítulos de tarjeta (`text-lg`, p. ej. nombre de producto/cultivo) ni a encabezados intermedios (`text-xl`, p. ej. tabla de dosis, "Nuestros servicios"), porque hoy mezclan dos tamaños visuales distintos (1.125rem y 1.25rem fijos) que no se resolvieron en esta pasada. Se define antes de migrarlos.

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
| Indicador «surco» del menú | Menú principal (escritorio) | Línea de 2 px que se desliza al enlace señalado: anchor positioning + `:has()` en CSS Module | Bajo | Sin anchor positioning: cada enlace dibuja su línea con `scaleX`. Táctil: solo marca la página actual |
| Apertura del menú móvil | Panel del menú en celular | `clip-path` desde arriba + enlaces escalonados (`opacity`, `translateY`) | Bajo | Aparece sin animar |
| Cabecera que se compacta + progreso de lectura | Cabecera fija, todas las páginas | `animation-timeline: scroll(root)`; solo `transform` y `opacity`, el alto real no cambia (sin CLS) | Bajo | Sin soporte: fija y translúcida, sin línea de progreso |
| Transición entre páginas | Todas las páginas públicas | `<ViewTransition>` de React 19.3: salida 150 ms, entrada 300 ms con ascenso de 12 px; cabecera anclada; el nombre de la tarjeta continúa hasta el título de su ficha o cultivo | Bajo | Sin soporte del navegador: cambio de página normal |
| Borde «surco» entre franjas | Portada (franjas 2 a la penúltima) | Máscara SVG estática en `::before`, color heredado de la franja | Muy bajo | Sin máscaras: borde recto |

El visor 3D solo se hace si Grovelab entrega fotos o modelos suficientes; si no, queda fuera.

Los efectos que **responden a una acción** de la persona (menú, cabecera, transición entre páginas) no cuentan como el momento "wow" de la página: comunican estado o continuidad. El borde «surco» es estático. `/pedido` y `/zonas-comerciales` no llevan ningún efecto: son un formulario y una lista de contactos, y la claridad es el efecto; agregar o quitar productos del pedido no se anima. Todos comparten un solo motivo, la línea del surco en color marca, y los tokens de movimiento de `tokens.css` (`--token-movimiento-rapido` 150 ms, `--token-movimiento-base` 300 ms, `--token-curva-salida`, sin rebotes).

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

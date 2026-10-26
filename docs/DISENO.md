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

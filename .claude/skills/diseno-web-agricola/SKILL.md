---
name: diseno-web-agricola
description: Diseñador UI/UX senior para Grovelab (agro): jerarquía, ritmo, fichas técnicas y patrones visuales con Tailwind v4 y CSS, alineado a docs/DISENO.md. Úsala al diseñar o mejorar secciones públicas; la implementación técnica sigue la regla diseno-ui.mdc.
---

# Diseñador UI/UX — Grovelab

## Fuentes (orden de lectura)

1. `docs/DISENO.md` — dirección, tokens, catálogo de efectos.
2. `docs/ALCANCE.md` — qué entra y qué no en cada fase.
3. `@docs/planes/03-ui-ux-implementacion.md` — componentes y tareas UI ya acordadas.
4. Al escribir estilos en código: cumple también `.cursor/rules/diseno-ui.mdc` (no dupliques aquí su checklist técnico).

Stack fijo: **Tailwind v4 + CSS** (Modules y nativo), **sin SCSS**. Tokens en `src/styles/tokens.css` (`--token-*`). Movimiento con respaldo en `prefers-reduced-motion: reduce`.

## Cómo trabajar

1. **Contexto:** objetivo de la sección (informar, confiar, acercar al pedido), audiencia (agricultor en celular, técnico de compra) y contenido **real** disponible en Payload.
2. **Dos opciones breves:** layout + efecto del catálogo de `DISENO.md` (si aplica) + costo de rendimiento. Espera elección.
3. **Implementa** reutilizando `src/components/ui/*` y patrones de `src/styles/sitio.module.css` antes de inventar clases nuevas.
4. **Un “wow” por URL**; el resto sobrio. Sin efecto decorativo fuera del catálogo.
5. **Respaldos:** contenido completo en HTML estático; celular primero; sin movimiento si el usuario lo pide.
6. **Cierra** con nota: qué se hizo, qué efecto usa, qué falta de Grovelab (fotos, textos, SENASA).

## Jerarquía visual

- **Un H1 por página** (`EncabezadoPagina`). Secciones largas: H2 con `EncabezadoSeccion`; eyebrow en acento solo para agrupar (p. ej. «Catálogo»), no en cada bloque.
- **Orden de lectura en F:** titular → una frase de apoyo → acción principal → acción secundaria. En catálogo: filtros/búsqueda antes del grid de resultados.
- **Peso tipográfico:** titulares en color marca o texto según contraste; cuerpo en `text-texto` / `text-texto/85` para apoyo. No más de tres niveles visibles seguidos (H1 → lead → cuerpo).
- **CTA:** un primario por bloque (marca rellena); secundarios con borde o enlace subrayado. No competir con dos botones primarios adyacentes.
- **Datos técnicos** (SENASA, dosis, IA): mismo estilo que el cuerpo, con etiquetas semibold; no simular “ficha PDF” con tipografía diminuta.

## Ritmo y espaciado

- **Contenedor:** `contenedorPagina` / `max-w-6xl`; lectura larga `max-w-prose`. Fichas y tablas pueden usar ancho completo del contenedor.
- **Escala:** preferir tokens `--token-espacio-*` (vía utilidades Tailwind `p-*`, `gap-*`, `mt-*` o módulos CSS). Entre secciones de portada: separador + `padding-top` generoso (`sitio.seccion`); bloques destacados (buscador) pueden usar franja con fondo suave, no solo más `margin`.
- **Grids de tarjetas:** `gap` consistente (mismo que listados en `/productos`). Evitar una tarjeta suelta con otro `gap` en la misma página.
- **Huecos:** si no hay contenido publicado, **no reserves espacio** (sin placeholders de imagen inventados; ver decisión Blob en plan 03).
- **Táctil:** controles y enlaces de menú ≥ 44 px de alto (`min-h-11`).

## Tipografía

- **Dos roles fijos (nunca mezclar al revés):**
  - **Titular — Fraunces:** `font-titular` en H1, H2, H3, eyebrows de marca y cifras destacadas. Pesos 600–700; H1 de portada **`font-bold`**, `tracking-tight`, color **`text-marca`**.
  - **Texto — Inter:** `font-texto` en cuerpo, subtítulos, formularios, pie y descripciones (`text-sm`–`text-lg`, `leading-relaxed`).
- Tamaños de referencia: H1 `text-3xl`–`text-4xl` (portada hasta `2.85rem`), H2 `text-2xl`–`text-3xl`, tarjetas `text-lg`.
- **Confirmación de marca:** par de **trabajo** hasta medir el logo; cambios solo en `fuentes.ts` + tokens.
- **Cifras:** `tabular-dosis` / `tabular-nums`; no usar titular en párrafos largos.

## Marco UI/UX Senior (2026) — aplicado a Grovelab

Referencia de mercado; **siempre** filtrado por `docs/DISENO.md`, alcance fase 2 y reglas del repo (sin pagos, sin inventar datos).

### Enfoque estratégico

- **Sistema adaptativo, no página suelta:** contenido y bloques condicionados a Payload (global, catálogo, noticias); franjas (`CintaSeccion`) y CTAs según journey (explorar → buscar → ficha → contacto / WhatsApp).
- **Orquestación y service design:** priorizar recorridos transaccionales reales (pedido por WhatsApp, consultas, asesoría); wireframes rápidos solo si aclaran el flujo, no decoración.
- **Accesibilidad estructural:** WCAG AA, foco visible, HTML semántico, `prefers-reduced-motion`, contraste en hero con panel legible — no revisión final opcional.

### Flujo idea → código

- Prototipado asistido con **Tailwind + tokens + componentes `ui/`**; un cambio visual por tarea, verificable en 360/1440 (`revision-visual`).
- **Design system vivo:** tokens `--token-*`, `anchoContenedor`, `claseCampoFormulario`, catálogo de efectos en `DISENO.md`; misma tarjeta en listado y relacionados.
- **Investigación continua:** métricas y feedback del cliente; estados vacíos honestos; iterar copy y datos en panel, no suposiciones en UI.

### Tendencias UI 2026 (traducción Grovelab)

| Tendencia | Cómo se implementa aquí | Límite |
|-----------|-------------------------|--------|
| **Liquid glass** (superficies translúcidas) | Hero (`contenidoHero`), paneles `bg-superficie` + `backdrop-filter` suave, bordes `color-mix` | Sin blur pesado en móvil gama baja; con `prefers-reduced-motion`: fondo sólido |
| **Minimalismo funcional** | Franjas de color, poco ruido, LCP &lt; 2,5 s, sin librerías de animación | Modo oscuro: solo si entra en alcance y tokens |
| **Micro-interacciones** | Hover/focus en tarjetas y botones; menú móvil accesible | Sin chat/voz en fase 2 salvo que lo apruebe alcance |

Antes de añadir glass, parallax o 3D nuevo: **registrar en catálogo `DISENO.md`** o proponer entrada con costo y respaldo.

## Fichas técnicas de producto

Seguir el orden de `@docs/planes/03-ui-ux-implementacion.md` (U5). Resumen UX:

| Bloque | Criterio |
|--------|----------|
| Migas | Productos → categoría (si hay) → nombre; no sustituir por solo «← Volver». |
| Cabecera | Categoría como eyebrow; H1 nombre; resumen corto debajo. |
| Cultivos | Chips/enlaces a `/cultivos/[slug]`; omitir si no hay relación. |
| Galería | Solo con media real (Blob); `next/image` + `alt` del panel; sin foto de stock. |
| Datos técnicos | Lista etiqueta–valor; **omitir filas vacías** (IA, formulación, SENASA). |
| PDF | Enlaces claros «Ficha técnica» / «Hoja de seguridad», nueva pestaña, `rel="noopener noreferrer"`. |
| Relacionados | Máx. 4 productos del mismo cultivo; mismas tarjetas que el listado. |
| Cierre | «Pedir información» + WhatsApp solo si hay `WHATSAPP_NUMBER`; sin efecto animado en la ficha. |

Tono: ficha de **consulta técnica**, no folleto marketing. Sin precios ni claims no respaldados en panel.

## Tablas de dosis

- **HTML semántico:** `<table>`, `<caption>` (visible o `sr-only`), `<th scope="col">`. Clase `tabla-dosis` en el cuerpo de la tabla.
- **Móvil (360 px):** contenedor `overflow-x-auto`; cabecera sticky o lectura clara de columna; nunca una tabla que obligue a adivinar qué número es qué.
- **Contenido:** solo filas con dato; celdas vacías «—» solo si el campo existe pero no aplica.
- **Densidad:** `text-sm`, filas con padding vertical uniforme; sin zebra agresivo ni bordes dobles.

## Estilo de marca (contenido)

- Formulación **por cultivo**, cercanía al campo, respaldo (asesoría, registro cuando exista en datos).
- Mucho aire, fotos reales cuando haya; textos pendientes: `POR CONFIRMAR` visible, no copy inventado de producto o certificación.

## Patrones que NO se usan

| Evitar | Motivo |
|--------|--------|
| Carruseles automáticos | Ocultan contenido y molestan en celular. |
| Autoplay de video o audio | Solo reproducción explícita del usuario. |
| Animaciones decorativas sin propósito | Rompen «un wow por página» y el presupuesto de movimiento. |
| Parallax / 3D en fichas o formularios | Reservados a rutas del catálogo en `DISENO.md`. |
| Texto sobre imagen sin contraste AA | Hero con panel semitransparente o imagen separada del titular. |
| Múltiples familias o tamaños arbitrarios | Solo tokens y utilidades del theme. |
| Skeletons eternos o spinners en catálogo SSR | Contenido en HTML; estados vacíos honestos. |
| Iconos genéricos que sustituyen datos | Preferir texto claro en agro técnico. |
| Modales para información esencial | Dosis y SENASA visibles sin clic extra. |
| Placeholders de imagen “bonitos” sin asset | Omitir bloque hasta Blob/contenido (plan 03). |

*(Contraste AA, foco visible, `prefers-reduced-motion` y LCP: ver `diseno-ui.mdc`.)*

## Salida esperada

Código alineado al plan 03 + una línea: efecto del catálogo (si hay), elección Tailwind vs módulo (referencia a `diseno-ui.mdc`), pendientes Grovelab.

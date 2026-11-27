# Plan 03 — Implementación UI/UX completa (fase 2)

Estado: **aprobado** (2026-10-26). En código: **U1–U7** y parte de **U12** (SEO, 404, error). Siguiente: **U8**. Una tarea por pasada de trabajo.

### Decisiones aprobadas (U0)

| # | Decisión |
|---|----------|
| 1 | Se aprueba este plan completo como guía de implementación UI/UX fase 2. |
| 2 | **Medios (Vercel Blob):** la tarea **1 del plan 02** queda **después** del layout de fichas, cultivos y portada. Hasta existir `BLOB_READ_WRITE_TOKEN` en el entorno, la UI usa **maquetación completa sin imágenes reales**: no placeholders decorativos inventados; los bloques de galería, hero fotográfico e imagen de cultivo **no se renderizan** si no hay URL de media en Payload. Cuando Blob esté activo, los mismos componentes (`GaleriaProducto`, hero, `TarjetaCultivo` con imagen) muestran `next/image` sin rediseñar la página. |

Referencias obligatorias: `AGENTS.md`, `docs/DISENO.md`, `docs/ALCANCE.md`, `@docs/planes/02-sitio-y-catalogo.md`.

## Objetivo

Llevar el sitio público de **estructura funcional + estilos parciales** a **diseño coherente de punta a punta**: mismos tokens, mismos componentes, un efecto del catálogo por URL, accesibilidad AA, mobile first y sin datos inventados.

Este plan **no sustituye** el plan 02: cubre sobre todo las tareas **6–14** del 02 desde la óptica de interfaz, y deja explícito qué depende de **medios (Blob)** o de **contenido Grovelab**.

## Punto de partida (inventario real del repo)

*Sincronizado con el código: 2026-10-27. En repo: **U1–U7** y parte de **U12** (SEO sistema, `not-found`, `error`); pendiente cerrar **U8–U11** y E2E portada.*

| Área | Estado actual | Brecha principal |
|------|---------------|------------------|
| Tokens + `@theme` + fuentes | Hecho (`tokens.css`, `globals.css`, `fuentes.ts`: Bricolage Grotesque + Inter) | Colores PROVISIONAL hasta medir logo |
| Sistema UI y estilos compartidos | `src/styles/sitio.module.css`, `listado.module.css`, `ficha-producto.module.css`, `portada.module.css`; `src/lib/clases-sitio.ts`; catálogo en `src/components/ui/` (`BotonEnlace`, `EncabezadoPagina`, tarjetas, `EstadoVacio`, `TablaDosis`, `Migas`) | Sin `galeria-producto.tsx`, `institucional.module.css` ni `revelar-al-scroll.tsx` (aparición en `/productos` vía CSS `animation-timeline: view()` en `listado.module.css`); `EncabezadoSeccion` duplicado en `components/` y `components/ui/` |
| Cabecera / pie | `site-header` sticky, `site-footer`, `MenuPrincipal` (móvil: `aria-expanded`, foco, Escape), `SaltoContenido` → `#contenido` con `scroll-mt` | Datos de contacto en pie **POR CONFIRMAR** hasta global U9; enlaces legales `/privacidad` pendientes U11 |
| Portada (`/`) | Parallax; global `textos-sitio` (titular/subtítulo); historia 3 pasos; franja buscador; destacados condicionales; servicios y CTA (textos servicios estáticos POR CONFIRMAR) | **U8:** sin franja certificaciones, testimonio video ni últimas noticias; hero sin capa foto (Blob); tarjetas destacadas sin variante plana explícita documentada en CSS |
| `/productos`, `/cultivos` | `EncabezadoPagina`, `listado.module.css`, `EstadoVacio`; productos: filtro `?categoria`, paginación `?pagina`, `aria-current` en chips; aparición al scroll en grid productos; cultivos: `TarjetaCultivo` con `efecto3d` en listado | Imágenes en tarjetas cuando exista Blob; paginación en cultivos solo si crece el catálogo (hoy `limit` fijo) |
| Ficha producto (`/productos/[slug]`) | **U5:** migas, H1, chips a cultivos, DL técnico condicional, `TablaDosis`, relacionados (máx. 4), CTAs contacto/WhatsApp | Sin `GaleriaProducto` ni enlaces PDF; campos galería/ficha técnica/hoja seguridad **no** están en colección `productos` (plan 02 tarea 1 + Blob) |
| `/buscar` | Alineado a listado: `EncabezadoPagina`, `FormularioBuscador`, grid + `TarjetaProducto`, contador de resultados, `EstadoVacio` | Sin animación de revelado (coherente: ningún efecto en esta URL) |
| Nosotros, Servicios, Noticias, Contacto | `EncabezadoPagina` + maquetación mínima (`sitio.tarjetaPlana` / grid); `/noticias` con `EstadoVacio`; `/contacto` lee `?producto=` (Zod, máx. 200) sin formulario | Contenido desde global **U9**; formulario + consultas **U11**; `/privacidad` no existe |
| Colección Noticias + `/noticias/[slug]` | Solo ruta `/noticias` (vacío honesto); menú incluye Noticias | Colección Payload y ficha **U10**; bloquea sección noticias en portada **U8** |
| Playwright + calidad | `e2e/buscar.spec.ts`, `e2e/menu-movil.spec.ts`, `e2e/admin-acceso.spec.ts`; Vitest en `buscar-query` y `filtro-categorias` | **U12:** E2E `/` sin errores de consola; revisión visual 360/1440 no sistematizada en repo |

## Principios de implementación (Senior)

1. **Un efecto «wow» por URL** — tabla en `docs/DISENO.md` § Catálogo de efectos. No añadir parallax en listados ni 3D en ficha producto.
2. **Tailwind vs CSS Module** — seguir `docs/DISENO.md` § Estrategia de estilos:
   - **Tailwind:** layout (`flex`, `grid`, `gap`, responsive), tipografía utilitaria, estados hover/focus cuando son 1–3 clases.
   - **CSS Module (`*.module.css`):** parallax, scroll-driven, `@keyframes`, aparición al scroll, 3D en tarjetas, tablas complejas, capas del hero.
   - **Módulos consumen solo `var(--token-*)`**, nunca literales de color fuera de `tokens.css`.
3. **Componentes de servidor por defecto.** Cliente solo para: menú móvil, aparición al scroll (IntersectionObserver), acordeón si hiciera falta (evitar si no es necesario).
4. **Sin librerías nuevas de UI ni animación** (Framer, etc.). IntersectionObserver nativo o CSS `animation-timeline` donde ya se usa en portada.
5. **Contenido condicional:** si no hay dato en Payload, **no renderizar la sección** (no huecos vacíos). Textos de marca: global o `POR CONFIRMAR` visible solo donde el plan 02 lo permite.
6. **Cada tarea termina con:** `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`; si hay pantalla nueva o cambio de interacción, revisión 360 px y 1440 px.

## Arquitectura de archivos (objetivo)

```
src/
  components/
    ui/                          # Componentes base (ver catálogo abajo)
      boton-enlace.tsx           # Server: <Link> o <button> con variantes
      encabezado-pagina.tsx      # Server: eyebrow + h1 + lead (páginas internas)
      encabezado-seccion.tsx     # Ya existe; mover aquí o reexportar
      tarjeta-producto.tsx       # Server: link + imagen opcional + meta
      tarjeta-cultivo.tsx        # Server: link; clase 3D en módulo
      estado-vacio.tsx           # Server: mensaje + CTA
      tabla-dosis.tsx            # Server: <table> con estilos módulo
      galeria-producto.tsx       # Server + next/image; placeholder si sin Blob
    layout/
      site-header.tsx            # Cliente: subcomponente menú móvil
      site-footer.tsx
      menu-movil.tsx             # Cliente: foco atrapado, Escape, aria
    formulario-buscador.tsx
    animacion/
      revelar-al-scroll.tsx      # Cliente: envuelve hijos; respaldo sin JS = visible
  styles/
    tokens.css                   # Sin cambios salvo logo medido
    sitio.module.css             # Evolucionar desde components/sitio.module.css
    portada.module.css
    ficha-producto.module.css    # Tabla sticky header opcional, bloques ficha
    listado.module.css           # Grid + revelar
    institucional.module.css     # Nosotros / Servicios
  lib/
    url-contacto.ts              # WhatsApp opcional WHATSAPP_NUMBER (sin secretos en público)
    imagen-payload.ts            # Resolver URL de media cuando exista Blob
```

**Migración suave:** mover `src/components/sitio.module.css` → `src/styles/sitio.module.css` (o `components/ui/sitio.module.css`) en la tarea U1 y actualizar imports; no duplicar.

## Catálogo de componentes base (especificación)

Cada componente: props tipadas estrictas, `min-h-11` en controles táctiles, `focus-visible` coherente con `globals.css`.

| Componente | Variantes | Notas |
|------------|-----------|--------|
| `BotonEnlace` | `primario`, `secundario`, `sobreMarca` (CTA inverso) | `href` → Link; `type="submit"` → button. No duplicar clases en cada página. |
| `EncabezadoPagina` | `destacado?`, `titulo`, `descripcion?` | H1 único por página. Usar en listados y fichas. |
| `EncabezadoSeccion` | ya definido | H2 en portada y bloques largos. |
| `TarjetaProducto` | `producto: { slug, nombre, resumen?, categoria? }`, `imagen?` | En listados y relacionados. Imagen: `next/image` con `sizes` acotado. |
| `TarjetaCultivo` | `cultivo`, `imagen?`, `efecto3d?: boolean` | `efecto3d` true en `/cultivos` y `/cultivos/[slug]`; false en touch (`hover: none`). |
| `EstadoVacio` | `titulo`, `mensaje`, `enlace?: { href, etiqueta }` | Reemplazar párrafos sueltos en listados vacíos. |
| `TablaDosis` | filas tipadas desde Payload | Clase global `tabla-dosis` + módulo para cabecera sticky en móvil (`overflow-x-auto` contenedor). |
| `GaleriaProducto` | `imagenes[]` | Si array vacío: no renderizar bloque. Placeholder neutro solo en dev si se acuerda; en prod mejor omitir. |

## Efecto único por ruta (checklist de cumplimiento)

| Ruta | Efecto permitido | Implementación | Respaldo |
|------|------------------|----------------|----------|
| `/` | Parallax 2 capas | `portada.module.css` (existente) | Capas estáticas + panel texto |
| `/productos` | Aparición al scroll | `revelar-al-scroll.tsx` + `listado.module.css` | Hijos visibles sin clase animada |
| `/productos/[slug]` | Ninguno v1 | — | — |
| `/cultivos`, `/cultivos/[slug]` | Inclinación 3D tarjetas | `sitio.module.css` `.tarjetaEnlace` / variante cultivo | Tarjeta plana |
| `/buscar` | Ninguno (claridad) | — | — |
| `/nosotros` | Aparición secciones | mismo `revelar-al-scroll` | Estático |
| `/servicios`, `/contacto` | Ninguno | — | — |
| `/noticias` | Aparición lista | `revelar-al-scroll` | Estático |
| `/noticias/[slug]` | Ninguno (lectura) | — | — |
| 404 público | Ninguno | `not-found.tsx` del grupo `(frontend)` | — |

**Regla:** quitar o no activar 3D en portada destacados si se considera segundo «wow» en `/`. Hoy portada ya usa parallax; las tarjetas destacadas deben usar **variante plana** (`tarjetaPlana` o sin hover 3D) para respetar un efecto por página.

## Tareas de implementación (orden estricto)

Cada tarea = un PR o commit lógico. No mezclar menú móvil con ficha producto en el mismo paso.

---

### U0 — Aprobación y congelar alcance visual ✅

- Alcance congelado: sin fase 3 (pedido), fase 5 (planta), visor 3D.
- **Blob:** ver tabla «Decisiones aprobadas» — layout primero, token después; anotar en PRs de U5/U6/U8: `Pendiente: BLOB_READ_WRITE_TOKEN`.

**Criterio:** cumplido.

---

### U1 — Sistema UI: tokens en componentes y botones

**Archivos:** `src/components/ui/boton-enlace.tsx`, mover/refactor `encabezado-seccion`, consolidar `sitio.module.css`, actualizar `page.tsx`, `formulario-buscador.tsx`, `buscar/page.tsx` para usar `BotonEnlace`.

**Detalle:**

- Extraer las cadenas `clasesBotonPrimario` / `clasesBotonSecundario` de `page.tsx` al componente.
- Añadir utilidad `contenedorPagina` (clase Tailwind compartida o constante exportada `const contenedorPagina = "mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12"` en `src/lib/clases-sitio.ts` para no repetir).
- Documentar en comentario de un solo archivo la regla Tailwind vs módulo (enlace a `DISENO.md`).

**Criterio:** cero regresión visual en `/` y `/buscar`; lint/typecheck/build verdes.

---

### U2 — Cabecera y pie (tarea 6 del 02, capa UI)

**Archivos:** `site-header.tsx`, `menu-movil.tsx` (cliente), `site-footer.tsx`, opcional `layout.module.css` para sombra.

**Menú móvil (requisitos no negociables):**

- Enlace «Saltar al contenido» como primer foco: visible al tabular, destino `<main id="contenido">` con `scroll-margin-top` para no quedar bajo la cabecera sticky.
- Enlace de la ruta actual con `aria-current="page"` (escritorio y panel móvil).
- Breakpoint: navegación horizontal desde `min-width: 48rem` (o el que ya use el proyecto); debajo, botón «Menú» / «Cerrar» visible.
- `aria-expanded`, `aria-controls`, `id` en el panel.
- Al abrir: foco al primer enlace; **Tab** cicla dentro del panel; **Escape** cierra y devuelve foco al botón.
- Fondo scroll bloqueado opcional (`overflow-hidden` en body) solo si no causa saltos de layout.
- Enlace WhatsApp en pie **solo** si `process.env.WHATSAPP_NUMBER` está definido (documentar en `.env.example` sin valor).

**Pie:** grid o stack con marca, contacto (POR CONFIRMAR hasta global), enlaces legales futuros, año.

**Prueba:** Playwright nuevo `e2e/menu-movil.spec.ts` — abrir menú, ver enlace Cultivos, cerrar con Escape (sin credenciales).

**Criterio:** foco visible en todos los enlaces; 44 px táctil; build verde.

---

### U3 — Encabezados y estados vacíos en catálogo

**Archivos:** `encabezado-pagina.tsx`, `estado-vacio.tsx`; actualizar `cultivos/page.tsx`, `productos/page.tsx`.

**Diseño:**

- Misma estructura que `/buscar`: eyebrow «Catálogo», H1, párrafo lead.
- Listado: grid `gap` consistente con portada (`listado.module.css` o clases compartidas).
- Tarjetas: `TarjetaCultivo` / `TarjetaProducto` (aún sin imágenes si no hay Blob).

**Criterio:** vacío honesto con `EstadoVacio` + enlace a contacto o cultivos según contexto.

---

### U4 — Listado de productos: filtro y aparición (tarea 8 del 02)

**Archivos:** `productos/page.tsx`, `revelar-al-scroll.tsx`, `listado.module.css`, `src/lib/filtro-categorias.ts` (parseo `?categoria=slug` con Zod, espejo de buscar-query).

**Comportamiento:**

- Chips o `<select>` de categorías generado desde Payload (solo publicadas). El filtro activo se distingue visualmente y con `aria-current` o `aria-pressed`.
- URL refleja filtro: `/productos?categoria=slug`. Slug inexistente: listado vacío con mensaje, sin 404.
- Paginación cuando el total supere el límite de página (12). La URL lleva `pagina`. Misma regla en noticias (U10).
- Cada `<li>` del grid envuelto en `RevelarAlScroll` con `threshold` bajo (0.1) y `rootMargin` generoso.
- Cliente: si `prefers-reduced-motion: reduce`, no añadir clase animada (prop o matchMedia en mount).

**Efecto único:** solo aparición; sin 3D en esta URL.

**Prueba Vitest:** parseo de query categoría (vacío, slug inválido, slug válido).

**Criterio:** un efecto por página; filtro compartible por URL.

---

### U5 — Ficha de producto (tarea 8 del 02, maquetación completa)

**Dependencia:** campos `galeria`, `fichaTecnica`, `hojaSeguridad` en colección Productos (añadir en Payload cuando toque datos; galería/PDF pueden existir vacíos). **Blob:** no bloquea U5 — galería y PDF solo se muestran si hay media resuelta; sin token, omitir bloque (decisión U0 §2).

**Archivos:** `productos/[slug]/page.tsx`, `ficha-producto.module.css`, `tabla-dosis.tsx`, `galeria-producto.tsx`, `tarjeta-producto.tsx` (relacionados).

**Orden visual móvil (obligatorio):**

1. Migas: Productos → categoría (si hay) → nombre.
2. H1 + categoría + chips cultivos (enlaces a `/cultivos/[slug]`).
3. Galería (principal primero; `alt` desde panel).
4. Resumen / «Para qué sirve» (`resumen` o campo largo si se añade).
5. DL técnico: ingrediente, formulación, SENASA — **solo filas con dato**.
6. `TablaDosis` con scroll horizontal, `<caption>` oculto visualmente o visible, `scope="col"` en encabezados, y en &lt; 40rem las celdas conservan el nombre de columna (cabecera sticky o filas apiladas con etiqueta).
7. Enlaces PDF (nueva pestaña, `rel="noopener noreferrer"`) si existen archivos.
8. «Productos del mismo cultivo» (máx. 4, misma query por primer cultivo del producto).
9. CTA «Pedir información» → `/contacto?producto=...` (ya existe).
10. Enlace WhatsApp mensaje prefijado si `WHATSAPP_NUMBER` (mismo criterio que pie).

**Efecto:** ninguno.

**Criterio:** tabla usable en 360 px; sin secciones vacías; migas reutilizables (`Migas`) también en cultivo y noticia.

---

### U6 — Cultivos: listado y página de cultivo (tarea 9 del 02)

**Archivos:** `cultivos/page.tsx`, `cultivos/[slug]/page.tsx`, `tarjeta-cultivo.tsx`.

**Detalle:**

- Hero cultivo: nombre, resumen, imagen de cultivo cuando exista campo imagen (añadir en colección si falta, con migración — coordinar con 02).
- Listado de productos del cultivo con `TarjetaProducto` en grid.
- **3D solo aquí y en listado `/cultivos`:** reutilizar reglas CSS `@media (hover: hover) and (prefers-reduced-motion: no-preference)`.

**Criterio:** en touch, cero transform 3D; en escritorio con ratón, inclinación sutil.

---

### U7 — Buscador: pulido final (tarea 10 del 02)

**Archivos:** `buscar/page.tsx`, `formulario-buscador.tsx`, `sitio.module.css`.

- Resultados: mismo grid y `TarjetaProducto` que listados.
- Contador opcional: «N resultados» (sin exponer datos sensibles).
- Estados vacío/error alineados con `EstadoVacio`.

**Criterio:** Vitest y E2E existentes siguen verdes.

---

### U8 — Portada: alineación al plan § Inicio (tarea 7 del 02)

**Archivos:** `page.tsx`, `portada.module.css`, posible `src/lib/portada-secciones.ts` (lógica qué renderizar).

**Checklist secciones 1–10 del 02:**

| # | Sección | Acción UI |
|---|---------|-----------|
| 1 | Portada | Mantener parallax; capa foto con `next/image` solo cuando global `imagenPortada` + Blob devuelvan URL (**omitir capa hasta token**, decisión U0 §2) |
| 2 | Tres pasos | Ya hecho; revisar contraste panel hero |
| 3 | Buscador | Ya hecho |
| 4–5 | Destacados | Tarjetas **planas** (sin 3D) |
| 6 | Certificaciones | Componente `franja-respaldo.tsx`; render solo si global trae cifras confirmadas |
| 7 | Servicios | Ya hecho; textos desde global cuando U9 amplíe campos |
| 8 | Testimonios | `tarjeta-video.tsx`: poster + botón reproducir; sin autoplay. Solo URLs de YouTube o Vimeo validadas en servidor; si no coinciden, no se incrusta. |
| 9 | Noticias | `ultimas-noticias.tsx` si `noticias` publicadas ≥ 1 |
| 10 | CTA contacto | Ya hecho |

**Criterio:** ninguna sección vacía visible; un solo wow (parallax).

---

### U9 — Global «Textos del sitio» + Nosotros y Servicios (tarea 11 del 02)

**Backend (mínimo para UI):** ampliar `textos-sitio.ts` con grupos: contacto (teléfono, email, dirección, redes), bloques Nosotros (array de { titulo, cuerpo, imagen? }), servicios (array de 3 ítems), certificaciones (array opcional), testimonio (url video opcional). **Migración** con `import type` separado.

**UI:** `nosotros/page.tsx`, `servicios/page.tsx`, `institucional.module.css`, `revelar-al-scroll` en Nosotros.

**Criterio:** sin párrafo único interminable; videos con control usuario.

---

### U10 — Noticias (tarea 12 del 02 + UI)

**Backend:** colección `noticias` (draft/publish), rutas `/noticias`, `/noticias/[slug]`.

**UI:** listado con fecha formateada `es-PE`, ficha lectura cómoda (ancho `max-w-prose` para cuerpo), imagen destacada opcional.

**Criterio:** menú Noticias lleva a estado vacío claro si no hay posts.

---

### U11 — Contacto (tarea 13 del 02 + UI)

**Fase A (sin política):** tarjetas con teléfono, correo, dirección, mapa/enlace si hay URL — datos desde global; `POR CONFIRMAR` donde falte. Si la URL trae `?producto=`, el texto de ayuda muestra el nombre (sanitizado, longitud acotada) aunque el formulario siga apagado.

**Ruta `/privacidad`:** página estática con el texto del global cuando exista. Sin texto aprobado, la ruta no se publica y el checkbox de la fase B no aparece.

**Fase B (con política):** formulario + colección Consultas; estilos compartidos con `panelBuscador`; checkbox privacidad obligatorio; **no** loguear PII.

**Criterio:** formulario no visible hasta Fase B aprobada.

---

### U12 — Cierre visual y rendimiento (tarea 14 del 02)

**Plantilla de metadatos (SEO de páginas nuevas, no redirecciones de WordPress — esas son fase 4):**

- En el layout público: `metadataBase` desde `NEXT_PUBLIC_SITE_URL`, plantilla de título `«%s — Grovelab»`.
- `sitemap.ts` y `robots.ts` con las rutas públicas indexables (sin `/admin`).
- Open Graph mínimo (título, descripción, `locale: es_PE`) en layout; imagen OG solo cuando haya media en Blob.

**Estados de sistema:**

- `src/app/(frontend)/not-found.tsx`: 404 en español, mismo contenedor y CTA a inicio y cultivos.
- `error.tsx` del grupo público: mensaje genérico en español y botón reintentar; sin volcar el error al visitante.

**Checklist manual:**

- Contraste AA en marca, texto, CTA, enlaces sobre degradados.
- `prefers-reduced-motion` en `/`, `/productos`, `/nosotros`.
- LCP portada: imagen hero con width/height o `sizes`; sin JS pesado en above-the-fold.
- Foco visible en menú móvil, formularios, tablas.
- Consistencia 360 / 1440 en: Inicio, `/productos`, ficha, `/cultivos/[slug]`, Contacto.

**Automatizado:**

- E2E: `/` sin error consola (listener en test).
- `npm run lint`, `typecheck`, `test`, `build`.

**Entregable:** lista `POR CONFIRMAR` para cliente (logo, fotos, textos, política).

---

## Dependencias entre tareas (grafo)

```
U0 → U1 → U2
U1 → U3 → U4 → U5
U1 → U6
U3 → U7
U1 → U8 (paralelo tras U3 recomendado)
U9 (global) → U8 ítems 6–9, U11
U10 → U8 ítem 9
Tarea 02-1 Blob (cuando haya token) → activar imágenes en U5/U6/U8 sin cambiar layout
```

## Adiciones incorporadas tras revisión (2026-10-26)

Huecos que el plan aprobado no nombraba y que sí caben en fase 2. Quedan enganchados a la tarea indicada; no abren una fase nueva.

| Tema | Dónde quedó | Por qué |
|------|-------------|---------|
| Saltar al contenido + `aria-current` | U2 | El menú sticky tapa el destino del foco si no hay ancla |
| Paginación y filtro inválido | U4, U10 | Los listados hoy cortan en un `limit` fijo sin decirlo |
| Tabla de dosis accesible en 360 px | U5 | `overflow-x` solo no conserva el sentido de cada cifra |
| Migas reutilizables | U5, U6, U10 | Solo la ficha las mencionaba |
| Video solo YouTube/Vimeo | U8 | Un iframe arbitrario desde el panel es un riesgo |
| `/privacidad` y `?producto=` | U11 | El checkbox y el CTA de la ficha no tenían página ni lectura de la query |
| `metadataBase`, sitemap, robots, OG | U12 | Títulos por página ya existen; falta la plantilla del sitio. Las redirecciones viejas siguen en fase 4 |
| 404 y error públicos | U12 | No hay `not-found` del grupo `(frontend)` |

**No se agrega** (sigue fuera): pedido y zonas, planta animada, visor 3D, redirecciones WordPress, skeletons de carga, estilos de impresión, JSON-LD. Imágenes: se mantiene la decisión U0 (omitir el bloque) aunque `docs/DISENO.md` hable de marcador `POR CONFIRMAR` en fotos; el marcador queda para textos, no para huecos de imagen.

## Fuera de alcance de este plan

- Pedido WhatsApp, zonas, «Mi pedido» (fase 3).
- Migración ~70 productos y redirecciones (fase 4).
- Planta animada portada (fase 5).
- Visor 3D envase.
- Cambiar tokens de color sin medición de logo (solo sustitución literal en `tokens.css` cuando el cliente entregue valores).

## Verificación final (aceptación del plan 03)

1. Todas las rutas del 02 tienen **misma familia visual** (encabezados, tarjetas, vacíos, CTAs).
2. **Un efecto** del catálogo por URL, con respaldo estático comprobado.
3. Menú móvil cumple teclado y foco.
4. Ficha producto legible en móvil con tabla de dosis.
5. Sin datos inventados; secciones sin contenido no ocupan espacio.
6. Suite de calidad verde; E2E ampliados según U2 y U12.

## Cómo usar este plan en implementación

1. U0–U7 cerrados en código (U12 parcial: `metadataBase`, sitemap, robots, `not-found`, `error`). Siguiente paso: **U8**.
2. Ejecutar **una tarea U*n* por sesión de agente**; al terminar, marcar en este doc o en el PR qué criterios se cumplieron.
3. Ante duda estética, `docs/DISENO.md` manda sobre preferencia personal.
4. Referenciar en commits: `docs/planes/03-ui-ux-implementacion.md` (tarea U4, etc.).

---

*Documento generado para implementación por perfil Senior: especifica archivos, comportamiento, accesibilidad, efectos y dependencias con el plan 02 sin duplicar reglas de negocio de Payload ya descritas allí.*

# Plan 02 — Fase 2: sitio público y catálogo

Estado: propuesta. El almacenamiento de fotos y PDF queda decidido: Vercel Blob. El alcance del filtro de `/productos` también queda decidido: panel único de categoría, cultivo, plaga y texto libre; `/buscar` pasa a ser una redirección a `/productos` con los mismos filtros, lo que fusiona la tarea 10 dentro de la tarea 8. El visor 3D del envase y la analítica de eventos puntuales (como `cultivo_visitado`) quedan fuera de esta fase: se revisitan en las fases 4 y 5 respectivamente. No se instala nada ni se escribe código hasta aprobar este documento. Las demás respuestas de «Confirmar antes de empezar» siguen abiertas y no bloquean estas decisiones.

Referencias: `AGENTS.md`, `docs/ALCANCE.md`, `docs/DISENO.md`, `docs/referencia/propuesta-cliente.md`, `docs/planes/01-base.md`.

## Revisión frente a la web antigua (2026-11-04)

Se recorrió https://grovelabperu.com.pe (WordPress + WooCommerce) para ver qué tiene y qué le falta a esta fase. Solo lectura; no se copió nada al código.

**Lo que la web antigua tiene y el modelo actual no puede guardar.** Cada ficha antigua muestra presentaciones («100 g y 25 kg», «1L»), una foto de envase, un PDF (hoy siempre el mismo portafolio general) y, en los nutricionales, una composición en porcentajes (N, P₂O₅, K₂O, microelementos, extracto de algas) que no es un «ingrediente activo». La colección Productos no tiene campos para ninguno de los cuatro. Decisión: se agregan en esta fase (tarea 5, después de la tarea 1), porque el pedido de la fase 3 elige una presentación y no conviene llegar a esa fase sin el campo.

**Contenido de referencia para el panel.** La web antigua tiene textos de Nosotros, dos servicios con descripción («Importación directa» y «Asesoría y logística en importaciones», ambos citan la Ley 30.190 y SENASA), datos de la sede de Lima, seis zonas comerciales con asesor (RTC), celular y ciudades, y tres noticias. Sirven como borrador para cargar en el panel, **no** como dato confirmado: Grovelab valida que siguen vigentes antes de publicarlos. Las zonas se guardan para la fase 3. Las categorías antiguas son diez (Plaguicidas → Insecticidas, Fungicidas, Herbicidas; Reguladores de crecimiento; Bioestimulantes; Nutricionales; Fitoprotectores; Adyuvantes; Sólidos; Acondicionadores de suelo), pero la asignación de productos está desordenada (p. ej. un nutricional dentro de Insecticidas): la lista por producto la valida Grovelab, no se copia.

**`/buscar`.** La web antigua no tenía página de búsqueda, solo un campo en la cabecera. Aquí `/buscar` ya es una redirección a `/productos`, pero el menú y el sitemap la siguen mostrando como página propia: dos entradas al mismo sitio. Decisión: «Buscar» sale del menú y del sitemap; la redirección se conserva para enlaces ya compartidos; el buscador de Inicio y el de la cabecera (si se agrega) envían directo a `/productos`.

**`/cultivos`.** La web antigua no tenía página de cultivos, pero `docs/ALCANCE.md` la incluye y es la entrada natural del agricultor («¿qué uso en mi palto?»). Se mantiene, con una condición: depende de que Grovelab entregue la relación producto–cultivo–dosis, que no existe en la web antigua. Mientras no haya al menos un cultivo publicado, el enlace «Cultivos» no aparece en el menú ni en el sitemap, y los botones de Inicio que llevan a cultivos no se renderizan.

## Para qué es esta fase

Que un visitante, sobre todo un agricultor en el celular, entienda en el primer pantallazo que Grovelab formula para cada cultivo, encuentre un producto por cultivo, plaga o categoría, y abra una ficha técnica clara. Que el equipo de Grovelab cambie un texto o una foto en el panel y lo vea en la web sin un programador.

La impresión no sale de acumular efectos. Sale de tres cosas juntas: tipografía grande y mucho aire, fotos reales de campo y de producto, y un solo momento de movimiento por página, tomado del catálogo de `docs/DISENO.md`. El resto de la página se queda quieto. En celular y con `prefers-reduced-motion` el contenido se ve completo, sin animación obligatoria.

La experiencia completa «Del suelo a la cosecha» (la planta que crece al desplazarse) es la fase 5. En esta fase la portada solo cuenta esa idea en tres pasos estáticos, para que el cliente reconozca la historia sin construirla todavía.

## Qué entra

- Portada real, en lugar del texto «estamos preparando el sitio».
- Nosotros, Servicios, Blog/Noticias y Contacto.
- Catálogo: categorías, cultivos, fichas de producto, tabla de dosis y buscador por cultivo, plaga o categoría.
- Cabecera, pie y componentes base que esas páginas comparten.
- Fotos y PDF fuera de la base de datos (primera tarea técnica de esta fase).
- Textos, banners e imágenes editables en Payload por el rol editor. El editor sigue sin ver ni tocar Usuarios.

## Qué no entra

- Zonas comerciales y el flujo «Mi pedido» (fase 3).
- Carga masiva de los ~70 productos, redirecciones de la web vieja y SEO de migración (fase 4). En esta fase el panel permite cargar un lote corto de muestra, no el catálogo histórico completo.
- La planta que crece al hacer scroll y el selector de cultivo de esa experiencia (fase 5).
- Visor 3D del envase: fuera de esta fase. Se revisita en la fase 4, y solo si Grovelab entrega modelos reales. Mientras tanto la ficha usa galería de fotos.
- Chat en línea de un proveedor externo, precios publicados, pagos, cuentas de cliente y comprobantes.
- Datos inventados: cifras, certificaciones, teléfonos, nombres de productos o textos de ficha. Si falta el dato, la sección no se muestra o lleva el marcador `POR CONFIRMAR`.

## Confirmar antes de empezar

Fotos y PDF ya no están en esta lista: van a Vercel Blob. El paquete, cuando se implemente, es `@payloadcms/storage-vercel-blob` en **3.92.0**, igual que el resto de Payload. El token del almacén vive solo en el servidor (nombre previsto `BLOB_READ_WRITE_TOKEN` en `.env.example`, sin valor real). No se agrega otra librería de estilos ni se usa S3 en esta fase.

El alcance del filtro de `/productos` tampoco está ya en esta lista: queda resuelto como panel único con categoría, cultivo y plaga (además de texto libre), como pedía la referencia de `docs/referencia-tqc.md`. `/buscar` deja de tener panel propio: pasa a ser una redirección (307) a `/productos` que traslada los mismos parámetros, para no romper enlaces ya compartidos ni el buscador de Inicio. Esto fusiona la tarea 10 (Buscador) dentro de la tarea 8.

La tipografía de trabajo ya está elegida (tarea 3): Bricolage Grotesque para titulares e Inter para texto. No es la fuente definitiva de marca: se confirma al medir el logo real de Grovelab. Si el logo pide otro par, se cambian las familias sin cambiar los tokens.

Sin las respuestas siguientes no se redactan textos definitivos ni se enciende el formulario.

1. **Lote de muestra para la demo.** Mínimo útil para que la portada no se vea vacía: 3 cultivos, 3 categorías y 6 productos con foto, cultivo, plaga (si aplica), registro SENASA y una fila de dosis. Los nombres salen de Grovelab. La migración de ~70 productos espera a la fase 4.
2. **Contacto real:** teléfono, correo, dirección y redes. Número de WhatsApp solo si autorizan el botón. Si no llega, el pie muestra «POR CONFIRMAR» y no un número falso.
3. **Texto de política de privacidad.** Hace falta antes de guardar el formulario de Contacto (nombre y teléfono). Sin ese texto se construye la página de contacto con los datos públicos, y el formulario queda apagado.
4. **Cifras y certificaciones de Nosotros.** Solo se publican las que Grovelab entregue por escrito. Si no hay cifra, esa franja no aparece.

## Cómo se siente cada página

Máximo un efecto del catálogo por página. Técnica en CSS (Modules o nativo); Tailwind solo para layout y estados legibles. Tokens existentes (`--token-*`). Contraste AA. Áreas táctiles de al menos 44 px. Foco visible con el anillo ya definido.

| Página | Qué debe sentir el cliente | Único efecto | Si no hay movimiento |
|---|---|---|---|
| Inicio | «Formulan para mi cultivo», no un distribuidor genérico | Parallax suave de dos capas (campo y hoja) en la portada | Imagen fija, mismo titular y mismos botones |
| Productos | El catálogo está ordenado y se encuentra rápido | Aparición al entrar en pantalla | Todo visible de entrada |
| Ficha | Ficha técnica de verdad: cultivo, dosis, SENASA, PDF | Ninguno en esta fase. El visor 3D se evalúa en la fase 4, solo con modelos reales de Grovelab | Galería de fotos |
| Cultivo | «Esto es lo que uso en este cultivo» | Inclinación 3D muy leve en las tarjetas, solo con puntero fino | Tarjeta plana |
| Nosotros | Respaldo y cercanía, sin un muro de texto | Aparición de secciones | Texto e imágenes estáticos |
| Servicios | Tres ofertas claras, no dos párrafos perdidos | Ninguno. La claridad es el efecto | — |
| Noticia | Lectura cómoda; el video no se mueve solo | Aparición de la lista | Lista estática |
| Contacto | Sé a quién llamar en diez segundos | Ninguno | — |

Prohibido en todas: carrusel automático, texto ilegible sobre foto, video con reproducción automática, y más de un efecto «wow» en la misma URL.

### Inicio, de arriba hacia abajo

1. Portada. Titular grande, una frase y dos acciones: «Ver cultivos» y «Contactar». El titular definitivo lo escribe Grovelab; mientras tanto no se publica una frase inventada como si fuera de marca: se usa un titular marcado en el panel, con valor inicial pendiente de confirmación.
2. Tres pasos estáticos de la historia (suelo, crecimiento, cosecha), con enlace a cultivos. No es la experiencia de la fase 5.
3. Buscador: cultivo, plaga o categoría. Un solo campo principal y filtros claros. Envía directo a `/productos` con los filtros (panel único, tarea 8).
4. Cultivos destacados (los que el panel marque).
5. Productos destacados.
6. Franja de respaldo solo si hay certificaciones o cifras confirmadas.
7. Servicios, en tres tarjetas que llevan a `/servicios`.
8. Testimonios en video solo si Grovelab entrega la URL. El video carga al pulsar reproducir.
9. Últimas noticias, si hay al menos una publicada.
10. Cierre: botón a Contacto. Las zonas comerciales no se prometen aquí; llegan en la fase 3.

Si una franja no tiene contenido publicado, no se reserva un hueco vacío: la sección no se renderiza.

### Ficha de producto

Orden de lectura, pensado para celular:

- Nombre, categoría y cultivos.
- Galería (foto principal primero; `alt` escrito en el panel, no el nombre del archivo).
- Para qué sirve, en un párrafo corto.
- Ingrediente activo, formulación y registro SENASA, solo si el dato existe.
- Tabla de dosis: cultivo, plaga si aplica, dosis, nota. Tabla de verdad (`<table>`), con encabezados. Las cifras usan `tabular-nums` para que no salten al alinear columnas.
- Enlaces a ficha técnica y hoja de seguridad (PDF), si existen.
- Productos del mismo cultivo.
- Acción «Pedir información», que lleva a Contacto con el nombre del producto en la consulta. El botón de armar pedido y la lista «Mi pedido» son la fase 3.
- Si `WHATSAPP_NUMBER` está definido, un enlace que abre WhatsApp con un mensaje ya armado («Hola, quiero información sobre [nombre]»). No guarda datos en el servidor.

### Buscador

- Ruta `/buscar`: no tiene panel ni listado propio. Redirige (307) a `/productos` trasladando los filtros recibidos (cultivo, plaga, categoría, texto libre) como `searchParams`. Mantiene compatibles los enlaces antiguos y el buscador de Inicio.
- El panel único de filtros vive en `/productos` (categoría, cultivo, plaga y texto libre); ver tarea 8.
- La consulta se valida en el servidor con Zod, en `/productos`. No se confía en el navegador.
- Sin resultados: mensaje en español y un enlace a cultivos, no una página en blanco.
- La URL de `/productos` refleja los filtros para poder compartirla.

## Direcciones

Español, sin mezcla visible de inglés.

| Ruta | Página |
|---|---|
| `/` | Inicio |
| `/productos` | Listado |
| `/productos/[slug]` | Ficha |
| `/cultivos` | Listado |
| `/cultivos/[slug]` | Cultivo y sus productos |
| `/nosotros` | Nosotros |
| `/servicios` | Servicios |
| `/noticias` | Listado |
| `/noticias/[slug]` | Noticia |
| `/contacto` | Contacto |
| `/buscar` | Redirección a `/productos` con los mismos filtros. No aparece en el menú ni en el sitemap |

Cada ruta tiene `title` y `description` propios. Las redirecciones desde las URL de WordPress quedan en la fase 4.

## Qué se edita en el panel

Colecciones nuevas, etiquetas en español, `push: false`, migración en `src/migrations` con `import type` separado, como ya dice `AGENTS.md`. Borradores: solo lo publicado se ve en la web.

| Colección o global | Quién escribe | Notas |
|---|---|---|
| Medios (fotos y PDF) | Administrador y editor | Almacén externo. Límite y tipos: jpeg, png, webp y pdf. El servidor revisa el tipo, no solo la extensión. |
| Categorías | Administrador y editor | Nombre, slug, orden, imagen opcional. |
| Cultivos | Administrador y editor | Nombre, slug, resumen, imagen, destacado sí/no. |
| Plagas | Administrador y editor | Nombre y slug. Sirven al buscador y a la dosis. |
| Productos | Administrador y editor | Categoría, cultivos, plagas, textos, SENASA, galería, PDF, dosis, destacado. |
| Noticias | Administrador y editor | Título, slug, fecha, resumen, cuerpo, imagen. |
| Textos del sitio (global) | Administrador y editor | Frases de portada, Nosotros, Servicios y datos de contacto. |

Acceso en el servidor, no solo ocultando menús:

- Lectura pública: solo documentos publicados, sin correo ni teléfono de personas.
- Editor: crea, edita y borra el contenido de esta fase. No lista usuarios ni cambia roles.
- Administrador: todo, incluida la colección Usuarios, como en la fase 1.

La colección de ensayo `prueba-ensayo` se retira en la primera tarea de contenido, con su migración de bajada. No forma parte del sitio que ve el cliente.

## Formulario de contacto

Campos: nombre, teléfono y mensaje corto. Nada más. Casilla obligatoria de aceptación de la política de privacidad, con enlace al texto. El envío se valida con Zod en el servidor. Se guarda en una colección «Consultas» visible solo para administrador y editor. No se escribe el cuerpo ni el teléfono en logs.

Si el texto de la política no está aprobado, esta colección y el formulario no se publican. La página de Contacto igual muestra los datos de la empresa que sí estén confirmados.

Aviso por correo al equipo: queda anotado como mejora, no como tarea de esta fase, para no sumar un proveedor sin confirmarlo.

## Decisiones UX de esta fase

Aplicadas con `/ux-ui-2026`. Cada una indica qué metas de la sección «Metas frente a la referencia» de `docs/DISENO.md` cumple, por número.

### Listado de productos (`/productos`)

- **Tarea:** encontrar rápido un producto por categoría, cultivo, plaga o palabra libre, desde un solo panel de filtros, sin perderse en una lista larga.
- **Contexto móvil:** celular, conexión variable; panel de filtros colapsado en 360 px (acordeón o botón «Filtrar»), visible en una fila en 1440 px; el campo de texto no debe bloquear el dictado por voz.
- **Patrón:** grilla de tarjetas (foto, nombre, categoría, cultivos como etiquetas) con panel único de categoría, cultivo, plaga y texto libre; la selección cambia la URL (`/productos?categoria=slug&cultivo=slug&plaga=slug&q=texto`) y se refresca sin recarga completa (Server Component + `searchParams`, validado con Zod). Botón «Quitar filtros» que limpia panel y URL a la vez. `/buscar` redirige aquí trasladando los mismos parámetros.
- **Texto clave:** «Categoría», «Cultivo», «Plaga objetivo», «Buscar por palabra» (de uso común); etiqueta «Cotizar» en vez de precio; vacío: «Aún no hay productos publicados en esta categoría» o, sin resultados por combinación de filtros, «No encontramos productos con estos filtros».
- **Estados:** carga (indicador discreto en la grilla, sin bloquear el panel) · vacío (mensaje + enlaces a «Ver todos los productos» y a contacto — WhatsApp si `WHATSAPP_NUMBER` está confirmado, si no `/contacto`) · error de servidor («No se pudo cargar el catálogo en este momento» + reintentar) · sin precio («Cotizar», nunca un precio inventado) · sin conexión (mismo patrón que error).
- **Efectos:** «Aparición al desplazarse» en las tarjetas (único efecto de la página, ya definido en el catálogo de `docs/DISENO.md`). Respaldo: `prefers-reduced-motion: reduce` → tarjetas visibles sin animar; igual en móvil y sin JavaScript.
- **Medición:** `categoria_filtrada` (valor: slug), `filtro_buscador_aplicado` y `busqueda_sin_resultados` (valor: filtros estructurados, nunca el texto libre), sin datos personales.
- **Metas de DISENO.md:** 2, 5, 6, 7, 8, 9, 10, 11.

### Ficha de producto (`/productos/[slug]`)

- **Tarea:** saber si el producto sirve para su cultivo o plaga, ver la dosis correcta y decidir si pide más información.
- **Contexto móvil:** se lee de pie, en campo, a veces con poca luz; la tabla de dosis no debe exigir desplazar toda la página en horizontal.
- **Patrón:** orden fijo de «Ficha de producto» arriba — nombre/categoría/cultivos → galería → descripción corta → ingrediente activo/formulación/SENASA si existen → tabla de dosis HTML → PDFs → productos relacionados → acción de contacto.
- **Texto clave:** «Ingrediente activo», «Formulación», «Registro SENASA» y «Periodo de carencia» explicados la primera vez en la propia página; dato no confirmado → `POR CONFIRMAR` o «Consultar con un asesor», nunca una cifra inventada; cada PDF muestra su peso aproximado junto al nombre («Ficha técnica (PDF, 420 KB)»).
- **Estados:** carga (la página se renderiza con los datos listos; solo la galería puede mostrar un marcador de carga) · vacío por campo (se muestra `POR CONFIRMAR`, no se oculta la fila) · error (producto no encontrado o no publicado → 404 en español con enlace a «Ver todos los productos») · sin precio (solo «Pedir información» y WhatsApp si está configurado) · sin conexión (igual que error, con reintento).
- **Efectos:** ninguno en esta fase; el visor 3D se evalúa en la fase 4, solo con modelos reales de Grovelab.
- **Medición:** evento `ficha_tecnica_descargada` (valor: slug del producto).
- **Etiquetas de cultivo y plaga:** cultivo → `/cultivos/[slug]`; plaga → `/productos?plaga=slug` (no hay ruta de plagas; el panel único vive en `/productos`); categoría → `/productos?categoria=slug`. El nombre accesible de cada etiqueta incluye el texto visible completo (p. ej. «Cultivo: papa»), pasado como prop explícita en cada uso, para evitar el bug de nombre accesible visto en `docs/referencia-tqc.md`.
- **Metas de DISENO.md:** 3, 5, 6, 8, 9, 10. (La meta 4 —pedido en tres acciones— es de la fase 3: aquí la ficha solo ofrece «Pedir información» y el enlace de WhatsApp condicionado a `WHATSAPP_NUMBER`.)

### Cultivos (`/cultivos` y `/cultivos/[slug]`)

- **Tarea:** ver qué productos usa Grovelab para «mi cultivo» sin filtrar a mano.
- **Contexto móvil:** a menudo se llega desde la etiqueta de cultivo de una ficha, no desde el menú; el nombre del cultivo debe quedar claro de inmediato.
- **Patrón:** `/cultivos` como grilla de tarjetas de cultivo; `/cultivos/[slug]` con foto y resumen del cultivo y la grilla de sus productos publicados (misma tarjeta que en el listado).
- **Texto clave:** nombre del cultivo como encabezado; vacío: «Aún no hay cultivos publicados» / «Aún no hay productos publicados para este cultivo» con enlace a `/productos`.
- **Estados:** carga (igual que el listado) · vacío (mensaje + enlace a `/productos` o `/buscar`) · error (cultivo no encontrado → 404 en español) · sin precio («Cotizar») · sin conexión (mismo patrón de reintento).
- **Efectos:** inclinación 3D muy leve en las tarjetas, solo con puntero fino (`@media (pointer: fine)`). Respaldo: tarjeta plana en dedo/táctil o con `prefers-reduced-motion: reduce`.
- **Medición:** el evento `cultivo_visitado` queda fuera de esta fase; se revisita en la fase 5 junto con el resto de la analítica, para no sumar medición puntual antes de tener el conjunto completo.
- **Nombre accesible:** cada tarjeta de cultivo recibe su `aria-label` o texto visible como prop explícita en cada uso (listado, página de cultivo, etiquetas de la ficha de producto), nunca un valor heredado por defecto de otro componente — el bug visto en `docs/referencia-tqc.md`.
- **Metas de DISENO.md:** 5, 6, 7, 8, 9, 10.

### Buscador (`/buscar`)

- **Tarea:** no perder un enlace ya compartido ni el buscador de Inicio ahora que el panel de filtros se unificó en `/productos` (ver esa sección arriba).
- **Patrón:** `/buscar` no tiene panel propio; es una redirección (307) a `/productos` que traslada los mismos parámetros (texto libre, cultivo, plaga, categoría) como `searchParams`.
- **Estados:** sin estado propio; hereda el de `/productos` tras la redirección.
- **Efectos:** ninguno.
- **Metas de DISENO.md:** cumplidas por `/productos`; aquí solo se evita romper enlaces.

## Tareas

Una tarea por vez. Cada una termina con lint, typecheck, test y build. Si toca pantalla, revisión en 360 px y 1440 px. No se mezcla con la tarea 6 de la fase 1 (despliegue); se puede construir en local mientras no exista la cuenta de Vercel.

La tarea 10 (Buscador) queda fusionada dentro de la tarea 8: el panel único de filtros y la redirección de `/buscar` se construyen ahí. El número de tarea 10 se conserva como referencia cruzada (ver su entrada más abajo) para no renumerar el resto del plan.

Orden de commits dentro de las tareas 8 y 9 (filtros y buscador unificado primero, ficha después, cultivos al final):

| Commit | Qué entra | Tarea del plan | Verificación |
|---|---|---|---|
| a | Filtro de categoría en `/productos` | 8 (listado) | lint, typecheck, test, build; captura 360/1440 px con y sin filtro; filtro operable con teclado, foco visible |
| b | Panel único (categoría, cultivo, plaga, texto libre) con URL y botón «Quitar filtros»; `/buscar` redirige a `/productos` | 8 (fusiona la 10) | lint, typecheck, test (Vitest: filtros vacíos, combinación, texto largo), build, `test:e2e`; captura 360/1440 con el panel abierto y cerrado; recorrido por teclado del panel y el botón «Quitar filtros» |
| c | Estado vacío del panel con sus dos salidas | 8 (fusiona la 10) | lint, typecheck, test (Playwright: filtro sin resultados, redirección de `/buscar`), build; captura 360/1440 del estado vacío; comprobar que nada se abre solo |
| d | Tabla de dosis HTML real en la ficha | 8 (ficha) | lint, typecheck, test, build; captura 360/1440; en 360 px la tabla no exige scroll horizontal de toda la página; recorrido por teclado de la tabla y los PDF |
| e | Peso visible en los PDF y etiquetas que enlazan al catálogo filtrado | 8 (ficha) | lint, typecheck, build; revisión manual del peso mostrado contra el archivo subido; nombre accesible de cada etiqueta con el texto visible completo |
| f | `/cultivos` y `/cultivos/[slug]` | 9 | lint, typecheck, test, build; captura 360/1440 de ambas páginas; cada tarjeta anuncia su propio nombre; la inclinación 3D desaparece con `prefers-reduced-motion` o en pantallas táctiles |

**Estado de implementación:** los commits a, b, c, d y f ya estaban o quedaron aplicados en el código (filtro de categoría, panel de `/buscar` con botón «Quitar filtros», estado vacío con dos salidas, tabla de dosis, páginas de cultivo). El commit e solo trae la parte de las etiquetas (plaga enlazando a `/buscar?plaga=`, cultivo a `/cultivos/[slug]`, nombre accesible explícito en ambas): el peso visible del PDF **queda pendiente**, porque todavía no existe la colección Medios ni los campos `fichaTecnica`/`hojaSeguridad` en Productos — eso depende de la tarea 1, que no se ha empezado. `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build` corrieron en verde con estos cambios; las capturas a 360/1440 px y el recorrido manual por teclado quedan pendientes de revisión.

Nota de esta revisión: el código hoy todavía tiene a `/buscar` como página propia con panel propio (commit b/c, hecho antes de esta decisión) y a `/productos` con filtro de categoría únicamente. Falta el commit que unifica ambos paneles en `/productos` y convierte `/buscar` en redirección — ver la tarea 8 más abajo.

### 1. Medios fuera de la base

Almacén: Vercel Blob, con `@payloadcms/storage-vercel-blob` **3.92.0**. Colección Medios. Variable `BLOB_READ_WRITE_TOKEN` documentada en `.env.example` sin valor real. Probar subida de una imagen y un PDF en el panel. Criterio: el archivo no queda como bytea en Postgres.

### 2. Cerrar el ensayo

Migración que elimina `prueba-ensayo` si la tabla existe. Quitar la colección del config. El menú del panel queda solo con Usuarios y lo que esta fase vaya sumando.

### 3. Tipografía

Antes del catálogo. Cargar con `next/font` dos familias variables, subconjunto latino, `display: "swap"` y pocos pesos: **Bricolage Grotesque** en titulares e **Inter** en texto. Conectarlas a `--token-font-titular` y `--token-font-texto` en `src/styles/tokens.css` (hoy stacks genéricos marcados POR CONFIRMAR). La tabla de dosis usa `tabular-nums`. Comprobar que la carga no desplaza el diseño (CLS). Actualizar `docs/DISENO.md`. Las familias son de trabajo: se confirman contra el logo real de Grovelab; si el logo pide otro par, se sustituyen las fuentes y se mantienen los mismos tokens.

### 4. Categorías, cultivos y plagas

Tres colecciones, slugs únicos, etiquetas en español, borrador/publicado. Pantallas públicas de cultivos en vacío honesto: «Aún no hay cultivos publicados». Sin productos inventados.

### 5. Productos y dosis

Colección Productos relacionada con las anteriores. Tabla de dosis en la ficha. Galería y PDF opcionales. Un producto de prueba se carga a mano desde el panel con datos que entregue Grovelab; si todavía no hay datos, la ficha no se rellena con ejemplos.

**Pendiente:** la colección Productos hoy no tiene campos de galería ni de PDF (ficha técnica, hoja de seguridad); se agregan con su propia migración cuando exista la colección Medios de la tarea 1.

**Ampliación (revisión frente a la web antigua):** en la misma migración, o en una inmediatamente posterior, se suman:

- `presentaciones`: lista de filas con un texto corto (p. ej. «100 g», «25 kg», «1 L»). En la ficha se muestran como etiquetas bajo el nombre. Es el campo que usará «Agregar a mi pedido» en la fase 3.
- `composicion`: lista de filas elemento + porcentaje, para nutricionales y bioestimulantes. Se muestra en una tabla HTML con `tabular-nums`, separada de «Ingrediente activo». Si está vacía, la sección no aparece.
- Foto principal y PDF ya quedan cubiertos por galería y ficha técnica.

Verificación: lint, typecheck, test, build; `migrate:status` al día; captura 360/1440 de una ficha con y sin presentaciones y composición.

### 6. Cabecera y pie

Menú en español a las rutas de esta fase, sin «Buscar» (es una redirección, no una página). «Cultivos» solo aparece si hay al menos un cultivo publicado. En celular, menú que se abre y se cierra con teclado, foco atrapado mientras está abierto, y botón de cierre visible. Pie con los datos confirmados. Enlace a WhatsApp solo si existe `WHATSAPP_NUMBER`.

### 7. Portada

Sustituir el texto provisional. Parallax de dos capas según el catálogo, con imagen fija de respaldo. Secciones 1 a 10 de este plan, ocultando las que no tengan contenido. El buscador de la portada lleva directo a `/productos` con los filtros. Los botones hacia cultivos solo se muestran si hay cultivos publicados.

### 8. Listado de productos, buscador unificado y ficha

Panel único de filtros en `/productos`: categoría, cultivo, plaga y texto libre (todos opcionales), validado con Zod en el servidor. La URL refleja los filtros elegidos (`/productos?categoria=slug&cultivo=slug&plaga=slug&q=texto`) y el resultado se refresca sin recarga completa. Botón «Quitar filtros» que limpia panel y URL a la vez. Esto fusiona la tarea 10 (Buscador): `/buscar` deja de tener panel propio y pasa a ser una redirección (307) que traslada los mismos parámetros a `/productos`, para no romper enlaces ya compartidos ni el buscador de Inicio.

Estado vacío: «Aún no hay productos publicados en esta categoría» o, sin resultados por combinación de filtros, «No encontramos productos con estos filtros», con dos salidas: «Ver todos los productos» y un enlace de contacto (WhatsApp si `WHATSAPP_NUMBER` está confirmado; si no, `/contacto`).

Eventos de medición: `categoria_filtrada` (valor: slug), `filtro_buscador_aplicado` y `busqueda_sin_resultados` (valor: filtros estructurados, nunca el texto libre), sin datos personales.

Ficha en `/productos/[slug]`: orden ya fijado en «Decisiones UX de esta fase». Las etiquetas de cultivo enlazan a `/cultivos/[slug]`, las de plaga a `/productos?plaga=slug` y las de categoría a `/productos?categoria=slug`; el nombre accesible de cada etiqueta incluye el texto visible completo («Cultivo: papa»), pasado como prop explícita en cada uso para no heredar el nombre de otro componente. Los enlaces de PDF muestran su peso aproximado junto al nombre del archivo. Dato de dosis o SENASA no confirmado: `POR CONFIRMAR` o «Consultar con un asesor», nunca una cifra inventada. Evento de medición `ficha_tecnica_descargada` (valor: slug del producto).

Aparición al desplazarse solo en el listado; ningún efecto en la ficha en esta primera versión. `alt` obligatorio en la foto principal.

Playwright: abrir `/buscar` sin sesión y confirmar la redirección a `/productos` con el estado vacío correspondiente, sin credenciales.

### 9. Página de cultivo

`/cultivos` lista las tarjetas de cultivo; `/cultivos/[slug]` lista los productos publicados de ese cultivo, con el nombre del cultivo como encabezado. Estado vacío: «Aún no hay cultivos publicados» (listado) o «Aún no hay productos publicados para este cultivo» (ficha de cultivo), con enlace a `/productos` o `/buscar`. Inclinación 3D solo en dispositivos con puntero fino (`@media (pointer: fine)`); en el dedo o con `prefers-reduced-motion: reduce`, tarjeta plana.

Cada tarjeta de cultivo recibe su `aria-label` o texto visible como prop explícita en cada uso (listado, página de cultivo, etiquetas de la ficha de producto), nunca un valor heredado por defecto de otro componente — el bug de nombre accesible visto en `docs/referencia-tqc.md`.

### 10. (Fusionada con la tarea 8)

El panel único de filtros, su estado vacío y sus eventos de medición se construyen dentro de la tarea 8, en `/productos`. `/buscar` pasa a ser solo una redirección a `/productos` con los filtros recibidos. Ver tarea 8.

### 11. Nosotros y Servicios

Contenido desde el global del sitio. Nosotros: bloques cortos, no un solo texto interminable. Videos solo al pulsar. Servicios: las tres líneas de la propuesta (importación, asesoría y logística, registro y marca propia) como estructura editable; el texto largo lo pone Grovelab.

### 12. Noticias

Listado y ficha. El editor publica una noticia de prueba con texto real o la deja vacía. Sin noticias, el enlace del menú lleva a un estado vacío claro, no a un error.

### 13. Contacto

Datos públicos primero. Formulario y colección Consultas solo cuando exista la política de privacidad. Misma regla de datos mínimos que el pedido: nombre, teléfono, mensaje, aceptación.

### 14. Cierre de la fase

Revisión de contraste, foco y movimiento reducido en Inicio, ficha y Contacto. LCP de la portada apuntando a 2,5 s en celular de gama media (imagen de portada con tamaño acotado, sin librerías de animación). `payload migrate:status` al día en la base de desarrollo. Resumen de lo que sigue en `POR CONFIRMAR` para el cliente.

## Seguridad y permisos

- El panel sigue exigiendo sesión. Cache Components sigue desactivado mientras el admin sea Payload 3.92.0.
- Las rutas públicas no usan runtime Edge: leen Payload en Node.
- El editor no gana acceso a Usuarios ni a datos de otros usuarios.
- Consultas de contacto: solo roles del panel. No hay cuenta pública.
- No registrar datos personales. No poner secretos en `NEXT_PUBLIC_`.
- PDF e imágenes con tope de tamaño (10 MB, el mismo criterio ya usado para documentos) y tipos permitidos explícitos.

## Qué tiene que entregar Grovelab para que la demo impresione

Sin esto la estructura se puede enseñar, pero no va a «maravillar»:

- Logo medido (para sustituir los colores provisionales de los tokens).
- Confirmación de las familias de trabajo (Bricolage Grotesque e Inter) contra el logo real. Si no encajan, se sustituyen sin cambiar `--token-font-titular` ni `--token-font-texto`.
- Tratamiento tú o usted para los textos de la interfaz (botones, mensajes de estado), hoy POR CONFIRMAR en `docs/DISENO.md`.
- Fotos horizontales de campo y fotos de envase de los productos del lote de muestra.
- El lote de muestra descrito arriba, con registros SENASA reales.
- Teléfono, correo, dirección y, si aplica, WhatsApp.
- Texto de política de privacidad, antes del formulario.
- Cifras o certificaciones solo si pueden publicarse.
- URL de testimonios, si quieren video en la portada.
- Validación de los textos de la web antigua que se quieran reutilizar (Nosotros, Servicios, contacto de Lima, noticias), incluida la vigencia de lo que dicen sobre la Ley 30.190 y SENASA.
- Categoría correcta de cada producto (la asignación de la web antigua está desordenada).
- Presentaciones y, en nutricionales, composición de cada producto del lote de muestra.
- Relación producto–cultivo–dosis. Sin ella, la página de cultivos no se publica en el menú.

**Qué tarea bloquea cada pendiente, dentro de las tareas 8 y 9 de esta fase (la 10 queda fusionada en la 8):**

| Pendiente | Bloquea |
|---|---|
| Tratamiento tú/usted confirmado | Los textos de botones y estados vacíos de las tareas 8 y 9 (se usa un tratamiento provisional consistente mientras tanto) |
| Lote de muestra (3 cultivos, 3 categorías, 6 productos con foto, cultivo, plaga, SENASA, dosis) | Tareas 8 y 9 — sin datos reales no hay qué filtrar, tabular ni listar |
| Fotos de campo y de envase del lote de muestra | Tareas 8 y 9 — sin ellas, las tarjetas y la galería quedan con `POR CONFIRMAR` |
| Número de WhatsApp (`WHATSAPP_NUMBER`) | La salida de WhatsApp en el estado vacío del panel y el enlace de la ficha, ambos en la tarea 8 |
| Texto de política de privacidad | No bloquea las tareas 8, 9 y 10; sigue pendiente para la tarea 13 (Contacto) |

## Verificación

- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`.
- Playwright de la fase 1 sigue en verde. Se suma el caso de `/buscar` y el de la portada sin error de consola.
- Revisión manual en 360 px y 1440 px de Inicio, ficha y Contacto.
- Con `prefers-reduced-motion: reduce`, la portada no se mueve y el titular sigue legible.
- Un editor de prueba publica un cultivo y no ve Usuarios.
- Ningún número, precio ni certificación en pantalla que no esté en el panel con fuente de Grovelab.

## Criterios de aceptación

1. La portada provisional desaparece. Inicio, catálogo, cultivos, nosotros, servicios, noticias y contacto existen en español.
2. Un editor cambia un producto en el panel y la ficha pública muestra el cambio, sin tocar código.
3. El buscador filtra por cultivo, plaga y categoría, y no devuelve borradores.
4. La tabla de dosis se lee en el celular sin perder los encabezados.
5. Hay un solo efecto del catálogo por página, con respaldo estático.
6. Fotos y PDF no están dentro de Postgres.
7. No hay flujo de pedido, ni zonas, ni la planta animada de la fase 5.
8. No hay datos inventados en la interfaz.

## Después de esta fase

Fase 3: zonas comerciales y pedido por WhatsApp, reutilizando la ficha y el contacto. Fase 4: los ~70 productos, las URL viejas, el SEO de migración y, si Grovelab entrega modelos reales, el visor 3D del envase. Fase 5: la planta que crece en la portada, sustituyendo los tres pasos estáticos de esta fase, y la analítica de eventos puntuales (como `cultivo_visitado`) que esta fase deja pendiente.

# Referencia visual y de UX: tqc.com.pe

> Revisión de solo lectura hecha con Claude in Chrome sobre `https://tqc.com.pe/`, empresa de otro rubro agropecuario, como insumo para decidir pantallas y efectos de Grovelab. No se copió texto, imágenes, código, colores exactos ni nombres de marca de esa web; las descripciones son en palabras propias. Cada hallazgo indica la página donde se vio y si es OBSERVADO o INFERIDO. No se tomaron capturas de pantalla (no fueron necesarias para este resumen).

**Recorrido hecho:** Inicio → catálogo de productos (con filtros y una búsqueda sin resultados) → una ficha de producto → sección de Cultivos (listado y una ficha de cultivo) → Contacto. Revisión a 1440 px completa. **La revisión a 360 px no se pudo hacer** (NO COMPROBADO): la herramienta de redimensionar ventana no cambió el ancho de renderizado en esta sesión, pese a repetir el intento; el resto del análisis es sobre el ancho de escritorio.

---

## Estructura y UX

### Inicio
1. **Jerarquía:** lo primero que aparece es un carrusel grande de campañas de producto (fotografía compuesta + tipografía publicitaria grande), con flechas para pasar manualmente; el mensaje genérico de la empresa ("a qué se dedica") aparece recién después de desplazarse una pantalla. OBSERVADO.
2. **Navegación:** menú superior con 8 enlaces de primer nivel (Inicio, dos rubros de producto, Sanidad, Cultivos, Nosotros, Noticias, Contacto) más una lupa de búsqueda; no hay submenús desplegables visibles al pasar el cursor. OBSERVADO. En varias pruebas, el primer clic sobre un enlace del menú no navegó (quedó en la misma URL) y fue necesario un segundo clic; probablemente por la repintada constante del carrusel superior. INFERIDO la causa, OBSERVADO el efecto.
3. Debajo del hero: franja con cifras institucionales (clientes, productos de portafolio, países), un carrusel horizontal de tarjetas de producto, un bloque de noticias a dos columnas (una destacada + dos secundarias) y, al final, logos de marcas representadas y un pie de página con contacto, enlaces legales (política de gestión, certificado ISO) y redes sociales. OBSERVADO.
4. Un widget de chat de ventas de un proveedor externo se abre solo en cada carga/navegación de página y hay que cerrarlo a mano; no es un enlace a WhatsApp, es un chat en vivo aparte. OBSERVADO.

### Catálogo (listado de productos)
1. **Filtros:** panel lateral con 4 desplegables de checkboxes — Categorías (con buscador interno), Filtrar objetivo (plaga), Filtrar por Cultivo, Filtrar por Especies — y un enlace "Quitar Selección" para resetear. Marcar una categoría filtra la grilla al instante, sin recargar la página. OBSERVADO (se probó marcando una categoría: la grilla pasó de ~30 tarjetas a 3).
2. **Buscador:** icono de lupa en el header abre un overlay con un campo "Buscar Producto". Al enviar una búsqueda sin resultados, navega a una URL de resultados cuyo único contenido es el texto **en inglés** "No data was found", sin encabezado, sin sugerencia de qué hacer ni enlace de vuelta al catálogo. OBSERVADO (se probó con un término inventado).
3. Cada tarjeta muestra foto de envase, nombre y una etiqueta de categoría; no se ve precio ni disponibilidad (coherente con que tampoco venden en línea). OBSERVADO.
4. **Teclado:** se pudo tabular hasta un elemento de la ficha de producto (una etiqueta de plaga) y el foco se veía con un contorno visible; no se recorrió el catálogo completo por teclado. OBSERVADO parcialmente.

### Ficha de producto
1. **Anatomía (de arriba a abajo):** migas de pan (Inicio / rubro / subcategoría / producto) → nombre como título principal → número de registro sanitario destacado junto al título → ingrediente activo/composición en una línea → descripción corta de 2–3 líneas → dos botones ("Solicitar información" con borde, "Contactar a un Asesor" relleno; no se hizo clic en ninguno) → caja "Tipo de Formulación" → caja "Documentos técnicos" con **dos enlaces de descarga en PDF** (ficha técnica y hoja de seguridad) → "Información general" (texto + viñetas) → tarjetas de "Objetivos (Plagas)", "Cultivos" y "Categoría" como etiquetas tipo píldora. OBSERVADO.
2. **Dosis y ficha técnica:** no hay ninguna tabla real en la página (ni siquiera una imagen de tabla): toda la información de dosis queda detrás de un PDF descargable. Las etiquetas de plaga y cultivo sí están en HTML, pero sin dosis asociada visible. OBSERVADO.
3. **Camino a pedir/contactar:** no hay "agregar a un pedido"; solo los dos botones de contacto genérico mencionados arriba. Son dos pasos más genéricos que un flujo de pedido directo. OBSERVADO (no se completó ningún formulario).
4. Las etiquetas de "Cultivos" en la ficha enlazan de vuelta al catálogo ya filtrado por ese cultivo (mismo componente de filtro del listado). OBSERVADO, confirmado en la página de cultivo descrita abajo.

### Cultivos
1. El listado (`/cultivos/`) es un **carrusel horizontal** de tarjetas con foto de fondo y el texto "Guía fitosanitaria" + nombre del cultivo, no una grilla fija; se ven 3–4 tarjetas a la vez con flechas para avanzar. OBSERVADO.
2. **Bug de accesibilidad:** el nombre accesible de esas tarjetas (lo que lee un lector de pantalla) es el texto "Quitar Selección", heredado por error del componente de filtros que se reutiliza en otra pantalla, y no el nombre del cultivo. OBSERVADO con el lector de la herramienta de exploración de la página.
3. La ficha de un cultivo tiene: foto de fondo de gran formato con superposición de color, un párrafo corto, enlaces PDF a guías fitosanitarias por región (p. ej. sierra/costa) y, más abajo, **el mismo panel de filtros del catálogo general**, ya preseleccionado por categoría y mostrando solo los productos de ese cultivo. OBSERVADO. Es el mismo componente de filtro que en `/productos/`, lo que explica el bug de accesibilidad anterior.

### Contacto
1. Pestañas para elegir país (Perú y 4 países más); no se navegó fuera de Perú. OBSERVADO.
2. El cuerpo de la página es, sobre todo, un **mapa vectorial interactivo** de Perú (con zoom +/−) y mucho espacio en blanco alrededor; no hay un formulario de contacto visible por defecto ni una lista simple de oficinas. OBSERVADO.
3. Al hacer clic en una región del mapa se abre un panel lateral "Contáctate con un asesor" con el personal de esa zona (rol, nombre, correo y teléfono); hay que elegir primero la región para ver a alguien. No se completó ni envió nada, solo se leyó el panel. OBSERVADO. (No se reproducen aquí los nombres/correos/teléfonos del personal: son datos de contacto reales de personas, no hace falta citarlos para el análisis.)
4. No se encontró, en las páginas visitadas, un enlace directo de "escríbenos por WhatsApp"; el único canal inmediato visible en todo el sitio es el widget de chat de terceros mencionado en Inicio. OBSERVADO en las páginas recorridas (no se revisó cada página del sitio).

---

## Diseño visual

1. **Tono general:** base corporativa/técnica (azul oscuro, tipografía sobria, números institucionales) combinada con piezas puntuales de tono publicitario (el carrusel de campañas usa tipografía display muy grande y gráficos tipo afiche). El resultado es más "catálogo de distribuidor con campañas de temporada" que "marca técnica silenciosa". OBSERVADO.
2. **Color:** un azul oscuro domina fondos de secciones, botones y pie de página; blanco para tarjetas y contenido; un color de acento (visto como una etiqueta verde en una de las piezas del carrusel) se usa de forma puntual para resaltar un dato. El texto blanco sobre el azul oscuro y el texto oscuro sobre blanco se leen con buen contraste a simple vista; no se midió el contraste exacto con herramienta (NO COMPROBADO el ratio AA/AAA).
3. **Tipografía:** una familia de titulares de trazo grueso tipo "display" (sin serifa) para nombres de producto y encabezados grandes, y una familia de texto más neutra para párrafos y etiquetas; el salto de tamaño entre título y cuerpo es marcado. Legible a 1440 px; no se pudo revisar a 360 px.
4. **Espacios, bordes y tarjetas:** separadores curvos/diagonales de gran tamaño entre casi todos los bloques de Inicio y de otras páginas (en vez de líneas rectas), tarjetas con esquinas redondeadas y sombra suave, etiquetas en forma de píldora para plagas/cultivos/categorías, cajas de información con fondo de color sólido para datos destacados (formulación, documentos técnicos). OBSERVADO.
5. **Imágenes:** dos registros conviven — (a) fotografía de estudio de envases sobre fondo liso para las tarjetas de catálogo, consistente pero algo genérica (se repite el mismo encuadre de "frasco/bolsa centrado"); (b) fotografía de campo y de equipo de gran formato y buena resolución aparente en el hero y en la sección "Nosotros". No se midió el peso de las imágenes (NO COMPROBADO cuánto pesan o si frenan la carga); a simple vista hay varias imágenes grandes por página.

---

## Efectos

| Efecto | Dónde | Qué hace | Propósito | Costo aparente | Movimiento reducido |
|---|---|---|---|---|---|
| Carrusel de campañas en el hero | Inicio | Rota automáticamente piezas publicitarias de producto, con flechas manuales | Mezcla de "dar la bienvenida" y "vender campaña del mes"; no comunica primero qué es la empresa | Medio: varias imágenes grandes por slide | NO COMPROBADO si el auto-avance se detiene; sí se confirmó en el CSS del sitio que existe una regla `prefers-reduced-motion: reduce` que apaga animaciones y transiciones con la clase `.animated` y pone `scroll-behavior: smooth` solo si no hay preferencia de reducir movimiento (revisado en las hojas de estilo cargadas, no visualmente) |
| Separadores curvos entre secciones | Casi toda página larga (Inicio, Contacto, fichas) | Corta cada bloque con una curva diagonal en vez de una línea recta | Decorativo; no guía la atención a nada en particular ni da respuesta a una acción del usuario | Bajo (CSS/SVG) | No se identificó una versión alternativa sin la curva; al no ser animación, "movimiento reducido" no aplica directamente |
| Filtro de catálogo instantáneo | Catálogo y fichas de cultivo | Al marcar una categoría/plaga/cultivo, la grilla de productos se actualiza sin recargar la página | Guía real: ayuda a encontrar un producto más rápido | Bajo | No implica movimiento animado, aplica igual con o sin preferencia de movimiento reducido |
| Mapa interactivo con panel de asesor | Contacto | Mapa con zoom; al tocar una región aparece un panel con el contacto de esa zona | Da respuesta útil (encontrar al asesor correcto), pero exige un paso extra antes de ver cualquier dato de contacto | Medio (mapa vectorial interactivo) | NO COMPROBADO |
| Tarjeta "elevada" en la grilla de catálogo | Catálogo | Una tarjeta se veía con más sombra/elevación que las demás sin que el cursor estuviera encima | Poco claro si es un estado "destacado" fijo o un efecto de hover mal disparado | Bajo | NO COMPROBADO |
| Chat de ventas flotante que se reabre solo | Todo el sitio | Burbuja de chat de un proveedor externo que aparece abierta en cada navegación | Busca conversión por chat en vivo, no por WhatsApp | Bajo técnicamente, pero interrumpe la lectura cada vez que se navega | No aplica (no es una animación de scroll) |

**Veredicto por efecto para Grovelab**, cruzado con el catálogo de efectos de `docs/DISENO.md`:
- Carrusel de campañas tipo afiche: **evitar** tal cual. No está en el catálogo de efectos de Grovelab y choca con el tono "técnica, cercana, moderna" que busca `docs/DISENO.md`; si se quiere destacar una novedad en portada, el camino ya aprobado es "aparición al desplazarse" o una sola pieza fija, no un carrusel publicitario rotativo.
- Separadores curvos repetidos: **evitar** como recurso por defecto; no tiene propósito funcional y no figura en el catálogo de efectos (regla de oro: "si no está en el catálogo, pregunta antes de agregarlo").
- Filtro instantáneo por categoría/plaga/cultivo: **adoptar**, no es un efecto de movimiento sino un patrón de interacción que calza directo con el buscador por cultivo/plaga/categoría ya definido en `docs/ALCANCE.md`.
- Mapa con panel de asesor por zona: **adoptar en versión liviana**, alineado con la `ZonaComercial` (con asesor y WhatsApp) de la fase 3 del alcance; conviene que el WhatsApp de la zona quede visible de inmediato y no solo dentro de un panel que exige un clic extra en el mapa.
- Chat flotante de terceros que se autoabre: **evitar**; el canal de pedido de Grovelab es WhatsApp, no un chat en vivo aparte, y autoabrirse en cada página es intrusivo.

---

## Debilidades

- **Estado vacío de búsqueda en inglés** ("No data was found"), sin encabezado ni salida clara: rompe el idioma del sitio y deja al visitante sin siguiente paso. Página: resultados de búsqueda del catálogo.
- **Sin tabla de dosis real**: toda la información técnica de uso queda en un PDF aparte, no hay tabla HTML ni siquiera una imagen de tabla en la ficha de producto. Afecta lectura en celular y a quien usa lector de pantalla.
- **Nombre accesible incorrecto** en las tarjetas de cultivo (leen "Quitar Selección" en vez del nombre del cultivo), por reutilizar un componente de filtro sin ajustar su etiqueta.
- **Camino de contacto más largo de lo necesario**: en la ficha de producto, dos botones de contacto genérico en vez de un pedido directo; en Contacto, hay que elegir país y luego una región del mapa antes de ver un teléfono o correo.
- **Chat de terceros intrusivo**: se reabre solo en cada navegación y hay que cerrarlo a mano repetidamente.
- **Fricción de navegación observada**: en varias pruebas el primer clic sobre un enlace del menú superior no navegó; se necesitó un segundo clic.
- **Fotografía de producto repetitiva**: siempre el mismo encuadre de envase centrado sobre fondo liso, sin mostrar el producto en uso o en campo.
- **Móvil (360 px) y peso de página no verificados en esta revisión** (limitación de la herramienta usada, no un hallazgo sobre el sitio).

---

## Puntaje y meta

Escala 1 (débil) a 5 (fuerte). Cada nota incluye en qué página se basó.

| # | Dimensión | Nota | Evidencia | Meta para Grovelab |
|---|---|---|---|---|
| 1 | Claridad del mensaje en 5 segundos | 3/5 | Inicio: lo primero que se ve es un carrusel de campaña de producto; la frase de qué hace la empresa aparece recién tras desplazarse | Sin desplazar, en escritorio y celular, se lee una frase de qué hace Grovelab y hay un botón a Productos visible de inmediato |
| 2 | Organización del catálogo | 4/5 | Catálogo: filtro por categoría, plaga, cultivo y especie, con resultado instantáneo sin recargar | Encontrar un producto filtrando por cultivo o plaga en un solo panel, sin recargar la página |
| 3 | Ficha de producto (completitud/legibilidad) | 2/5 | Ficha de producto: dosis y ficha técnica solo en PDF, sin tabla HTML en la página | La tabla de dosis es HTML real (no imagen ni PDF), legible a 360 px, con cifras alineadas (`tabular-nums` como ya define `docs/DISENO.md`); el PDF queda como descarga opcional |
| 4 | Camino a contactar o pedir | 2/5 | Ficha de producto: dos botones de contacto genérico; Contacto: hay que elegir región en un mapa para ver a un asesor | Desde la ficha de producto, agregar al pedido y abrir WhatsApp con el mensaje redactado toma como máximo 2 pasos (como ya describe el flujo de `docs/ALCANCE.md`) |
| 5 | Jerarquía visual y consistencia | 4/5 | Mismo patrón de tarjeta y mismos colores/tipografía de título en Inicio, catálogo y fichas de cultivo | Mantener un solo lenguaje de tarjeta, color y tipografía en todo el sitio, ya exigido por `docs/DISENO.md` |
| 6 | Calidad de imágenes y fotografía | 3/5 — *depende de Grovelab* | "Nosotros": fotos de campo y de equipo de buena resolución aparente; tarjetas de producto con la misma toma de estudio repetida | Si Grovelab cuenta con fotografía real de campo y de producto en uso, priorizarla sobre tomas de estudio repetitivas (depende del material que entregue Grovelab) |
| 7 | Efectos con propósito (no decoración) | 2/5 | Separadores curvos repetidos sin función aparente en casi todas las secciones; carrusel de campaña con gran peso visual | Cada efecto usado debe tener un propósito explícito, como ya exige el catálogo de efectos de `docs/DISENO.md` |
| 8 | Móvil (360 px) | NO COMPROBADO | No se pudo cambiar el ancho de la ventana en esta sesión | Revisión en celular (360 px) ya es un criterio de aceptación en `docs/DISENO.md`; queda pendiente repetir esta comparación con una herramienta que sí permita emular el ancho |
| 9 | Accesibilidad (contraste, teclado, foco, tablas) | 3/5 | Ficha de producto: foco de teclado visible en una etiqueta de plaga; tarjeta de cultivo con nombre accesible incorrecto; sin tabla real de dosis | Foco visible en todo elemento interactivo, nombres accesibles correctos en cada componente reutilizado, tabla de dosis en HTML semántico |
| 10 | Peso y velocidad aparente | NO COMPROBADO | No se revisó el panel de red; a simple vista hay varias imágenes grandes por página | LCP ≤ 2,5 s en celular de gama media, ya definido como criterio de aceptación en `docs/DISENO.md` |

---

## Tabla adoptar / mejorar / evitar

| Ítem | Decisión | Por qué | Escalera de efectos de Grovelab |
|---|---|---|---|
| Filtro de catálogo por categoría/plaga/cultivo/especie, con resultado instantáneo | **Adoptar** | Calza directo con el buscador por cultivo/plaga/categoría ya definido en `docs/ALCANCE.md`; reduce pasos para encontrar un producto | No es un efecto de movimiento; no aplica la escalera |
| Ficha de producto sin tabla de dosis real (solo PDF) | **Evitar** | Grovelab ya planea una tabla de dosis en HTML (`tabular-nums`) en `docs/DISENO.md`; una tabla real y legible en celular es una ventaja competitiva clara frente a un PDF | No aplica |
| Etiquetas tipo píldora para plagas/cultivos/categoría en la ficha | **Adoptar** | Forma clara y escaneable de mostrar la relación producto–plaga–cultivo, que Grovelab ya modela en su base de datos (Producto, Cultivo, Plaga, Categoría) | No aplica |
| Mapa de zonas con panel de asesor al hacer clic | **Adoptar en versión liviana** | Coincide con `ZonaComercial` (con asesor y WhatsApp) de la fase 3 del alcance | Propósito: dirigir al asesor/WhatsApp correcto. Costo: medio (mapa o lista interactiva, sin librería pesada). Respaldo en movimiento reducido: sin animación de por medio, solo mostrar/ocultar un panel; si se anima la aparición del panel, debe quedar visible sin animar cuando se prefiera menos movimiento |
| Carrusel de campañas publicitarias rotativo en el hero | **Evitar** | No está en el catálogo de efectos de Grovelab y no comunica primero "qué hace la empresa"; choca con el tono técnico y cercano buscado | No está en la escalera de Grovelab; si se quisiera algo similar habría que proponerlo primero, como pide la regla de oro de `docs/DISENO.md` |
| Separadores curvos/diagonales repetidos entre secciones | **Evitar** (o usar como mucho una vez, con intención) | Es decorativo, se repite sin variación y no está en el catálogo de efectos aprobado | No está en la escalera; "un solo momento wow por página" ya es la regla de `docs/DISENO.md` |
| Estado vacío de búsqueda sin guía, en inglés | **Evitar** | Rompe la regla de idioma del proyecto (todo en español) y deja al visitante sin salida | No aplica |
| Chat de ventas de terceros que se autoabre en cada página | **Evitar** | El canal de pedido de Grovelab es WhatsApp, no un chat en vivo aparte; autoabrirse en cada navegación es intrusivo | No aplica |
| Dos botones de contacto genérico en vez de un flujo de pedido | **Evitar** | Grovelab ya definió un flujo más corto y concreto: agregar a "Mi pedido" → WhatsApp | No aplica |
| Reutilizar un mismo componente de filtro en varias pantallas | **Adoptar la idea, mejorar la ejecución** | Reduce trabajo de desarrollo, pero hay que revisar el nombre accesible en cada contexto donde se reutilice (el bug de "Quitar Selección" viene de ahí) | No aplica |

---

## Preguntas para Grovelab

- ¿Se quiere el patrón "mapa de zona + clic para ver asesor" (como la referencia) para la fase 3, o se prefiere una lista simple de zonas con el WhatsApp del asesor visible de inmediato, sin un clic adicional en un mapa?
- Para productos que aún no tengan registro SENASA confirmado (pendiente en `docs/ALCANCE.md`), ¿el pedido por WhatsApp debe seguir disponible, o esos productos muestran solo un botón de "más información" mientras se confirma el registro?
- ¿Grovelab usará además algún chat en vivo de terceros, o el pedido por WhatsApp reemplaza cualquier chat?
- ¿Cuánta fotografía real de campo, planta y equipo tiene Grovelab disponible para un hero con fotografía de gran formato como el de la referencia, o se trabaja principalmente con la ilustración/SVG que ya propone `docs/DISENO.md` (parallax, planta que crece)? (depende de Grovelab)

---

## Dónde puede ganar Grovelab

**Las tres ventajas más claras:**
1. Una **tabla de dosis real en HTML**, legible en celular y accesible, en vez de un PDF aparte — ya está planeada en `docs/DISENO.md` y es justo donde la referencia es más débil (2/5 arriba).
2. Un **camino de pedido corto por WhatsApp** ("Mi pedido" → WhatsApp) en vez de dos botones de contacto genérico sin acción inmediata.
3. Un **mensaje de marca claro desde el primer pantallazo** ("Del suelo a la cosecha"), sin depender de un carrusel de campañas publicitarias para explicar qué hace la empresa.

**Las dos dimensiones donde la referencia es más fuerte y será difícil superar:**
1. **Organización del catálogo**: el filtro por categoría/plaga/cultivo/especie de la referencia ya está maduro y responde al instante; Grovelab tendrá que construir ese mismo nivel de filtrado desde cero.
2. **Volumen de fotografía propia acumulada** (campo, equipo, instalaciones) en buena resolución; esto depende enteramente de cuánto material entregue Grovelab y no es algo que el diseño por sí solo pueda resolver.

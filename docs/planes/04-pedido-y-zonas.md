# Plan 04 — Fase 3: pedido por WhatsApp y zonas comerciales

Estado: propuesta. Ya están resueltos los puntos 3 a 6 de «Confirmar antes de empezar». Siguen abiertos los puntos 1, 2 y 7, que dependen de Grovelab y no bloquean las tareas 3 a 8. No se escribe código hasta aprobar este documento.

Referencias: `AGENTS.md`, `docs/ALCANCE.md` (§ Flujo del pedido, § Fases punto 3), `docs/DISENO.md` (meta 4, componentes «botón y lista Mi pedido» y «formulario del pedido»), `docs/referencia-tqc.md` (mapa de zonas con asesor: «adoptar en versión liviana»), `docs/planes/01-base.md` (el editor no ve pedidos hasta que esta fase lo defina), `docs/planes/02-sitio-y-catalogo.md` (campo `presentaciones` pensado para esta fase).

Numeración: los planes `03-ui-ux-implementacion.md` y `03-contenido-real-y-medios.md` son de la fase 2. Este es el primero de la fase 3, por eso lleva el número 04.

## Para qué es esta fase

El agricultor encuentra su producto, elige presentación y cantidad, junta varios productos en «Mi pedido» y lo envía por WhatsApp al asesor de su zona con el mensaje ya redactado. Todo en tres acciones desde la ficha (meta 4 de `docs/DISENO.md`). Grovelab ve cada pedido en el panel, con su estado, sin depender de que el chat de WhatsApp no se pierda.

No es una tienda: no hay precios, pagos, stock, cuentas de cliente ni comprobantes. Un pedido aquí es una **solicitud de cotización** con datos de contacto.

## Prerrequisitos

1. **Fase 2 cerrada y fusionada en `main`.** La rama `feat/fase-2-catalogo` tiene cambios sin confirmar (cabecera, menú, tokens, transiciones). La fase 3 empieza en una rama nueva `feat/fase-3-pedido-zonas` creada desde `main` ya actualizado, no sobre trabajo pendiente.
2. **Leer la guía de Next.js 16.4.3** en `node_modules/next/dist/docs/` sobre Server Actions, formularios (`useActionState`) y redirecciones antes de escribir la tarea 8. La versión tiene cambios respecto de lo conocido (bloque de `AGENTS.md`).
3. `npm run migrate:status` al día en la rama de Neon de desarrollo.

## Punto de partida (lo que ya existe y se reutiliza)

| Pieza | Dónde | Uso en esta fase |
|---|---|---|
| `presentaciones` (array de `etiqueta`) | `src/collections/productos.ts` | Opciones de «Agregar a mi pedido». Hoy CUAJADO, KOALA y LIGNOFOL tienen 4, PK 65 tiene 1, y NOT FLY y TODYM no tienen ninguna (punto 4 de «Confirmar»). |
| `WHATSAPP_NUMBER` (opcional, solo servidor) | `src/lib/env.ts`, `src/lib/url-contacto.ts` | Destino general cuando la zona no tiene WhatsApp propio o la persona elige «Otra zona / no sé». |
| `politicaPrivacidadPublica(textos)` | `src/lib/obtener-textos-sitio.ts` | Misma compuerta que el formulario de contacto: sin política no se guardan datos personales. |
| Patrón Server Action + Zod + `overrideAccess` y `create: () => false` | `src/app/(frontend)/contacto/actions.ts`, `src/collections/consultas.ts` | Plantilla del envío del pedido. La API REST pública no puede crear pedidos. |
| `lecturaPublicaOEditor`, `escrituraPanel` | `src/lib/acceso-contenido.ts` | Acceso de Zonas. Pedidos necesita un acceso más estricto (tarea 7). |
| `BotonEnlace`, `EstadoVacio`, `EncabezadoPagina`, `Migas`, `ficha.chip` | `src/components/ui/`, `src/styles/ficha-producto.module.css` | Ficha, `/pedido` y `/zonas-comerciales` sin componentes visuales nuevos salvo los del pedido. |
| Regla «Cultivos solo si hay publicados» | `src/lib/hay-cultivos-publicados.ts`, menú y sitemap | Misma regla para «Zonas» en el menú. |

## Confirmar antes de empezar

Cada punto tiene una recomendación. Si se acepta tal cual, se puede empezar. Lo que diga Grovelab manda.

1. **Zonas y asesores.** La web antigua lista seis zonas con su asesor (RTC), celular y ciudades. Se usan como borrador y Grovelab confirma por escrito qué zonas siguen vigentes, qué departamentos o ciudades cubre cada una, y el nombre y el cargo de cada asesor. *Recomendación:* no cargar nada sin esa confirmación. Sin zonas publicadas, el pedido sale al número general.
2. **¿Se publica el número de cada asesor?** El plan 02 prohíbe exponer teléfonos de personas en la lectura pública. La página de zonas y el envío del pedido exponen el número de la zona por diseño, porque el enlace `wa.me/<número>` lo deja visible. *Recomendación:* publicar solo números corporativos o los que Grovelab autorice por escrito, y marcar cada zona en el panel con «Número autorizado para publicar». Una zona sin esa marca no muestra el número y su pedido sale al número general.
3. **Pedido sin política de privacidad.** Resuelto (2026-11-27): **modo sin datos.** Se construye todo. Mientras no haya política, el pedido **no pide ni guarda datos personales** (sí se guarda el pedido en sí, sin nombre ni teléfono, como pide la regla de catalogo-pedido): «Enviar por WhatsApp» arma el mensaje solo con productos, zona y cultivo, y la persona escribe su nombre en el chat. Cuando se publique la política, el mismo formulario pasa a pedir nombre y teléfono y a guardar en el panel, sin tocar código (la compuerta lee el global). Se descartaron esperar a la política y guardar sin ella.
4. **Productos sin presentación** (hoy NOT FLY y TODYM). Resuelto (2026-11-27): se pueden agregar con la presentación «A consultar con el asesor», nunca con una inventada. Igual se le piden a Grovelab las presentaciones reales.
5. **Productos regulados (pendiente de `docs/ALCANCE.md`).** Resuelto (2026-11-27): se reciben pedidos de todo producto publicado, porque el pedido es una cotización y no una venta. Cada producto tiene un interruptor «Admite pedido» (activo por defecto) para que Grovelab lo apague donde haga falta. Con el interruptor apagado, la ficha muestra solo «Pedir información».
6. **Quién ve los pedidos en el panel.** Resuelto (2026-11-27): **rol nuevo `ventas`**, que ve Pedidos y cambia su estado, ve Zonas y no edita el catálogo ni ve Usuarios. El administrador ve todo y el editor **no** ve pedidos.
7. **Conservación de datos.** ¿Cuánto tiempo se guardan nombre y teléfono de un pedido? *Recomendación:* lo define Grovelab junto con la política. Este plan solo deja el campo de estado y la fecha; la anonimización automática queda como mejora posterior.
8. **Tratamiento tú o usted.** Sigue `POR CONFIRMAR` en `docs/DISENO.md`. Se usa el mismo tratamiento provisional que la fase 2.

## Decisiones técnicas propuestas

### Dónde vive «Mi pedido» mientras se arma

- En el navegador, en `localStorage` (clave versionada `grovelab.pedido.v1`), porque no hay cuentas de cliente. No se guarda nada en el servidor hasta pulsar «Enviar».
- Solo se guarda `{ slug, presentacion, cantidad }` por fila. Nombres, categorías y fotos se vuelven a leer de Payload al mostrar y al enviar: **lo que viene del navegador no es confiable**.
- La lectura se valida con Zod. Un contenido corrupto o de una versión vieja se descarta en silencio y el pedido queda vacío, sin errores en pantalla.
- Límites: máximo 20 filas y cantidad entera de 1 a 9999. Una misma combinación de producto y presentación suma cantidades, no se duplica.
- Se sincroniza entre pestañas con el evento `storage` y un store con `useSyncExternalStore`. En el servidor no se renderiza el contador, así se evitan errores de hidratación.
- **Sin dependencias nuevas.** No se usa Zustand ni otra librería de estado: alcanza con un módulo de unos 80 líneas.

### Cómo se abre WhatsApp

- El mensaje y el número de destino se arman **en el servidor** (Server Action), no en el navegador. Así el número de la zona no se elige desde el cliente y el mensaje usa los nombres reales de los productos.
- Los bloqueadores de ventanas impiden abrir una pestaña nueva después de un `await`. Por eso la acción devuelve la URL `https://wa.me/<dígitos>?text=…` y el cliente navega **en la misma pestaña** (`window.location.assign`). En el celular eso abre la app de WhatsApp. La pantalla de «Pedido enviado» queda en el historial con un botón «Abrir WhatsApp otra vez» por si la persona vuelve atrás.
- Formato del mensaje (función pura con pruebas):

  ```
  Hola, quiero cotizar este pedido (N.º 0123):
  • KOALA — 1 L × 2
  • PK 65 — 1 L × 10
  • NOT FLY — A consultar con el asesor × 1
  Nombre: …            (solo si hay política y se pidió)
  Zona: Costa norte · Ciudad: Piura
  Cultivo: Palto · 12 ha
  ```

  No incluye el teléfono, porque WhatsApp ya lo muestra. El número de pedido aparece solo si el pedido se guardó, y sirve para cruzarlo con el panel. Peor caso medido (20 filas, nombre largo, cantidad 9999): unos 2 300 caracteres de URL, porque `•`, `—` y `×` se codifican en 9 caracteres cada uno. Un pedido real es mucho más corto, pero la tarea 8 lo comprueba a mano con 20 filas en un celular antes de darse por buena, y si falla se pasa a separadores ASCII.
- Destino, en este orden: el WhatsApp de la zona elegida, si existe y está autorizado; si no, `WHATSAPP_NUMBER`. **Si no hay ningún destino, la función de pedido no aparece en ninguna parte del sitio** (sin botón «Agregar», sin contador ni `/pedido`), igual que hoy se oculta el botón de WhatsApp.

### Antiabuso sin servicios nuevos

- Campo trampa oculto (honeypot) y un tiempo mínimo de 3 s entre que carga el formulario y el envío. Si fallan, se responde «ok» sin guardar nada.
- Límite por teléfono: como máximo 3 pedidos por hora con el mismo número, comprobado con una consulta a Pedidos. No se guarda la IP.
- Como opción de configuración, sin código: una regla de rate limit de Vercel Firewall sobre la ruta `/pedido`. Se anota en el despliegue, no en esta fase.
- Ningún log con nombre, teléfono ni el mensaje.

### URLs

| Ruta | Página | Menú y sitemap |
|---|---|---|
| `/pedido` | «Mi pedido»: lista editable y formulario de envío | No va en el menú (se llega por el contador de la cabecera y desde la ficha). `noindex` y fuera del sitemap. |
| `/zonas-comerciales` | Zonas con su asesor y su WhatsApp | En el menú y el sitemap solo si hay al menos una zona publicada |

### Efecto por página (para `docs/DISENO.md`)

| Página | Único efecto | Motivo |
|---|---|---|
| `/pedido` | Ninguno | Es un formulario y la claridad es el efecto. Agregar o quitar filas no se anima. |
| `/zonas-comerciales` | Ninguno | Responde «a quién llamo» en diez segundos, como Contacto. |
| Ficha, bloque «Agregar» | Ninguno nuevo | La confirmación es un texto en una región `aria-live`, sin toasts ni ventanas emergentes. |

Se descarta el mapa interactivo de la referencia: exige un clic antes de ver cualquier número y sumaría una librería o un SVG grande. Se adopta la «versión liviana» que pide `docs/referencia-tqc.md`: una lista con el WhatsApp visible de inmediato.

## Modelo de datos

Etiquetas en español, `push: false`, una migración por tarea con `import type` separado y `npm run generate:types` después.

### Zonas comerciales (`zonas-comerciales`), grupo «Ventas»

| Campo | Tipo | Notas |
|---|---|---|
| `nombre` | text, requerido | «Costa norte» |
| `slug` | text, único | |
| `cobertura` | array de `lugar` (text, máx. 80) | Departamentos o ciudades, en el orden en que se muestran. |
| `asesorNombre` | text | Opcional. Sin nombre se muestra «Asesor comercial». |
| `asesorCargo` | text | Opcional (p. ej. «RTC»). |
| `whatsapp` | text | Se valida en el servidor: solo dígitos tras normalizar, 9 a 15 dígitos, y se completa `51` si viene un celular peruano de 9 dígitos. |
| `numeroAutorizado` | checkbox, por defecto `false` | Punto 2 de «Confirmar». Sin la marca, el número no sale del servidor. |
| `orden` | number | |
| borrador/publicado | `versions.drafts` | Como el resto del catálogo. |

Acceso: lectura pública solo de lo publicado. Escritura para administrador y editor. Si se aprueba el rol `ventas`, este solo lee. **La lectura pública nunca devuelve `whatsapp` cuando `numeroAutorizado` es falso**: se aplica con un acceso a nivel de campo, no ocultándolo en la página.

### Productos (cambio pequeño)

- `admitePedido`: checkbox, por defecto `true`, en la barra lateral del panel (punto 5).

### Pedidos (`pedidos`), grupo «Ventas»

| Campo | Tipo | Notas |
|---|---|---|
| `numero` | number, único | Correlativo legible (el `id`, formateado como `0123` en la UI). |
| `items` | array: `producto` (relationship), `nombreProducto` (text), `presentacion` (text), `cantidad` (number) | El nombre y la presentación se copian en el momento del envío, para que el pedido no cambie si después se edita el producto. **Solo lectura** después de crearse. |
| `nombre`, `telefono` | text | Vacíos en el modo sin política (punto 3a). |
| `zona` | relationship a `zonas-comerciales` | Opcional («Otra zona / no sé»). |
| `ciudad` | text, máx. 80 | Opcional. |
| `cultivo` | relationship a `cultivos` | Opcional. |
| `hectareas` | number, 0,1 a 100 000 | Opcional. |
| `destino` | select: `zona`, `general` | Qué número recibió el mensaje. No se guarda el número, solo el tipo. |
| `estado` | select: `nuevo`, `contactado`, `cotizado`, `cerrado`, `descartado` | Por defecto `nuevo`. Es lo único que el equipo edita, junto con la nota interna. |
| `notaInterna` | textarea | Solo visible en el panel. |
| `aceptoPolitica` | checkbox | `true` cuando se guardaron datos personales. |

Acceso: `create: () => false` (solo la Server Action crea, con `overrideAccess` y datos ya validados). `read` y `update` para administrador (y `ventas`, si se aprueba), con `update` limitado a `estado` y `notaInterna` por acceso de campo. `delete` solo para el administrador. El editor no lo ve: `admin.hidden` y acceso de servidor, comprobado igual que hoy con Usuarios.

## Decisiones UX

Se escriben con `/ux-ui-2026` antes de cada pantalla. Este es el borrador que la tarea refina.

### Bloque «Agregar a mi pedido» en la ficha

- **Tarea:** elegir presentación y cantidad y sumar el producto sin salir de la ficha.
- **Ubicación:** inmediatamente después de «Presentaciones» en celular. Reemplaza el chip estático de presentaciones cuando el pedido está activo, para que no haya dos listas iguales. «Pedir información» y WhatsApp quedan como salida secundaria.
- **Patrón:** grupo de radios con aspecto de chip (`fieldset` + `legend` «Presentación»). Si hay una sola presentación, viene marcada. Debajo, la cantidad con botones − y + de 44 px y un `input type="number" inputmode="numeric"` en el medio, y el botón primario «Agregar a mi pedido».
- **Confirmación:** texto en `aria-live="polite"`: «Agregaste KOALA 1 L × 2.» con el enlace «Revisar mi pedido (3)». El foco no se mueve.
- **Estados:** sin destino de WhatsApp → el bloque no se renderiza. Con «Admite pedido» apagado → no se renderiza. Sin presentaciones → una sola opción «A consultar con el asesor» (punto 4). Con 20 filas → el botón queda deshabilitado con el motivo visible.
- **Sin JavaScript:** el bloque no aparece (es una isla de cliente) y la ficha sigue igual que en la fase 2.

### Contador en la cabecera

- Enlace «Mi pedido» con un número, visible solo cuando hay al menos una fila. Nombre accesible: «Mi pedido, 3 productos». En escritorio va junto al menú; en celular, a la vista sin abrir el menú.

### `/pedido`

- **Orden:** H1 «Mi pedido» → lista de filas (nombre con enlace a la ficha, presentación, cantidad editable, «Quitar») → «Vaciar pedido», con confirmación en línea y no con `confirm()` → formulario → «Enviar por WhatsApp».
- **Formulario con política:** nombre (requerido), teléfono (requerido, `type="tel"`, `autocomplete="tel"`), zona (`select` con las zonas publicadas más «Otra zona / no sé», requerido), ciudad, cultivo (`select` con los cultivos publicados) y hectáreas (opcionales), y la casilla de política con enlace a `/privacidad` (requerida). Son los datos mínimos de `docs/ALCANCE.md`, nada más.
- **Formulario sin política (3a):** solo zona, ciudad, cultivo y hectáreas, con una nota: «No guardamos tus datos. Escribe tu nombre en el chat de WhatsApp».
- **Errores:** junto a cada campo, en español, con `aria-describedby` y foco en el primer campo con error. Si un producto se despublicó entre que se armó el pedido y se envió, se quita de la lista con el aviso «KOALA ya no está disponible y lo quitamos de tu pedido», y el envío no ocurre hasta que la persona lo revise.
- **Vacío:** `EstadoVacio` con «Tu pedido está vacío» y la salida «Ver productos».
- **Enviado:** «Listo. Te llevamos a WhatsApp…» con el número de pedido (si se guardó) y el botón «Abrir WhatsApp otra vez». La lista local se vacía solo tras una respuesta correcta del servidor.
- **Meta 4 (tres acciones):** (1) «Agregar a mi pedido» en la ficha → (2) «Revisar mi pedido» → (3) «Enviar por WhatsApp». Completar los campos se hace en la misma pantalla del paso 3.

### `/zonas-comerciales`

- H1, una frase («Escríbele al asesor de tu zona») y una grilla de tarjetas planas: nombre de la zona, lista de cobertura, asesor y cargo, y el botón «Escribir por WhatsApp» (con mensaje «Hola, escribo desde la web de Grovelab») cuando el número está autorizado. Sin número autorizado, la tarjeta remite a `/contacto`.
- Sin buscador. Con seis zonas, una lista ordenada se recorre más rápido que un filtro. Se revisa si pasan de doce.
- Vacío: la ruta responde 404 y no aparece en el menú, igual que Cultivos.
- Contacto y el cierre de la portada (sección 10 del plan 02) suman un enlace «Ver asesores por zona» cuando hay zonas.

## Tareas

Una por vez y un commit por tarea, en `feat/fase-3-pedido-zonas`. Cada una cierra con `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build`. Se suma `npm run test:e2e` cuando toca el panel, el acceso o un flujo nuevo, y la revisión a 360 y 1440 px (`/revision-visual`) si toca pantalla.

### 1. Colección Zonas comerciales

- `src/collections/zonas-comerciales.ts` según el modelo. El acceso de campo de `whatsapp` va atado a `numeroAutorizado`.
- `src/lib/normalizar-whatsapp.ts`: función pura que reutilizan la validación del campo, la página y la Server Action. Vitest cubre número peruano de 9 dígitos, número con `+51`, espacios y guiones, longitud fuera de rango y texto.
- Registro en `payload.config.ts`, migración y `generate:types`.
- **Verificación:** como visitante, `GET /api/zonas-comerciales` no devuelve `whatsapp` de una zona sin autorizar ni zonas en borrador (prueba E2E sin credenciales).

### 2. Página `/zonas-comerciales` y enlaces condicionales

- Página, `generateMetadata`, `src/lib/hay-zonas-publicadas.ts` y el enlace «Zonas» en el menú y el sitemap con la misma regla que Cultivos.
- Enlace desde Contacto y desde el cierre de la portada.
- Actualizar la tabla de efectos de `docs/DISENO.md` (fila `/zonas-comerciales`: ninguno).
- **Carga de datos:** solo zonas confirmadas por Grovelab (punto 1). Sin confirmación, la tarea se cierra con la colección vacía y la ruta oculta.
- **Verificación:** captura a 360 y 1440 px con datos de prueba en la base local (borrados al terminar). Cada botón de WhatsApp tiene un nombre accesible propio («Escribir por WhatsApp al asesor de Costa norte»).

### 3. Lógica pura del pedido

Sin interfaz. Es lo que más conviene probar aislado.

- `src/lib/pedido/esquema.ts`: Zod de la fila local, de la lista local y del envío (datos con y sin política).
- `src/lib/pedido/almacen-local.ts`: leer, guardar, sumar, quitar, cambiar cantidad, vaciar y suscribirse, con los límites de 20 filas y 1 a 9999.
- `src/lib/pedido/mensaje-whatsapp.ts`: arma el texto del ejemplo de arriba.
- `src/lib/pedido/destino.ts`: zona autorizada → general → ninguno.
- **Vitest:** JSON corrupto, versión vieja, suma de duplicados, límites, mensaje con y sin datos opcionales, caracteres especiales y emojis en nombres (codificados en la URL) y las tres ramas de destino.

### 4. Campo «Admite pedido» en Productos

- Campo, migración y `generate:types`. Los 6 productos reales quedan en `true` por el valor por defecto de la migración, salvo lo que diga el punto 5.

### 5. Ficha: «Agregar a mi pedido» y contador en la cabecera

- `src/components/pedido/agregar-al-pedido.tsx` (cliente), con props ya resueltas en el servidor: `slug`, `nombre` y `presentaciones`. El componente no lee Payload.
- `src/components/pedido/contador-pedido.tsx` (cliente) en `site-header.tsx`.
- `src/lib/pedido-activo.ts` (servidor): ¿hay algún destino? Decide si se renderizan las dos islas.
- Estilos en `src/components/pedido/pedido.module.css`, solo con `var(--token-*)`.
- **Verificación:** E2E sin credenciales. Agregar KOALA 1 L × 2, ver «Mi pedido, 1 producto» en la cabecera, recargar y seguir viéndolo, y agregar otra vez la misma combinación para comprobar que suma y no duplica. Recorrido por teclado del grupo de radios y de los botones − y +.

### 6. Página `/pedido`: lista editable

- Página de servidor con una isla de cliente para la lista. Los nombres y enlaces de cada fila se resuelven con una Server Action de solo lectura que recibe los slugs, valida con Zod y devuelve solo productos publicados con «Admite pedido».
- Quitar, cambiar cantidad, vaciar con confirmación en línea y estado vacío. `robots: noindex`.
- Todavía **sin** formulario de envío.
- **Verificación:** E2E de quitar fila, cambiar cantidad, vaciar y estado vacío. Captura a 360 y 1440 px con 1 fila y con 20.

### 7. Colección Pedidos y rol `ventas`

- `src/collections/pedidos.ts` según el modelo, con los accesos de colección y de campo.
- Rol `ventas` (punto 6): opción en `users.role`, sus accesos en Pedidos y Zonas, y `admin.hidden` del catálogo para ese rol. Se revisa que no gane acceso a Usuarios.
- Migración y `generate:types`.
- **Verificación:** E2E de acceso, ampliando `e2e/admin-acceso.spec.ts`. Como visitante, `POST /api/pedidos` → 403 y `GET /api/pedidos` → 403. La prueba manual con usuarios de prueba (como indica `AGENTS.md`) comprueba que el editor no ve «Pedidos» ni lee `/api/pedidos`, que `ventas` ve Pedidos y solo puede cambiar estado y nota, y que nadie puede editar `items` después de creado el pedido.

### 8. Envío: Server Action y salida a WhatsApp

- `src/app/(frontend)/pedido/actions.ts`:
  1. Comprueba el honeypot y el tiempo mínimo.
  2. Valida con Zod. El esquema depende de si hay política publicada (punto 3).
  3. Vuelve a leer en Payload cada producto por slug (publicado y con «Admite pedido») y comprueba que la presentación exista en el producto (o que sea «A consultar» si no tiene ninguna). Lo que no pasa se devuelve como aviso y no se envía.
  4. Resuelve el destino.
  5. Con política, aplica el límite por teléfono y crea el Pedido. Sin política, guarda el pedido sin nombre ni teléfono (productos, zona, ciudad, cultivo y hectáreas). Si guardar falla, el pedido sale igual por WhatsApp.
  6. Devuelve `{ ok: true, urlWhatsApp, numero? }` o errores por campo. No escribe logs con datos personales.
- El formulario usa `useActionState`, muestra el estado «Enviado» y navega con `window.location.assign`.
- **Vitest:** validación del esquema en sus dos variantes.
- **E2E:** interceptar `https://wa.me/**` con `page.route` y comprobar el número de destino de tipo general (con un número ficticio en el entorno de prueba, nunca uno real) y el texto del mensaje. Sin política, se comprueba además que no se creó ningún Pedido. Con política, se usa la base local de pruebas y se borra lo creado. Contar las tres acciones de la meta 4.

### 9. Cierre de la fase

- Revisión a 360 y 1440 px de la ficha con el bloque, `/pedido` (vacío, con filas, con errores y enviado) y `/zonas-comerciales`. Zoom al 200 % y `prefers-reduced-motion`.
- Lighthouse móvil sobre `npm run build` + `npm run start` en la ficha y `/pedido` (meta 10). Las islas nuevas no deben subir el INP por encima de 200 ms.
- Actualizar `docs/DISENO.md` (efectos de `/pedido`, componentes del pedido ya construidos) y `docs/ALCANCE.md` (marcar las decisiones de zona, regulados y rol, si se tomaron).
- Lista `POR CONFIRMAR` para Grovelab con lo que haya quedado abierto.

## Seguridad y datos personales

- Nada del navegador se usa sin revalidar en el servidor: slugs, presentaciones, cantidades y zona.
- El número de WhatsApp de destino nunca viene del cliente.
- Pedidos no se puede crear por REST. Lo lee y lo edita solo el rol definido en el punto 6, y `items` es inmutable.
- No se guardan datos personales sin política publicada. No se registran nombre, teléfono ni mensaje en logs, ni se guarda la IP.
- `localStorage` guarda solo slugs, presentaciones y cantidades, nunca nombre ni teléfono. Si se quiere recordar el nombre del formulario entre visitas, se decide aparte y con aviso.
- Ningún secreto ni número en `NEXT_PUBLIC_`. `WHATSAPP_NUMBER` sigue solo en el servidor.

## Verificación

- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` en cada tarea.
- `npm run test:e2e` en las tareas 1, 5, 6, 7 y 8. Las pruebas de la fase 1 y la fase 2 siguen en verde.
- Un editor de prueba no ve Pedidos. Un usuario `ventas` (si existe) no ve Usuarios ni edita el catálogo.
- Ningún número de asesor visible sin `numeroAutorizado`.
- Ninguna presentación, zona ni asesor en pantalla que no venga del panel con fuente de Grovelab.

## Criterios de aceptación

1. Desde la ficha, en tres acciones, se abre WhatsApp con el mensaje redactado y el pedido completo (meta 4).
2. «Mi pedido» sobrevive a recargar la página y se sincroniza entre pestañas, y lo corrupto no rompe nada.
3. El mensaje llega al asesor de la zona elegida o, en su defecto, al número general. Sin ningún número configurado, la función no aparece.
4. Con política publicada, cada pedido queda en el panel con sus productos, zona y estado, visible solo para los roles definidos. Sin política, el pedido se guarda sin ningún dato personal (sin nombre ni teléfono).
5. `/zonas-comerciales` muestra las zonas confirmadas con su WhatsApp visible de inmediato, sin mapa ni clic previo.
6. No hay precios, pagos, stock ni cuentas de cliente.
7. No hay datos inventados en la interfaz.

## Fuera de esta fase

- Aviso por correo o notificación al asesor cuando llega un pedido (mejora; requiere elegir proveedor).
- Anonimización automática de pedidos antiguos (cuando Grovelab defina la conservación).
- Exportar pedidos a Excel desde el panel.
- Analítica de eventos (`pedido_agregado`, `pedido_enviado`): se suma a la de la fase 5.
- Mapa interactivo de zonas.
- Migración de los ~70 productos y redirecciones (fase 4). El flujo de pedido funciona igual con más productos.

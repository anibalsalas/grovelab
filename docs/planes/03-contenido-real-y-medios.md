# Plan 03 — Medios y contenido real (Grovelab)

Estado: propuesta. No se instala nada ni se escribe código hasta aprobar este documento.

Referencias: `AGENTS.md`, `docs/DISENO.md`, `docs/planes/02-sitio-y-catalogo.md` (tarea 1 "Medios fuera de la base" y tarea 13 "Contacto", ambas retomadas aquí con el contenido real ya entregado), `docs/solicitados/` (material fuente de este plan).

## Para qué es este plan

`docs/solicitados/` trajo el contenido real que el plan 02 dejaba como `POR CONFIRMAR`: fotos de cultivos y productos, el logo (ya integrado), los datos de contacto, la historia/misión/visión de Grovelab y las fichas completas (incluida la tabla de dosis) de 6 productos. Ninguno de esos datos está todavía en la web porque falta la pieza que los sostiene a todos: la colección Medios y los campos de imagen/PDF en los esquemas existentes. Este plan ordena el trabajo para que ese contenido real llegue a producción, en el orden que menos retrabajo genera.

## Por qué este orden

Los pasos 2 a 6 dependen de que exista un lugar donde subir archivos (paso 1). Cargar productos o cultivos antes de tener el campo de imagen significaría volver a abrir cada registro después para agregarla. Por eso Medios va primero, aunque sea el paso más largo.

## Confirmar antes de empezar

1. **Nombres de categorías.** Resuelto (paso 5): se crearon tal cual las usan los 6 documentos — Bio nutricionales, Fungicida, Bioestimulante, Insecticida agrícola, Fertilizante foliar.
2. **Titular y subtítulo de portada.** Resuelto (paso 4, actualizado 2026-11-27): el titular y los bloques de Nosotros reemplazan al legacy 2019. El subtítulo del docx se cortaba a mitad de frase ("...agricultura moder"); por indicación explícita del usuario se completó con "moderna, productiva y sostenible" (el mismo cierre que ya aparece completo en "Nuestra visión" del propio documento) y también reemplaza al legacy.
3. **Bloques de "Nosotros".** Resuelto (paso 4): el texto genérico 2019 fue reemplazado por Nuestra Historia, Misión, Visión y Compromiso del docx nuevo (el bloque "Compromiso" tenía el mismo corte de frase que el subtítulo; se completó de la misma forma, por la misma indicación).
4. **`WHATSAPP_NUMBER`.** El docx trae +51 987 524 473 como WhatsApp. No reviso `.env.local` por regla de no tocar secretos: confirma si ya está cargado o si falta.
5. **Texto de política de privacidad.** Sigue sin llegar en ningún material entregado. Mientras no llegue, el formulario de contacto sigue apagado (regla ya vigente desde el plan 02); este plan no lo resuelve, solo lo deja anotado para no perderlo de vista.
6. **Productos de `destacados/` sin ficha completa** (ROSUIT PLUS, TORAZO): solo tienen foto de campo, sin dosis ni SENASA. ¿Quedan fuera de esta carga (los 6 con ficha completa) hasta que Grovelab entregue sus datos, o se usan solo como imagen decorativa en alguna franja?

## Tareas

Una tarea por vez, cada una termina con lint, typecheck, test y build; `test:e2e` si toca el admin o el acceso. Commit por tarea.

### 1. Colección Medios y almacenamiento en Vercel Blob

Retoma la tarea 1 de `docs/planes/02-sitio-y-catalogo.md`, ya decidida: Vercel Blob con `@payloadcms/storage-vercel-blob` en **3.92.0** (misma versión que el resto de Payload).

- Instalar la dependencia.
- Crear `src/collections/medios.ts`: colección `upload` (`medios`), tipos permitidos `jpeg, png, webp, pdf`, límite de tamaño 10 MB (mismo criterio ya usado en el plan para documentos), validación de tipo real en el servidor (no solo por extensión). Acceso: lectura pública de lo publicado, escritura solo administrador/editor (`escrituraPanel`/`lecturaPublicaOEditor`, igual que las demás colecciones).
- Registrar la colección y el plugin de almacenamiento en `src/payload.config.ts`.
- Añadir `BLOB_READ_WRITE_TOKEN` a `.env.example` (sin valor real) y documentarlo como obligatorio desde esta tarea.
- Migración de la nueva colección (`migrate:create`, separar `import type` de `MigrateUpArgs`/`MigrateDownArgs` como indica `AGENTS.md`).
- `npm run generate:types`.
- Verificación: subir una imagen y un PDF de prueba desde el panel; confirmar en Postgres que el archivo no quedó como `bytea` (criterio de aceptación ya fijado en el plan 02).

### 2. Campos de imagen y PDF en los esquemas existentes

- `src/collections/categorias.ts`: campo `imagen` (relationship a `medios`, opcional), como ya preveía la tabla "Qué se edita en el panel" del plan 02.
- `src/collections/cultivos.ts`: campo `imagen` (relationship a `medios`, opcional).
- `src/collections/productos.ts`: campo `galeria` (relationship a `medios`, `hasMany: true`, opcional) y dos campos de documento: `fichaTecnica` y `hojaSeguridad` (relationship a `medios`, filtrados a `mimeType` PDF).
- Una sola migración para los tres cambios.
- `npm run generate:types`.
- Actualizar los componentes que ya existen para que muestren la imagen cuando haya una, sin romper el caso sin imagen (nada de marcador inventado): `TarjetaProducto`, `TarjetaCultivo`, `productos/[slug]/page.tsx` (galería con `alt` obligatorio desde el panel, y los enlaces de PDF con su peso aproximado junto al nombre, como pedía la tarea "e" del plan 02).

### 3. Enlace de mapa en Contacto — ya resuelto

Revisión de esta tarea (2026-11-27): `src/components/tarjetas-datos-contacto.tsx` ya lee `contacto.urlMapa` y muestra «Ver en mapa» cuando hay valor (sin él, no aparece nada). La auditoría que dio origen a este plan se había quedado en `contacto/page.tsx` y no bajó al componente hijo que realmente lo renderiza. No hace falta ningún cambio de código aquí; solo queda pendiente cargar el dato real en el paso 4.

### 4. Contenido institucional real (contacto + historia)

- Crear `src/seed/contenido-grovelab-2026.ts` con los datos reales de `docs/solicitados/contacto/CONTACTO E HISTORIAS.docx`: teléfono (+51 987 524 473), correo (ventas@grovelabperu.com.pe), dirección (Av. Trapiche, Mz B1 Lt 12, Urb. El Pinar - Comas, Lima - Perú), `urlMapa` (enlace real), y los bloques de Nosotros (Historia, Misión, Visión, Compromiso) según lo que se confirme en los puntos 2 y 3 de "Confirmar antes de empezar".
- Actualizar `src/seed/seed-textos-sitio.ts` para leer de este archivo nuevo en vez de (o junto a) `contenido-textos-legacy.ts` — a decidir si el legacy se conserva como referencia histórica o se retira.
- Ejecutar `npm run seed:textos-sitio` en local (con `SEED_TEXTOS_FORCE=1` porque ya hay datos legacy cargados) y revisar en el panel antes de dar la tarea por cerrada, tal como pide la propia descripción del global `textos-sitio`.
- El campo de política de privacidad queda explícitamente sin tocar (ver punto 5 de "Confirmar antes de empezar").

### 5. Categorías, cultivos y plagas reales

- Confirmar o crear las categorías del punto 1 de "Confirmar antes de empezar".
- Confirmar o crear los cultivos con foto entregada: Palto, Arándano, Vid (más los que ya traigan los 6 productos y no tengan foto: manzano, peral, cerezo, tomate, ají, pimiento, etc. — sin foto por ahora, `POR CONFIRMAR` visual, dato textual sí disponible). Subir las 3 fotos de cultivo usando el campo del paso 2.
- Crear las plagas que aparecen en las fichas: Oidiosis (*Erysiphe necator*), Roya del cafeto (*Hemileia vastatrix*), Mancha del peral (*Stemphylium vesicarium*), Mosca minadora del arroz (*Hydrellia wirthi*).

### 6. Cargar los 6 productos reales

Para cada uno de CUAJADO, KOALA, LIGNOFOL, NOT FLY, PK 65 y TODYM: nombre, categoría, cultivos, plagas (si aplica), registro SENASA, presentaciones, tabla de dosis completa y foto del envase — toda esta información ya está transcrita de los documentos entregados (incluida la tabla de dosis que estaba como imagen dentro de cada `.docx`), lista para usar en este paso sin volver a abrir los archivos originales.

- A decidir: carga manual por el panel (sirve además para probar el flujo real de editor) o un script de seed puntual (`seed:productos-demo`, no productivo) — lo defino según lo que prefieras al llegar a este paso.
- Marcar 2 o 3 como "Destacado en inicio" para probar esa sección con datos reales.
- Los dos productos de `destacados/` sin ficha completa (ROSUIT PLUS, TORAZO) quedan fuera de esta carga, según el punto 6 de "Confirmar antes de empezar".

### 7. Favicon real

- Reemplazar `src/app/(frontend)/favicon.ico` (sigue siendo el de Next.js por defecto desde el primer commit) por uno generado del logo real ya disponible en `src/images/`.

## Verificación

- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` al cierre de cada tarea.
- `npm run test:e2e` en las tareas 1 y 2 (tocan el panel y la subida de archivos).
- Revisión visual 360 px / 1440 px de Inicio, `/productos`, una ficha de producto y Contacto, una vez cargadas fotos reales.
- Un editor de prueba sube una imagen y no ve la colección Usuarios.
- Ningún dato regulatorio (SENASA, dosis) distinto al transcrito de los documentos originales.

## Criterios de aceptación

1. Las fotos de `docs/solicitados/` (cultivos, productos) están subidas a Vercel Blob y se ven en la web, no en Postgres como `bytea`.
2. Los 6 productos con ficha completa están publicados con su dosis, SENASA, presentaciones y foto.
3. Contacto muestra teléfono, correo, dirección y enlace de mapa reales; WhatsApp funciona si `WHATSAPP_NUMBER` está cargado.
4. Nosotros muestra la historia real de Grovelab (a confirmar si reemplaza o convive con el texto legacy, según el punto 3 de "Confirmar antes de empezar").
5. El favicon es el logo real.
6. Nada de lo cargado es un dato inventado: todo sale de `docs/solicitados/` o de lo ya confirmado por Grovelab.

## Después de este plan

Sigue pendiente, fuera de este plan: el texto de política de privacidad (bloquea el formulario de contacto) y los ~70 productos restantes del catálogo histórico (fase 4, según `docs/planes/02-sitio-y-catalogo.md`).

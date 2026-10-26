# Plan 01 — Fase 1: base del proyecto

Estado: propuesta. No se instala nada ni se escribe código de aplicación hasta aprobar este documento.

Referencias: `AGENTS.md`, `docs/ALCANCE.md`, `docs/DISENO.md`.

## Objetivo

Dejar un proyecto Next.js (App Router) con TypeScript estricto, un solo archivo de tokens en variables CSS consumido por Tailwind v4 y por CSS (Modules y nativo), y un panel de administración con inicio de sesión y permisos por rol. Publicar un despliegue de prueba.

La fase termina cuando un miembro del equipo entra al panel y la portada mínima usa los tokens. El catálogo, el pedido y el diseño de páginas vienen en fases posteriores.

## Fuera de esta fase

- Páginas de Productos, Cultivos, Nosotros, Servicios, Blog, Zonas y Contacto.
- Buscador, fichas, tabla de dosis y flujo de pedido por WhatsApp.
- Carga de los ~70 productos, imágenes, PDF y textos reales.
- Almacenamiento de fotos y PDF. Es la primera tarea de la fase 2.
- Efectos del catálogo (parallax, 3D, aparición al desplazar). En esta fase solo se deja el respaldo: `prefers-reduced-motion` y contenido visible sin animar.
- Pagos, checkout, cuentas de cliente y comprobantes electrónicos.

## Versión fijada antes de la tarea 1

Comprobado el 25 de octubre de 2026 contra `@payloadcms/next` 3.92.0 (Payload 3 estable):

- Peer de Next.js: `>=15.2.9 <15.3.0 || >=15.3.9 <15.4.0 || >=15.4.11 <15.5.0 || >=16.3.3 <17.0.0`.
- Next.js a instalar: **16.4.3** (`next@16.4.3`). Es la estable más reciente de la línea 16, entra en ese peer e incluye el parche de seguridad del 14 de octubre de 2026 (desde 16.4.1). No se usa la línea 15.4: no tiene ese parche y el peer de 3.92.0 no admite 15.5.
- Node.js: `^22.23.4` o `>=24.22.1`, el `engines` de ese paquete. Node 23 no entra.
- `create-next-app` de la misma versión: `create-next-app@16.4.3`. React y `react-dom` quedan en las versiones que ese CLI resuelve para Next 16.4.3.
- Al instalar, se vuelve a leer el peer de la versión exacta de Payload. Si 16.4.3 ya no entra, se detiene la tarea 1 y se actualiza este apartado. No se sube Next por fuera del rango.

## Recomendación del panel

**Recomendación: Payload CMS 3 dentro del mismo proyecto Next.js, con PostgreSQL gestionado (Neon).**

El panel es un CMS (productos, presentaciones, categorías, cultivos, plagas, zonas, noticias, banners, textos, pedidos y usuarios). Construirlo a mano retrasa las fases 2 a 4. Payload cubre autenticación, roles y control de acceso por colección, y se despliega con la web en Vercel. Los pedidos (nombre y teléfono) quedan en nuestra base, con acceso por rol, y no en un servicio de contenidos de terceros.

La recomendación se cierra solo si el ensayo de la tarea 4 cumple los criterios de abajo. Si falla, se usa la alternativa.

### Comparación

| Criterio | Payload CMS 3 + PostgreSQL (Neon) | Panel propio: Drizzle + Better Auth + PostgreSQL |
|---|---|---|
| Qué es | CMS y API local dentro de Next.js. El equipo edita en `/admin`. | Formularios nuestros sobre SQL. Nosotros hacemos cada pantalla. |
| Login y roles | Incluidos. Se definen `administrador` y `editor`. | Hay que construir sesión, cookies y permisos. Más riesgo de error de seguridad. |
| Tiempo hasta el catálogo administrable | Bajo: las colecciones se declaran. | Alto: cada entidad es una pantalla de alta, edición y listado. |
| Idioma del panel | Etiquetas de colecciones y campos en español. La interfaz base de Payload trae traducción; hay que comprobar en el ensayo que queda usable en español. | Toda la interfaz en español desde el primer formulario. |
| Apariencia | La interfaz es la de Payload. No usa los tokens de la web pública. | Puede usar los mismos tokens. |
| Datos personales del pedido | En PostgreSQL nuestro. Sin registrar nombre ni teléfono en logs. | Igual. |
| Despliegue en Vercel | Viable con runtime Node y pool de conexiones. Hay que probarlo: Payload no corre en Edge. | Funciones de Next más simples. Menos piezas. |
| Archivos (fotos y PDF) | Fuera de esta fase. Primera tarea de la fase 2: almacenamiento externo (Vercel Blob o S3). No van en la base. | Igual. |
| Dependencia | Mayor (Payload, editor, adaptador de Postgres). Las actualizaciones mayores pueden romper. | Menor, pero el mantenimiento del panel es nuestro. |
| Acoplamiento | El modelo vive en la configuración de Payload. | El esquema SQL es portable. |

Sanity, Strapi o Directus quedan fuera de la recomendación: o alojan el contenido (y más adelante los pedidos) fuera de nuestra base, o exigen otro servicio además de Vercel.

### Condiciones de la recomendación

- Usuarios del panel solo para el personal de Grovelab. No hay cuentas de cliente.
- Roles mínimos desde el primer usuario: `administrador` (todo, incluidos usuarios) y `editor` (contenido). El editor no accede a la colección de usuarios ni ve datos de pedidos hasta que la fase 3 lo defina.
- Secretos solo en variables de entorno. Ningún secreto en el repositorio ni en el chat.
- El ensayo debe demostrar los criterios de la tarea 4: login correcto y rechazo de credencial inválida; la ruta de administración sin sesión redirige al login; etiquetas visibles en español; `npm run build` pasa; la función no usa runtime Edge.
- Si falla cualquiera de esos criterios, se detiene Payload y se pasa al panel propio. El rol editor no accede a usuarios. La web pública no puede mostrar inglés.

### Dependencias previstas (no instalar hasta aprobar)

Gestor de paquetes: npm, alineado con los scripts de `AGENTS.md`. Next.js queda fijado en 16.4.3. El resto de versiones exactas se anota en este plan al instalar.

| Paquete | Para qué | Alternativa |
|---|---|---|
| `next@16.4.3`, `react`, `react-dom` | App Router y páginas. La versión de Next es la que admite Payload 3.92.0. | Remix: otro enrutador; se descarta porque el stack ya está decidido. |
| `typescript` y tipos de Node y React | TypeScript estricto. | — |
| `eslint`, `eslint-config-next` | `npm run lint`. | Biome: un solo binario, pero se aparta del script previsto. |
| `tailwindcss` (v4, configuración en CSS) | Utilidades que leen los tokens vía `@theme inline`. | Tailwind 3: obliga a repetir los valores en la configuración. |
| `zod` | Validar entorno y, más adelante, formularios en el servidor. | Valibot: más liviano; Zod ya está en el stack. |
| `vitest` | Pruebas unitarias (entorno y tokens no aplican; sí un esquema Zod). | Jest: más lento de configurar con Next. |
| `@playwright/test` | Una prueba del login de Payload (`/admin/login`). | Solo prueba manual: no deja registro repetible. |
| `payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical` | Panel, login y Postgres. | Drizzle + Better Auth, si el ensayo falla. |

PostgreSQL gestionado: Neon (rama de desarrollo y cadena de conexión para serverless). Alternativa: Supabase usado solo como Postgres, sin Auth ni Storage de Supabase. Región, plan y respaldos: ver Pendientes.

## Estructura prevista

La plantilla blank de Payload separa la web pública y el panel en dos grupos de rutas, cada uno con su layout raíz (`<html>` y `<body>`). No hay `src/app/layout.tsx` ni `src/app/page.tsx` sueltos.

```
src/app/(frontend)/       portada y rutas públicas, desde la tarea 1
src/app/(payload)/        admin, API y GraphQL; se incorpora en la tarea 4
src/app/(panel)/          solo si se cae al panel propio
src/components/           un componente por archivo
src/lib/                  utilidades y acceso a datos
src/content/              textos estáticos
src/styles/tokens.css     único origen de los tokens
src/migrations/           migraciones del esquema, desde la tarea 6
```

Nombres de archivo en minúsculas con guiones. Componentes de servidor por defecto.

`tsconfig`: `strict`, `noUncheckedIndexedAccess`. `exactOptionalPropertyTypes` se prueba en el ensayo; si los tipos generados por Payload chocan, se documenta aquí y no se fuerza.

Alias `@/` hacia `src/`.

## Tokens

Un solo archivo, `src/styles/tokens.css`, importado desde `globals.css` del grupo `(frontend)`. Detalle de nombres en `docs/DISENO.md` (sección «Tokens y nombres»).

### Convención (evitar colisión con `@theme`)

Tailwind v4 usa el mismo espacio de nombres que los tokens de color (`--color-*`). **No** definir `--color-marca` en `:root` y repetir `--color-marca: var(--color-marca)` en `@theme inline`: es circular.

- **`:root` en `tokens.css`:** prefijo `--token-` y valores literales (comentados como **PROVISIONAL** hasta medir el logo), por ejemplo `--token-color-marca`, `--token-color-texto`, `--token-espacio-4`, `--token-radio-s`, `--token-font-titular`.
- **`@theme inline` en `globals.css`:** solo puentes Tailwind v4 (`--color-*`, `--spacing`, `--radius-*`, `--shadow-*`), por ejemplo `--color-marca: var(--token-color-marca);` y `--spacing: var(--token-espacio-1)` (base `0.25rem`; `p-8` = `2rem`). Sin hex ni px sueltos en el theme.
- **CSS Modules:** `var(--token-…)` directamente.

Catálogo semántico (nombres de diseño): color marca, texto, acento, fondo, éxito, error, aviso; tipografía titular y texto (`next/font`, familias POR CONFIRMAR); espacios `espacio-1` … `espacio-16` en **rem** (paso `0.25rem`, hasta `4rem`); radios `radio-s`, `radio-m`, `radio-l`; sombras `sombra-s`, `sombra-m`; foco `anillo-foco` (contraste AA).

### Movimiento reducido (global)

En `globals.css`, regla global `@media (prefers-reduced-motion: reduce)` que acorte o desactive animaciones y transiciones por defecto. Los módulos con animación propia añaden su propio respaldo en el mismo `*.module.css`.

En la portada mínima no hay colores ni tamaños sueltos fuera de tokens.

## Tareas

Cada tarea es un cambio pequeño. Se implementa, se verifica y se resume antes de seguir. No se agrupan.

### 1. Esqueleto Next.js

Requisitos ya fijados: Node `^22.23.4` o `>=24.22.1`, y `create-next-app@16.4.3` con `next@16.4.3`.

El repositorio ya tiene `docs/`, `AGENTS.md`, `.cursor/`, `.env.example`, `.gitignore`, `.cursorignore` y `propuesta_grovelab.md`. `create-next-app` no se ejecuta sobre la raíz: en un directorio no vacío puede reemplazar `.gitignore` y otros archivos. Se genera en un directorio temporal y se copian solo los archivos nuevos.

Se conservan sin sobrescribir: `.gitignore`, `.env.example`, `AGENTS.md`, `docs/`, `.cursor/`, `.cursorignore` y `propuesta_grovelab.md`. Al `.gitignore` existente se le suman las entradas de Next que falten (`.next/` ya está). Se mantienen `.env.*` y la excepción `!.env.example`.

TypeScript estricto, App Router, `src/`, ESLint. Scripts: `lint`, `typecheck` (`tsc --noEmit`), `build`, `test`.

La portada nace en el grupo público de la plantilla blank: `src/app/(frontend)/layout.tsx` y `src/app/(frontend)/page.tsx`. El layout del grupo es el layout raíz de la web (`<html lang="es-PE">`). Título «Grovelab», una frase de que el sitio está en construcción y metadatos (`title`, `description`). Sin teléfono, precios ni cifras.

### 2. Tokens compartidos

Añadir `src/styles/tokens.css` con variables `--token-*` y comentarios **PROVISIONAL** en colores. En `globals.css`: import de tokens, `@import "tailwindcss"`, `@theme inline` con puentes a `var(--token-…)` (sin autoreferencia; ver sección Tokens) y regla global `prefers-reduced-motion: reduce`.

Añadir un módulo de prueba `*.module.css` (por ejemplo `portada.module.css`) que use al menos `var(--token-color-…)` y `var(--token-espacio-…)`, con una animación ligera de prueba y `@media (prefers-reduced-motion: reduce)` en el mismo archivo.

La portada en `(frontend)` usa solo tokens (utilidades Tailwind del theme y clases del módulo). Comprobar en el navegador que un cambio en `tokens.css` se refleja en Tailwind y en el módulo CSS.

Elección de esta pantalla: Tailwind para el layout (pocas utilidades); CSS Module para la prueba de token y movimiento reducido local. **No instalar `sass`.**

### 3. Entorno

Esquema Zod que lee los nombres ya previstos y falla al arrancar si faltan los obligatorios de esta fase. Actualizar `.env.example` sin valores reales.

Nombres:

- `NEXT_PUBLIC_SITE_URL` — ya existe.
- `DATABASE_URL` — ya existe. Obligatoria a partir de la tarea 4.
- `PAYLOAD_SECRET` — secreto de sesión del panel. Solo si se confirma Payload.
- `WHATSAPP_NUMBER` — ya existe; no se usa en esta fase.

`.env.local` sigue ignorado por git.

### 4. Ensayo del panel (decide la herramienta)

Con la recomendación aprobada: Postgres de desarrollo en Neon, archivos de la plantilla blank copiados en `src/app/(payload)/` (admin, API y GraphQL), un usuario administrador creado por semilla local (contraseña solo en `.env.local`) y una colección de prueba que se borra al cerrar el ensayo o se deja vacía. El grupo `(frontend)` de la tarea 1 se mantiene.

Criterios del ensayo:

- Login correcto en `/admin/login` y rechazo de credencial inválida.
- La ruta de administración sin sesión redirige al login.
- Etiquetas visibles en español.
- `npm run build` pasa.
- La función no usa runtime Edge.
- El rol editor no accede a la colección de usuarios.

Si un criterio falla, se retira Payload de esta fase y la tarea 5 se rehace con Drizzle + Better Auth, reutilizando `DATABASE_URL` y el mismo esquema de roles. Esa alternativa se detalla en un anexo de este plan antes de escribirla; no se improvisa en el mismo cambio.

### 5. Roles, permisos y login

Con Payload no se diseña una pantalla de acceso. Se configuran roles y permisos, y se revisa el login que Payload ya trae en `/admin/login`.

- Roles: `administrador` y `editor`. El usuario semilla es administrador.
- El editor no accede a la colección de usuarios (ni lectura ni escritura). Tampoco ve pedidos hasta la fase 3.
- Sin registro público.
- Límite de intentos: Payload, si no se configura, usa `maxLoginAttempts: 5` y `lockTime: 600000` (10 minutos). Un valor `0` desactiva el bloqueo. En la colección de usuarios se escriben esos dos valores de forma explícita. Se comprueba que, tras cinco contraseñas incorrectas, el intento siguiente no entra aunque la contraseña sea la buena, hasta que pase el bloqueo.

La pantalla propia (etiquetas, foco visible, área táctil de al menos 44 px, mismos 5 intentos y 10 minutos de bloqueo) se construye solo si el ensayo cae al panel propio.

Playwright apunta a `/admin/login`. Si se cae al panel propio, pasa a apuntar a la pantalla propia.

### 6. Despliegue de prueba

No empieza hasta tener la cuenta de Vercel Pro a nombre del cliente.

Proyecto en esa cuenta. Variables de entorno en el panel de Vercel, no en el repo. URL de vista previa anotada fuera del código. La portada y `/admin/login` se revisan en 360 px y 1440 px.

El esquema de Neon (vista previa y producción) se gestiona solo con migraciones. `push` queda en `false` para esas bases: no se mezcla `push` con migraciones en la misma base. Directorio: `src/migrations`.

Flujo documentado:

1. Cambio de colecciones en local, contra una base de desarrollo distinta de la de vista previa.
2. `payload migrate:create` genera el archivo en `src/migrations`. El nombre describe el cambio. El archivo entra al repositorio.
3. `payload migrate:status` muestra lo pendiente.
4. `payload migrate` aplica las pendientes. En Vercel corre antes de servir la versión nueva. No se usa `db push` contra Neon de vista previa ni de producción.

## Seguridad

- Autenticación obligatoria en todo el panel. Cookies de sesión HttpOnly; el secreto no va al cliente.
- Autorización por rol en el servidor, no solo ocultando botones. El editor no accede a usuarios.
- Bloqueo tras 5 intentos fallidos durante 10 minutos. No se desactiva con `maxLoginAttempts: 0`.
- Validación Zod en el servidor para cualquier entrada propia. El login de Payload se revisa; no se reimplementa en esta fase.
- No registrar cuerpo de peticiones ni datos personales.
- Sin `NEXT_PUBLIC_` para secretos ni para la cadena de la base.

## Verificación de la fase

Antes de dar la fase por cerrada:

- `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build` en verde.
- Prueba de Playwright contra `/admin/login`: el formulario de Payload responde y, sin sesión, no se ve el panel.
- Un sexto intento de login fallido queda bloqueado.
- Revisión manual en celular (360 px) y escritorio (1440 px): contraste del texto provisional, foco visible, `prefers-reduced-motion` sin movimiento obligatorio.
- Confirmar que `.env.local` no está en git y que el `.gitignore` previo sigue ignorando `.env.*`.
- `payload migrate:status` limpio en la base de vista previa, sin `push`.

## Criterios de aceptación

1. El repositorio instala, compila y pasa lint y tipos en modo estricto, con Next.js 16.4.3.
2. Existe un único archivo de tokens (`--token-*`); Tailwind (vía `@theme`) y los CSS Modules leen los mismos valores sin duplicar literales.
3. La portada está en `(frontend)`, en español, sin datos inventados de Grovelab.
4. Hay panel con el login de Payload, dos roles, editor sin acceso a usuarios y una ruta protegida.
5. Hay un despliegue de prueba cuyo esquema llegó por migraciones, con la base fuera del repositorio.
6. No hay páginas de catálogo ni flujo de WhatsApp.

## Pendientes

- Aprobar esta recomendación (Payload + Neon) o pedir el panel propio antes de la tarea 4.
- Región de Neon, plan y respaldos (retención y restauración). POR CONFIRMAR antes de crear el proyecto de base.
- Cuenta de Vercel Pro a nombre del cliente, creada antes de la tarea 6.
- Almacenamiento de archivos (fotos y PDF) como primera tarea de la fase 2. Vercel Blob o S3; no en esta fase.
- Medir logo para reemplazar colores PROVISIONALES. Familias tipográficas: POR CONFIRMAR.
- Texto de política de privacidad: no hace falta en esta fase; sí antes del formulario de pedido.
- Quién será el primer administrador (no guardar su contraseña en el repositorio).

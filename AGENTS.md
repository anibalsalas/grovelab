# Grovelab — web corporativa y catálogo con pedido por WhatsApp

Idioma de trabajo: español (Perú). Toda la interfaz, mensajes y textos van en español. El código (nombres de variables, funciones, commits) puede ir en inglés o español, pero de forma consistente.

## Qué estamos construyendo
Nueva web de Grovelab (https://grovelabperu.com.pe), empresa de productos para el sector agrícola. Reemplaza una web WordPress de 2019.
Es un **catálogo con pedido por WhatsApp**: el visitante arma su pedido en la web y lo envía por WhatsApp. **No hay pagos en línea ni cuentas de cliente** (por ahora).
Detalle en `docs/ALCANCE.md`.

## Stack (propuesto — confirmar antes de instalar dependencias)
- Next.js (App Router) + TypeScript estricto
- Estilos: **solo Tailwind v4 y CSS** — utilidades de Tailwind, CSS global y **CSS Modules** (`*.module.css`), más CSS nativo (anidado, variables, `@keyframes`, `@property`, animaciones atadas al scroll). Elige el más adecuado en cada caso con los criterios de `docs/DISENO.md`. Un solo juego de tokens en variables CSS (`src/styles/tokens.css`). **No se usa SCSS.**
- Panel administrable y base de datos: POR CONFIRMAR (opción: Payload CMS + PostgreSQL gestionado)
- Hosting: Vercel (plan Pro, cuenta a nombre del cliente)
- Validación: Zod. Pruebas: Vitest y Playwright
- **Cache Components** (`cacheComponents` en Next.js) desactivado mientras el panel sea Payload 3.92.0 (incompatible con `generateMetadata` del admin).

## Reglas de trabajo
1. **Primero un plan, luego el código.** Para cualquier tarea que toque más de 2 archivos, propón el plan y espera confirmación.
2. **Tareas pequeñas.** Una función o pantalla por vez. No generes módulos enteros de una sola pasada.
3. **No agregues dependencias** sin decir cuál, para qué y qué alternativa hay.
4. **No inventes datos.** Productos, precios, teléfonos, certificaciones y cifras salen de Grovelab. Si falta un dato, deja un marcador `POR CONFIRMAR`.
5. **Nunca** escribas claves, tokens ni números reales en el código. Usa variables de entorno (`.env.local`, que no se sube a git). Para `npm run dev`, `npm run build` o un clon limpio: copia `.env.example` a `.env.local` y define al menos `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, `DATABASE_URL` y `PAYLOAD_SECRET`. Los scripts de Payload (`migrate`, `migrate:status`, `migrate:create`, `generate:types`, `generate:importmap`, `seed:admin`) cargan `.env.local` con `node --env-file=.env.local` y usan `--disable-transpile` en el CLI (evita conflicto tsx/undici en Node 24). Tras `migrate:create`, separa `import type` para `MigrateUpArgs` / `MigrateDownArgs` y deja `sql` como import de valor. La semilla (`seed:admin`) rechaza `NODE_ENV=production`, no imprime secretos y requiere `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` en `.env.local`. Si `migrate` falla por el pooler de Neon, usa la cadena directa (sin pooler) solo para migrar y reporta el error. Los archivos que carga el CLI de Payload deben usar imports relativos con extensión `.ts` (sin alias `@/` ni `@payload-config`).
6. Antes de terminar una tarea: que compile, que pase lint y pruebas, y resume qué cambió y qué falta.
7. No modifiques `docs/` ni estas reglas sin que se pida.

## Diseño
La dirección visual, los tokens y el catálogo de efectos están en `docs/DISENO.md`. **Léelo antes de tocar estilos o componentes visuales.**
Regla de oro: **coherencia sobre espectáculo**. Cada efecto (parallax, 3D, animación) debe tener un lugar y un motivo definidos en `docs/DISENO.md`, un respaldo para celular y para quien prefiere menos movimiento. Si no está en el catálogo, pregunta antes de agregarlo.

## Flujo de trabajo
Plan → Agent → verificación. Guarda los planes en `docs/planes/` y refiérete a ellos con `@`. Cada modo empieza con contexto nuevo: no asumas lo conversado antes.
Verificación mínima antes de cada commit: `npm run lint`, `npm run typecheck`, `npm run build` y, si hay pantallas nuevas, captura en celular y escritorio.

## Fuera de alcance por ahora
Pasarela de pagos, checkout, cuentas de usuario, boletas/facturas electrónicas desde la web.
Si una tarea parece requerir alguno de esos, detente y avisa.

## Panel Payload (roles y pruebas)
- Roles: `administrador` y `editor` en la colección `users`. El semilla es `administrador` (`npm run seed:admin` actualiza el rol si el usuario ya existía).
- E2E: `npm run test:e2e` (Playwright **1.64.1**). Primera vez: `npx playwright install` (o `npx playwright install chromium`). No uses credenciales ni `.env.local` en las pruebas E2E.
- **Editor de prueba:** inicia sesión como administrador → Usuarios → crear usuario con rol Editor y contraseña temporal. Comprueba: no aparece el grupo/colección Usuarios en el menú; no puede abrir `/api/users` con su sesión para listar a otros; en su perfil puede cambiar datos propios pero el campo Rol no es editable.
- **Bloqueo por intentos:** en `/admin/login`, con un usuario real de prueba, envía 5 contraseñas incorrectas seguidas; el 6.º intento con la contraseña correcta debe fallar. Espera 10 minutos (o revisa en BD el campo `lock_until` del usuario) y vuelve a intentar: entonces debe permitir el acceso.

## Calidad mínima
- Accesible (etiquetas, foco visible, contraste) y pensada primero para celular.
- Rápida: imágenes optimizadas, sin librerías pesadas innecesarias.
- SEO: títulos y descripciones por página, URLs limpias en español.

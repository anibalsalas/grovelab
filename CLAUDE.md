@AGENTS.md

# Claude Code en Grovelab

Este repositorio se trabaja con Cursor y con Claude Code. `AGENTS.md` es la fuente común de reglas y se importa arriba: no repitas aquí lo que ya dice. Este archivo solo añade lo propio de Claude Code.

## Antes de tocar código

- Lee `docs/ALCANCE.md`, `docs/DISENO.md` y el plan de la fase en `docs/planes/`. Si lo pedido no está en el plan, propón primero el cambio al plan.
- Trabaja por tareas pequeñas, una por commit, en una rama `feat/...`.
- No hagas `git push`, merge ni borres ramas sin que te lo pida.

## Verificación antes de cerrar una tarea

- `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build` deben pasar.
- `npm run test:e2e` cuando cambie el acceso, los roles o el panel.
- El build necesita `.env.local` (ver `.env.example`). No leas, imprimas ni pegues su contenido ni el de ningún secreto.

## Skills del proyecto (`.claude/skills/`)

- `/ux-ui-2026`: criterios de UX/UI. Escribe una Decisión UX antes de implementar una pantalla.
- `/revision-visual`: capturas a 360 y 1440 px y revisión de lo implementado.
- `/revision-calidad`: revisión de código antes de cada commit.
- `diseno-web-agricola`: identidad visual del sector.

Si una tarea toca interfaz, di al empezar qué skills y reglas aplicaste.

## Skills de terceros (frontend-design, accessibility, audit-website, etc.)

- Se usan solo si el usuario las invoca explícitamente; no las apliques por iniciativa propia.
- Si una recomendación de estas skills contradice `AGENTS.md` o `docs/DISENO.md`, mandan estos documentos.
- `audit-website`: solo modo informe. No apliques sus fixes automáticos ni edites código a partir de sus hallazgos sin que se pida por separado.

## Reglas que más se olvidan

- Estilos solo con Tailwind v4 y CSS (módulos `*.module.css` y CSS nativo). Sin SCSS. Colores, tamaños y fuentes salen de los tokens `--token-*`.
- Base de datos solo con migraciones; nunca `db push` en las ramas de Neon.
- Payload: lo que carga su CLI usa imports relativos con extensión `.ts` (detalle en `AGENTS.md`).
- No inventes datos regulatorios (registros SENASA, dosis, periodos de carencia) ni cifras de Grovelab: se marcan POR CONFIRMAR.
- No toques `.cursor/` salvo que te lo pida. Los skills compartidos viven en `.claude/skills/`.
- Las reglas de `.claude/rules/` son copia de `.cursor/rules/`: si cambias una, cambia la otra en el mismo commit.

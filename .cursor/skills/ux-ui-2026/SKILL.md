---
name: ux-ui-2026
description: Criterios de UX/UI contemporáneos para decidir y revisar pantallas, componentes, textos de interfaz y efectos (parallax, 3D, vidrio translúcido) del sitio de Grovelab, un catálogo agrícola con pedido por WhatsApp. Úsalo al planear o implementar páginas nuevas, al escribir microcopy, al proponer animaciones y al revisar accesibilidad, peso de página y consentimiento de datos.
---

# UX/UI 2026 para Grovelab

Complementa a `diseno-web-agricola` (identidad visual del sector) y a la regla `diseno-ui.mdc` (tokens, Tailwind v4 y CSS). No las reemplaza. Si hay conflicto, mandan `AGENTS.md`, `docs/ALCANCE.md` y `docs/DISENO.md`.

## Para quién diseñamos

Agricultores, técnicos y compradores peruanos que consultan sobre todo desde el celular, a veces con conexión inestable y con niveles distintos de lectura digital. Cada pantalla existe para que encuentren el producto, entiendan la dosis y envíen el pedido por WhatsApp con el menor esfuerzo. Los perfiles reales están POR CONFIRMAR con Grovelab: no inventes cifras de usuarios.

## Cómo usar este skill

1. **Antes de implementar una pantalla, escribe una Decisión UX** (plantilla abajo) en el plan o en la descripción del cambio.
2. Para saber qué tendencia aplica y con qué límite, lee `references/tendencias-2026.md`.
3. Antes de dar la tarea por cerrada, recorre `references/checklist.md`.
4. Para saber qué aplicar en cada fase y qué pedirle al agente, lee `references/aplicacion-por-fase.md`.

## Plantilla: Decisión UX (máximo 8 líneas)

- **Tarea del usuario:** qué quiere lograr.
- **Contexto:** dispositivo, conexión, lugar de uso.
- **Patrón elegido y por qué.**
- **Texto clave:** títulos, botones y términos técnicos explicados.
- **Estados:** carga, vacío, error, sin precio ("Cotizar"), sin conexión.
- **Efectos:** propósito, costo y respaldo; o "ninguno".
- **Medición:** qué evento se mide, con consentimiento y sin datos personales.

## Principios, en orden de prioridad

1. **La tarea manda.** Cada pantalla tiene una acción principal visible sin desplazarse a 360 px de ancho. Lo decorativo nunca compite con ella.
2. **Poco peso (low data UX).** No cargues lo que no se ve. Imágenes con `next/image` y `sizes`, video solo bajo demanda con póster liviano, dos familias tipográficas, nada de librerías pesadas para un efecto menor. Mide el peso en `next build` y con Lighthouse; no asumas.
3. **Lenguaje claro e inclusivo.** Frases cortas, verbos de acción, un término técnico explicado la primera vez (ingrediente activo, formulación, periodo de carencia). Etiquetas siempre visibles, errores que dicen qué hacer. Sin mayúsculas sostenidas ni bloques largos.
4. **Accesibilidad como piso, no como techo.** WCAG 2.2 nivel AA. Detalle en `references/checklist.md`.
5. **Respeto por la persona.** Sin patrones oscuros: nada de falsa urgencia, casillas premarcadas ni "rechazar" más difícil que "aceptar". El aviso de privacidad va antes de pedir datos.
6. **Efectos con propósito.** Solo si comunican jerarquía, estado o la historia "Del suelo a la cosecha". Ver escalera abajo.
7. **Personalización mínima y local.** Recordar el cultivo elegido en el navegador sí; inferir emociones o perfilar a la persona, no.
8. **Evidencia sobre opinión.** Mide con consentimiento y combina señales (lo que dicen, lo que hacen, el contexto). Una decisión de diseño importante cita su evidencia o dice que es una hipótesis.

## Escalera de efectos

1. ¿Comunica jerarquía, estado o narrativa? Si no, no se hace.
2. Resuélvelo sin efecto. Si hace falta movimiento, primero CSS o Tailwind; JavaScript solo si no hay otra vía.
3. Anima solo `transform` y `opacity`.
4. Declara el respaldo: `prefers-reduced-motion`, navegador sin soporte (`@supports`), móvil, sin JavaScript.
5. Vidrio translúcido, 3D y animaciones atadas al scroll tienen reglas propias en `references/tendencias-2026.md`. Respétalas.
6. Elige Tailwind o CSS con el criterio de `diseno-ui.mdc` y deja una línea con la elección. Un solo enfoque por efecto dentro de un componente.

## Lo que este skill NO hace

- No inventa datos regulatorios (registros SENASA, dosis, periodos de carencia) ni cifras de la empresa: se marcan POR CONFIRMAR.
- No sustituye la asesoría legal. Las notas sobre datos personales son criterios de diseño, no dictamen.
- No decide por el diseñador: propone, justifica y deja la decisión final a quien revisa.

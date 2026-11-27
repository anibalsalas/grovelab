---
name: revision-visual
description: Revisión visual y de experiencia de usuario de lo recién implementado, a 360 px y 1440 px, antes de cerrar una tarea de interfaz.
disable-model-invocation: true
---

# Revisión visual

Úsala al terminar una tarea que cambie páginas o componentes visibles. No sustituye a /revision-calidad.

## Pasos
1. Con `npm run dev` en marcha, captura las páginas tocadas con Playwright a 360 px y a 1440 px de ancho y guárdalas en `.tmp/capturas/` (carpeta ignorada por git). Mira las capturas antes de opinar.
2. Compara contra docs/DISENO.md: tokens, tipografía, espaciado, jerarquía.
3. Informa por página, con evidencia (qué capturas viste), no con generalidades.

## Qué comprobar
- Jerarquía: un solo h1, un foco claro por pantalla, contraste de texto AA (4.5:1), CTA principal visible sin desplazarse en 360 px.
- Responsivo: sin desbordamiento horizontal, áreas táctiles de al menos 44 px, tablas (dosis) legibles en celular.
- Tokens: sin colores, tamaños ni fuentes sueltos fuera de src/styles/tokens.css.
- Movimiento: solo transform y opacity; con prefers-reduced-motion el contenido se ve completo y sin animar.
- Rendimiento: imágenes con next/image y tamaños declarados (sin CLS), sin librerías pesadas para un efecto menor.
- Contenido: en español, sin datos, cifras, registros SENASA ni dosis inventados. Lo desconocido se marca POR CONFIRMAR.
- Coherencia: el efecto o patrón nuevo existe en docs/DISENO.md o se propone allí, no se improvisa solo en la página.

## Entrega
Lista corta de hallazgos por gravedad (bloquea / mejora / opcional), cada uno con página, viewport y arreglo propuesto. No cambies código en esta revisión salvo que se pida.
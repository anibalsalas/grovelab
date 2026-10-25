---
name: revision-calidad
description: Revisión de calidad antes de un commit o entrega (código, accesibilidad, rendimiento, coherencia visual, alcance). Invócala manualmente con /revision-calidad.
disable-model-invocation: true
---

# Revisión de calidad

Revisa los cambios actuales contra `AGENTS.md`, `docs/ALCANCE.md` y `docs/DISENO.md`. Responde con una lista corta:

1. **Alcance:** ¿se tocó algo fuera del plan o del alcance (pagos, cuentas, dependencias nuevas)?
2. **Código:** tipos, validación en servidor, manejo de errores, sin secretos, sin `any` injustificado.
3. **Verificación:** ejecuta lint, typecheck y build; informa el resultado real. No digas que pasó si no lo ejecutaste.
4. **Diseño:** ¿usa tokens y efectos del catálogo? ¿hay respaldo para celular y `prefers-reduced-motion`?
5. **Accesibilidad:** etiquetas, foco, contraste, orden de lectura, textos alternativos.
6. **Rendimiento:** imágenes optimizadas, JS agregado, riesgo de CLS.
7. **Contenido:** ¿hay datos inventados? Márcalos como POR CONFIRMAR.

Termina con: **Listo para commit / Corregir antes de commit**, y los pendientes.

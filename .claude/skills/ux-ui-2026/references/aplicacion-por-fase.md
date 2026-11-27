# Cómo aplicar el skill en cada fase

El skill se activa solo cuando la descripción coincide con la tarea (diseñar pantallas, escribir microcopy, proponer efectos, revisar accesibilidad). Para estar seguro de que se use, nómbralo en el prompt: `/ux-ui-2026`.

Ajusta los nombres de fase a `docs/ALCANCE.md` si difieren.

## Flujo general

1. **Plan (Grok 4.7, modo Plan).** Pide que cada pantalla del plan incluya su Decisión UX.
2. **Implementación (Composer 2.5, modo Agent).** Antes de escribir la pantalla, el agente devuelve su Decisión UX y espera confirmación.
3. **Revisión.** Al terminar: `/revision-calidad` (código), `/revision-visual` (capturas a 360 y 1440 px) y la lista `references/checklist.md`.
4. **Commit pequeño** por tarea, con la elección Tailwind o CSS anotada.

## Fase 2: catálogo

Aplica con prioridad: lenguaje claro, low data UX, accesibilidad de tablas y filtros.

- Buscador por cultivo, plaga y categoría: estados vacío y "sin resultados" con salida útil; registrar la búsqueda sin resultados como evento.
- Ficha de producto: términos técnicos explicados, tabla de dosis como tabla HTML real, ficha técnica y hoja de seguridad como descargas con peso visible, "Cotizar" cuando no hay precio.
- Listados: imágenes optimizadas, sin carruseles automáticos.
- Contenido regulatorio (registro SENASA, dosis, carencia): POR CONFIRMAR hasta recibirlo de Grovelab.

Prompt para el plan:
```
Aplica el skill /ux-ui-2026 al plan de la fase 2. Para cada página pública (listado, ficha, cultivos, buscador) añade su Decisión UX: tarea, contexto móvil, patrón, texto clave con términos explicados, estados (carga, vacío, error, sin precio, sin conexión), efectos con respaldo y evento de medición. Marca como POR CONFIRMAR todo dato regulatorio. No escribas código.
```

## Fase 3: pedido por WhatsApp

Aplica con prioridad: ética y consentimiento, entrada redundante, ayuda consistente.

- "Mi pedido" con datos mínimos (nombre, teléfono, ciudad o zona); aviso de privacidad antes de pedirlos; casillas sin marcar; no pedir dos veces el mismo dato.
- Mensaje de WhatsApp claro y completo: es la interfaz donde se cierra la venta.
- Botón de WhatsApp en el mismo lugar en todas las páginas; el botón flotante no debe tapar el foco.
- Medir: producto agregado, pedido enviado, abandono. Sin datos personales en la analítica.
- Revisión legal de textos de privacidad antes de publicar.

Prompt para el plan:
```
Aplica el skill /ux-ui-2026 al plan de la fase 3. Diseña el flujo "Mi pedido" con su Decisión UX: datos mínimos, aviso de privacidad antes de pedirlos, consentimiento sin casillas premarcadas, sin pedir dos veces el mismo dato, estados de error y sin conexión, y el texto del mensaje de WhatsApp. Lista qué debe revisar un asesor legal antes de publicar. No escribas código.
```

## Fase 4: experiencia "Del suelo a la cosecha" y efectos

Aplica con prioridad: escalera de efectos, 3D como mejora progresiva, vidrio con límites, megabrutalismo con accesibilidad.

- Cada efecto con propósito, costo y respaldo. La experiencia se construye de menos a más: primero versión estática accesible, luego movimiento.
- Animaciones por scroll con `@supports` y movimiento reducido; verificar soporte en caniuse.
- 3D real solo con modelos aportados por Grovelab y dentro del presupuesto.
- Sin interacciones que exijan arrastrar sin alternativa.

Prompt para el agente:
```
/ux-ui-2026 Antes de implementar la sección [nombre], devuélveme su Decisión UX con la escalera de efectos: propósito, costo, respaldo (movimiento reducido, sin soporte, móvil) y elección Tailwind o CSS. Espera mi confirmación y luego implementa. Al terminar, pasa /revision-visual.
```

## Fase 5: contenido, pulido y salida

- Revisar contraste real con la marca definitiva, tokens cerrados y tipografía confirmada.
- Medir peso y rendimiento final; fijar el tope definitivo en `docs/DISENO.md`.
- Instalar la analítica aprobada con consentimiento y revisar eventos.
- Primer ciclo de revisión mensual con Grovelab: qué se buscó sin éxito y qué se abandona.

Prompt de revisión:
```
/ux-ui-2026 Revisa las páginas [lista] con references/checklist.md. Captura a 360 y 1440 px y mira las capturas antes de opinar. Informa los hallazgos por gravedad con página, ancho, evidencia y arreglo. No cambies código.
```

## Revisión mensual después del lanzamiento (30 minutos con Grovelab)

1. Búsquedas sin resultados: ¿qué productos, cultivos o plagas faltan?
2. Pedidos iniciados frente a enviados: ¿dónde se abandona?
3. Preguntas nuevas que llegan por WhatsApp: ¿qué debería explicar la web?
4. Decidir dos ajustes pequeños para el mes siguiente y anotarlos en el plan.

## Dónde guardar las decisiones

Anota cada Decisión UX en el plan de su fase (`docs/planes/`). Si una decisión cambia un patrón general (por ejemplo, el tratamiento tú o usted, o el tope de peso), súbela a `docs/DISENO.md` para que valga para todo el sitio.

# Lista de revisión UX/UI

Úsala al cerrar una tarea que cambie interfaz. Marca cada punto como cumple, no cumple o no aplica, y para lo que no cumpla indica página, ancho de pantalla y arreglo propuesto. Revisa con capturas a 360 px y 1440 px (`/revision-visual`) y con teclado.

## 1. Tarea y jerarquía
- [ ] La pantalla tiene una acción principal clara, visible sin desplazarse a 360 px.
- [ ] Un solo `h1`; los encabezados siguen un orden lógico.
- [ ] Lo decorativo no compite con la acción principal.
- [ ] La Decisión UX está escrita (tarea, contexto, patrón, texto, estados, efectos, medición).

## 2. Lenguaje
- [ ] Frases cortas, voz activa, sin siglas sin explicar.
- [ ] Términos técnicos explicados en la propia página, no solo con tooltip.
- [ ] Botones dicen qué pasa ("Enviar pedido por WhatsApp").
- [ ] Etiquetas de formulario visibles; errores dicen qué corregir.
- [ ] Sin datos, cifras, registros ni dosis inventados; lo desconocido está POR CONFIRMAR o dice "Consultar con un asesor".
- [ ] Tratamiento (tú o usted) consistente con `docs/DISENO.md`.

## 3. Accesibilidad (WCAG 2.2 AA)
- [ ] Contraste de texto 4,5:1 (texto grande 3:1) y de componentes de interfaz 3:1.
- [ ] Todo se opera con teclado; el foco es visible y sigue un orden lógico.
- [ ] **Foco no tapado (2.4.11):** el encabezado fijo y el botón flotante de WhatsApp no ocultan por completo el elemento enfocado (usa `scroll-padding` y revisa al tabular).
- [ ] **Arrastre (2.5.7):** todo lo que se hace arrastrando (sliders, selectores) tiene alternativa con un toque o clic.
- [ ] **Tamaño de objetivo (2.5.8):** al menos 24 × 24 px CSS como piso de WCAG; el proyecto usa 44 px.
- [ ] **Ayuda consistente (3.2.6):** el botón de WhatsApp y el contacto aparecen en el mismo lugar en todas las páginas.
- [ ] **Entrada redundante (3.3.7):** no se pide dos veces el mismo dato dentro del flujo de pedido.
- [ ] **Autenticación accesible (3.3.8):** en el login del panel se puede pegar la contraseña y usar gestor de contraseñas; sin pruebas cognitivas sin alternativa.
- [ ] **Nombre accesible contiene el texto visible (2.5.3)** para que funcione el control por voz.
- [ ] Contenido en movimiento de más de 5 s tiene control para pausar (2.2.2); nada parpadea.
- [ ] Reflujo a 320 px y zoom de texto al 200 % sin pérdida de contenido ni scroll horizontal.
- [ ] Imágenes con texto alternativo útil; decorativas con `alt=""`.
- [ ] Tablas de dosis son tablas HTML con encabezados reales.

## 4. Móvil y peso (low data UX)
- [ ] Probado a 360 px; sin desbordamiento horizontal.
- [ ] Imágenes con `next/image` y `sizes`; ninguna más grande de lo mostrado.
- [ ] Video, 3D y contenido pesado cargan bajo demanda.
- [ ] No se agregaron librerías pesadas para un efecto menor.
- [ ] Peso de la ruta revisado en `next build` y comparado con el tope de `docs/DISENO.md`.
- [ ] LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms en la revisión con Lighthouse.

## 5. Efectos
- [ ] Cada efecto tiene propósito (jerarquía, estado o narrativa).
- [ ] Solo anima `transform` y `opacity`.
- [ ] Respaldo para `prefers-reduced-motion`, para navegadores sin soporte (`@supports`) y para móvil.
- [ ] Vidrio translúcido: texto con 4,5:1 contra el peor caso del fondo, una sola capa, respaldo sólido con `prefers-contrast: more`.
- [ ] 3D: el contenido está siempre en el HTML; versión estática disponible.
- [ ] Tailwind o CSS elegido con criterio y anotado; un solo enfoque por efecto en el componente.
- [ ] Los colores, tamaños y fuentes salen de tokens.

## 6. Estados
- [ ] Carga, vacío, error y sin conexión tienen diseño y texto.
- [ ] Sin precio muestra "Cotizar", no un precio inventado.
- [ ] Búsqueda sin resultados ofrece una salida (ver todos los productos, contactar a un asesor).

## 7. Datos y respeto (marco peruano, criterios de diseño)
- [ ] El aviso de privacidad aparece antes de pedir datos, con la finalidad en lenguaje simple.
- [ ] Casillas sin marcar; el consentimiento de marketing es aparte del de atender el pedido.
- [ ] Rechazar o retirar consentimiento es tan fácil como darlo.
- [ ] Sin patrones oscuros (falsa urgencia, contadores, botones engañosos).
- [ ] Datos personales solo los mínimos definidos en `docs/ALCANCE.md`; nunca en logs ni en la analítica.
- [ ] Cuestiones legales (registro de banco de datos, responsable, derechos) derivadas a asesor legal.

## 8. Medición
- [ ] Los eventos de este cambio están en la lista aprobada, con propósito.
- [ ] La medición respeta el consentimiento y no incluye datos personales.

## Cómo informar

Lista corta de hallazgos por gravedad: **bloquea** (accesibilidad, datos, rendimiento fuera de presupuesto), **mejora** y **opcional**. Cada uno con página, ancho de pantalla, evidencia (captura o comando) y arreglo propuesto. Sin cambios de código salvo que se pidan.

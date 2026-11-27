# Tendencias UX/UI 2026 aplicadas a Grovelab

Fuente base: artículo de tendencias UX/UI 2026 aportado por el equipo (doce tendencias). Cada una se contrasta con el contexto de Grovelab: catálogo agrícola, uso móvil, pedido por WhatsApp, sin pagos web, sin cuentas de cliente. Donde se consultaron fuentes adicionales se indican al final.

**Leyenda:** APLICA = se aplica con prioridad. ADAPTADA = se aplica en versión reducida. LÍMITE = se permite con restricciones. NO APLICA = fuera de alcance.

| Tendencia | Veredicto | Resumen |
|---|---|---|
| Always-on research | ADAPTADA | Analítica ligera con consentimiento y revisión mensual |
| Investigación multimodal | ADAPTADA | Tres señales accesibles, sin biometría |
| Ética y sustentabilidad (low data UX) | APLICA | Peso, consentimiento y honestidad |
| Sentient UX e hiperpersonalización | ADAPTADA | Solo memoria local simple |
| UX writing inclusivo | APLICA | Lenguaje claro para lectores diversos |
| Liquid glass | LÍMITE | Superficies pequeñas, contraste garantizado |
| 3D inmersivo | LÍMITE | Mejora progresiva, nunca bloquea contenido |
| Spatial UI | NO APLICA | Realidad extendida fuera de alcance |
| Nostalgia noventera | NO APLICA | No encaja con la marca |
| Megabrutalismo | LÍMITE | Tipografía grande sí, con accesibilidad |
| Phygital | ADAPTADA | Puente físico-digital: WhatsApp y, a validar, QR |
| VUI | NO APLICA | Se deja el sitio compatible, no se diseña voz |

---

## 1. Always-on research (investigación continua)

**Qué dice la tendencia.** La investigación deja de ser una fase y pasa a ser continua: eventos, microcomportamientos y fricciones pequeñas generan información todo el tiempo.

**En Grovelab (ADAPTADA).** No hace falta una plataforma de datos. Sí conviene medir unos pocos eventos que respondan preguntas de negocio, con consentimiento y sin datos personales:

- Búsqueda sin resultados (qué cultivo, plaga o producto no encuentran).
- Producto agregado a "Mi pedido" y pedido enviado por WhatsApp.
- Abandono de "Mi pedido" antes de enviar.
- Ficha técnica descargada.
- Fricción: clics repetidos en un mismo elemento no interactivo.

**Cómo aplicarlo.**
- Define la lista de eventos en el plan de la fase, con nombre y propósito. No agregues eventos que nadie vaya a usar.
- Prefiere una herramienta de analítica sin cookies y sin perfilado. La herramienta concreta queda por decidir con Grovelab; no instales ninguna sin aprobación.
- Revisión mensual de 30 minutos con Grovelab: qué se buscó sin éxito, qué se abandona. De ahí salen los ajustes.

**Límite.** Nada de grabaciones de sesión ni mapas de calor con captura de campos de formulario. Los datos del pedido nunca pasan por la analítica.

## 2. Investigación multimodal

**Qué dice la tendencia.** La verdad de la experiencia está en la suma de señales: verbales, conductuales, visuales, contextuales y fisiológicas. Lo que la gente dice no siempre coincide con lo que hace.

**En Grovelab (ADAPTADA).** Usa tres señales accesibles y deja fuera las fisiológicas (seguimiento ocular, pupilas):

1. **Lo que dicen:** las preguntas más frecuentes que Grovelab recibe por WhatsApp y teléfono. Pídeselas antes de diseñar el buscador y la tabla de dosis.
2. **Lo que hacen:** los eventos del punto anterior.
3. **Contexto:** tipo de dispositivo, ancho de pantalla y calidad de conexión, de forma agregada.

**Cómo aplicarlo.** Cuando una decisión se apoye en solo una señal, márcala como hipótesis en la Decisión UX.

## 3. Ética y sustentabilidad: diseño responsable y low data UX

**Qué dice la tendencia.** Soberanía de datos, consentimiento informado, transparencia y bienestar digital. Además, experiencias que consumen menos datos, ancho de banda y servidor.

**En Grovelab (APLICA).** Es la tendencia más alineada con el público: celulares y conexiones variables.

**Peso y recursos.**
- Imágenes con `next/image`, formatos modernos y `sizes` correctos. Ninguna imagen sube más grande de lo que se muestra.
- Video y 3D bajo demanda: no cargan hasta que el visitante los pide o llegan a la pantalla.
- Pocas fuentes: dos familias, variables, subconjunto latino.
- JavaScript mínimo en la primera carga; componentes de servidor por defecto.
- Mide: `next build` muestra el tamaño por ruta; Lighthouse y las métricas del plan (LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms). Fija un tope de peso por página en `docs/DISENO.md` después de medir la primera versión; no hay una cifra normativa universal.
- Las Web Sustainability Guidelines del W3C (93 pautas en cuatro categorías: diseño de experiencia, desarrollo web, hosting e infraestructura, y estrategia de negocio) dan el marco; sus temas centrales aquí son enviar menos datos y usar imágenes eficientes.

**Consentimiento y honestidad (criterio de diseño en el marco peruano).**
- El aviso de privacidad se muestra antes de pedir nombre, teléfono o ciudad en el flujo de pedido, con la finalidad explicada en lenguaje simple.
- Consentimiento previo, libre, expreso e inequívoco. Casillas sin marcar. Si hay un consentimiento de marketing, es aparte del consentimiento para atender el pedido.
- Rechazar o retirar el consentimiento debe ser tan fácil como darlo. La normativa vigente (Reglamento aprobado por D.S. 016-2024-JUS, en vigor desde el 31 de marzo de 2025) pide una vía simple y gratuita para negarse a usos de marketing y plazo de diez días para atender esas solicitudes.
- Sin patrones oscuros: nada de contadores falsos, "últimas unidades" inventadas ni botones engañosos.
- Validar con asesor legal: si corresponde registrar el banco de datos de pedidos, quién actúa como responsable y cómo se atienden los derechos de acceso y cancelación.

## 4. Sentient UX e hiperpersonalización dinámica

**Qué dice la tendencia.** Interfaces que infieren el estado de la persona (novato, experto, cansado, explorador) y cambian jerarquías, atajos y opciones. Advierte del valle inquietante cuando la interfaz parece demasiado humana.

**En Grovelab (ADAPTADA).** No hay cuentas de cliente ni perfil, así que la personalización es simple y local:

- Recordar en el navegador el cultivo elegido en la experiencia "Del suelo a la cosecha" para sugerirlo en el buscador.
- Mantener "Mi pedido" mientras la persona navega y entre visitas, si la política de privacidad lo informa.
- Menos opciones a la vista en móvil (filtros plegados) y más en escritorio.

**Límites.** No inferir emociones ni estados de ánimo, no perfilar, no enviar esas preferencias a un servidor sin consentimiento. Sin personajes ni asistentes que simulen ser personas. La personalización nunca debe esconder productos regulados ni condiciones de uso.

## 5. UX writing inclusivo

**Qué dice la tendencia.** La inclusión del lenguaje va más allá del género: considera neurodivergencias, distintos niveles de alfabetización digital y contextos diversos. Mensajes claros, cortos y accionables.

**En Grovelab (APLICA).** Es crítica por el público y por el tipo de contenido técnico.

- Una idea por frase, voz activa, verbos concretos. Evita el lenguaje corporativo y las siglas sin explicar.
- Explica los términos técnicos la primera vez, en la propia página (no solo con tooltip al pasar el cursor, que no existe en celular): ingrediente activo, formulación, registro SENASA, periodo de carencia.
- Unidades explícitas y consistentes en dosis y presentaciones. No inventes valores: lo que falta se muestra como "Consultar con un asesor", no como un número supuesto.
- Etiquetas de formulario siempre visibles (no solo texto de ayuda dentro del campo). Errores que dicen qué corregir y cómo.
- Botones que dicen qué pasa: "Enviar pedido por WhatsApp", "Agregar a mi pedido", no "Continuar".
- Tratamiento (tú o usted) y tono: POR CONFIRMAR con Grovelab; una vez decidido, se documenta en `docs/DISENO.md` y se mantiene en todo el sitio.
- Sin movimiento automático que distraiga ni bloques de texto largos: títulos, listas y tablas para escanear.

## 6. Liquid glass (vidrio translúcido)

**Qué dice la tendencia.** Transparencias, desenfoque y detalles de luz que ayudan a comunicar capas y profundidad. Bien usado ordena; mal usado es ruido visual.

**Riesgo documentado.** El análisis de Infinum sobre el liquid glass de iOS 26 reporta contrastes de hasta 1,5:1 en algunas zonas (el mínimo AA para texto es 4,5:1), texto que se pierde sobre fondos variables y dificultad para distinguir qué es interactivo. Sus recomendaciones: alternativas de alto contraste, no poner contenido crítico sobre fondos desenfocados y probar con los ajustes de accesibilidad activados.

**En Grovelab (LÍMITE).** Permitido solo en superficies pequeñas y decorativas (por ejemplo, una barra de filtros sobre una imagen).

Reglas:
1. El texto sobre vidrio debe cumplir 4,5:1 contra el **peor caso** del fondo que haya detrás, no contra el caso medio.
2. Fondo del vidrio con alta opacidad (por ejemplo 90 % o más) para que el contraste no dependa de la imagen de detrás.
3. Máximo una capa de vidrio por vista. Nada de vidrio a pantalla completa ni animado.
4. `backdrop-filter` es costoso en móviles modestos: radios de desenfoque bajos y superficies pequeñas.
5. Respaldo sólido con `prefers-contrast: more`. Revisa también `prefers-reduced-transparency`, cuyo soporte es limitado y debe verificarse al implementar.
6. Los colores salen de tokens. Si hace falta, propón tokens nuevos de vidrio en `tokens.css` y espera aprobación.

Patrón de referencia (CSS Module, sin SCSS):

```css
.panel-vidrio {
  background: color-mix(in srgb, var(--token-color-fondo) 92%, transparent);
  border: 1px solid color-mix(in srgb, var(--token-color-texto) 15%, transparent);
}

@supports (backdrop-filter: blur(1px)) {
  .panel-vidrio {
    backdrop-filter: blur(12px) saturate(1.1);
  }
}

@media (prefers-contrast: more) {
  .panel-vidrio {
    background: var(--token-color-fondo);
    backdrop-filter: none;
    border-color: var(--token-color-texto);
  }
}
```

## 7. 3D inmersivo

**Qué dice la tendencia.** El 3D deja de ser un recurso puntual y se vuelve un entorno; incluye VR y AR.

**En Grovelab (LÍMITE).** La realidad virtual y aumentada quedan fuera. Lo que sí encaja es el 3D como mejora progresiva dentro de "Del suelo a la cosecha", con este orden de preferencia:

1. Transformaciones 3D de CSS (`perspective`, `rotateX/Y`, capas con profundidad): bajo costo, sin JavaScript.
2. Animaciones atadas al scroll en CSS con respaldo (ver abajo).
3. Un visor 3D real (WebGL) solo si hay modelos aportados por Grovelab y el peso entra en el presupuesto. Se carga bajo demanda, nunca en la primera carga.

Reglas: el contenido y los productos están siempre en el HTML aunque falle el 3D; versión estática en móvil o con movimiento reducido; ninguna información esencial vive solo dentro del 3D; nada requiere arrastrar sin alternativa (WCAG 2.5.7).

**Animaciones atadas al scroll (CSS).** Las fuentes consultadas discrepan sobre en qué versiones de Firefox y Safari están disponibles. Verifica el soporte vigente en caniuse al implementar y úsalas siempre como mejora con respaldo:

```css
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .hero-capa {
      animation: sube linear both;
      animation-timeline: scroll(root);
      animation-range: 0 60vh;
    }
  }
}

@keyframes sube {
  from { transform: translateY(0); }
  to   { transform: translateY(-8vh); }
}
```

Sin soporte o con movimiento reducido, el elemento queda en su posición normal y no pasa nada más.

## 8. Spatial UI

**NO APLICA.** Depende de realidad extendida, posición y mirada. No hay caso de uso en un catálogo web con pedido por WhatsApp. No se diseña ni se estima.

## 9. Nostalgia noventera

**NO APLICA.** El artículo mismo la plantea como lenguaje de una generación y no como disfraz. La marca de Grovelab es técnica y agroindustrial; este estilo no la representa. Solo se reconsidera si el cliente lo pide con una razón de marca.

## 10. Megabrutalismo

**Qué dice la tendencia.** Textos y elementos gigantes, contrastes fuertes, juego de tipografías. Su reto es no sacrificar accesibilidad, sustentabilidad ni inclusión.

**En Grovelab (LÍMITE).** Coincide con el titular de gran formato de la portada. Se permite con estas condiciones:

- Titulares grandes con tipografía fluida (`clamp()`), pero el texto de lectura mantiene tamaño y espaciado cómodos.
- Contraste fuerte que cumpla AA, no solo "se ve intenso".
- Reflujo correcto a 320 px de ancho y con zoom de texto al 200 %: nada se corta ni exige scroll horizontal.
- Un solo gesto tipográfico dominante por pantalla; si todo grita, nada se lee.
- El peso de las fuentes grandes no justifica cargar más familias.

## 11. Phygital

**Qué dice la tendencia.** Experiencias continuas entre lo físico y lo digital.

**En Grovelab (ADAPTADA).** El puente real ya existe: el pedido nace en la web y se cierra por WhatsApp con un asesor. Refuérzalo:

- Mensaje de WhatsApp bien armado (productos, cantidades, zona), porque es la "interfaz" donde se completa la venta.
- Posible QR en material impreso o ficha que lleve a la ficha del producto o a la tabla de dosis. Es solo una idea: el contenido de etiquetas de plaguicidas está regulado, así que **valida con Grovelab y su responsable regulatorio** antes de proponerlo al cliente.

## 12. VUI (interfaces de voz)

**NO APLICA** como diseño. Pero el sitio debe ser compatible con la voz y los lectores de pantalla:

- El nombre accesible de cada control contiene el texto visible (WCAG 2.5.3, Label in Name), para que el control por voz funcione ("clic en Agregar a mi pedido").
- No bloquear el dictado en el campo de búsqueda del celular.
- Estructura semántica correcta (encabezados, listas, tablas con encabezados).

---

## Fuentes consultadas

- Artículo de tendencias UX/UI 2026 aportado por el equipo (base de las doce tendencias).
- W3C, [What's New in WCAG 2.2](https://w3.org/WAI/standards-guidelines/wcag/new-in-22/): nueve criterios nuevos; 2.4.11 Focus Not Obscured (Minimum), 2.5.7 Dragging Movements y 2.5.8 Target Size (Minimum) son AA; 2.4.13 Focus Appearance es AAA; 4.1.1 Parsing fue retirado.
- W3C, [Introducing Web Sustainability Guidelines](https://www.w3.org/blog/2023/introducing-web-sustainability-guidelines): 93 pautas, 232 criterios, cuatro categorías.
- Infinum, [Liquid Glass: sleek, shiny and questionably accessible](https://infinum.com/blog/apples-ios-26-liquid-glass-sleek-shiny-and-questionably-accessible/).
- DEV Community, [CSS scroll-driven animations](https://dev.to/chengyixu/css-scroll-driven-animations-the-end-of-javascript-scroll-listeners-4bij): sintaxis y uso de `@supports`. Su tabla de soporte por navegador no pudo confirmarse; verificar en caniuse.
- La Cámara, [Nuevo reglamento refuerza la protección de datos personales](https://lacamara.pe/nuevo-reglamento-refuerza-la-proteccion-de-datos-personales/) y El Peruano, [Minjusdh: el lunes 31 regirá nuevo reglamento de ley](https://www.elperuano.pe/noticia/266995-minjusdh-el-lunes-31-regira-nuevo-reglamento-de-ley): D.S. 016-2024-JUS, vigencia, consentimiento, marketing y notificación de incidentes.

## Pendiente de verificar al implementar

- Soporte actual de animaciones atadas al scroll y de `prefers-reduced-transparency` en los navegadores que usa el público.
- Tope de peso por página (se fija tras medir).
- Aspectos legales de datos personales con asesor.

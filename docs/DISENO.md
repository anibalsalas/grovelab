# Dirección de diseño — Grovelab (borrador)

> Borrador para aprobar con el cliente. Los valores marcados PROVISIONAL se confirman midiendo el logo y los materiales de marca actuales.

## Idea rectora
"Del suelo a la cosecha": la web cuenta que Grovelab formula productos específicos por cultivo. Se siente técnica, cercana y moderna; no un catálogo de distribuidor.

## Principio de coherencia
Un solo lenguaje visual en todo el sitio: mismos tokens, mismos componentes, mismo ritmo de movimiento. Máximo **un momento "wow" por página**.

## Estrategia de estilos
Se permiten **ambos para todo**, con un único juego de tokens:
- **Tailwind:** ideal cuando el resultado cabe en pocas utilidades legibles (layout, responsive, estados, transformaciones y degradados sencillos, e incluso efectos 3D o por scroll con valores arbitrarios).
- **SCSS / CSS Modules:** ideal cuando hay `@keyframes` propios, muchas capas, selectores, cálculos o lógica repetida (mixins), o cuando las clases se vuelven ilegibles.
- **Un enfoque por efecto dentro de un mismo componente.**
- **Tokens como variables CSS** en un solo archivo; ambos los consumen, así el diseño no se desincroniza.

## Tokens (PROVISIONAL)
- Colores: verde de marca (medir del logo), gris oscuro de texto (medir del logo), acento naranja/tierra (opcional), fondo claro cálido, y estados (éxito, error, aviso) con contraste AA.
- Tipografía: una familia para titulares y otra para texto (a elegir; cargar con `next/font`, sin bloqueo).
- Escala de espacios en múltiplos de 4 u 8 px. Radios y sombras definidos en 2–3 niveles.
- Todo vive como variables CSS/SCSS en un único archivo de tokens.

## Catálogo de efectos
| Efecto | Dónde | Técnica | Costo | Respaldo |
|---|---|---|---|---|
| Parallax de capas (hoja, campo) | Portada | CSS `transform` + scroll-driven animations | Bajo | Imagen fija |
| Planta que crece al desplazarse | Experiencia "Del suelo a la cosecha" | SVG + CSS, sin video | Medio | Ilustración estática por etapas |
| Inclinación 3D suave en tarjetas | Tarjetas de producto y cultivo | CSS `perspective` y `transform` | Bajo | Sin inclinación |
| Aparición al desplazarse | Secciones | `opacity` + `transform` con IntersectionObserver | Bajo | Visible sin animar |
| Visor 3D del envase | Ficha de producto, solo al pulsar "Ver en 3D" | Opcional; requiere modelos 3D de los envases y carga diferida | Alto | Galería de fotos |

El visor 3D solo se hace si Grovelab entrega fotos o modelos suficientes; si no, queda fuera.

## Componentes base (en orden)
Botón, enlace, tarjeta de producto, tarjeta de cultivo, cabecera con menú, pie con contacto, buscador, tabla de dosis, botón y lista "Mi pedido", formulario del pedido, tarjeta de noticia.

## Reglas de contenido
- Nada de datos inventados: productos, cifras, certificaciones y teléfonos salen de Grovelab.
- Imágenes reales de producto y campo; si no hay, marcador claro `POR CONFIRMAR`.

## Criterios de aceptación visual
Revisión en celular (360 px) y escritorio (1440 px); contraste AA; foco visible; con `prefers-reduced-motion` todo se ve completo y estático; LCP ≤ 2,5 s en celular de gama media.

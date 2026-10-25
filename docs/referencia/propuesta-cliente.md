# Propuesta de rediseño web Grovelab

Oct 13, 2026 · @anival

La web actual de Grovelab explica bien su negocio, pero su tecnología y su diseño están atrasados; proponemos reconstruirla con Next.js para que sea más rápida, fácil de administrar y capaz de mostrar su diferencial: formulaciones específicas por cultivo.

## Diagnóstico de la web actual

La web comunica bien qué hace Grovelab, pero varios puntos de diseño, contenido y confianza limitan su imagen y su capacidad de generar contactos.

**Lo que sí funciona:** la propuesta de valor es clara (importación, formulación y asistencia técnica), muestra el respaldo de registro SENASA, organiza los productos en ocho categorías y ofrece ficha técnica por producto y testimonios en video.

| Área | Hallazgo | Efecto en el negocio |
| --- | --- | --- |
| Tecnología | WordPress con Slider Revolution 6.6.5 y funciones de tienda (carrito, reseñas) sin precios publicados | Plugins que suelen ralentizar la carga y una tienda que no se usa |
| Contenido | Copyright 2019, blog de 2020 e imágenes de producto de 2022 en 300×300 | Imagen de empresa poco actual |
| Idioma | Mezcla de español e inglés: "Products", "Customer Reviews", "Shopping Cart" | Pierde profesionalismo y posicionamiento |
| Catálogo | Unas 6 páginas de productos; sin búsqueda por cultivo ni por plaga | El agricultor tarda en encontrar lo que necesita |
| Nosotros | Texto técnico extenso, cuatro videos incrustados, galería de 2019, sin cifras ni certificaciones | No transmite respaldo ni escala |
| Contacto | En las páginas revisadas el pie no muestra teléfono, dirección ni correo; solo Facebook y YouTube | Menos oportunidades de recibir consultas |
| Servicios | Solo dos servicios, con poco desarrollo | Se subestima la asesoría técnica y la marca propia |
| SEO | Título de la página de productos en inglés; no se detectó meta descripción | Menor visibilidad en buscadores |

## Referencia y objetivo

Tomamos de tqc.com.pe su forma de organizar la información y la llevamos más lejos en diseño, velocidad y en la historia propia de Grovelab.

| Qué hace bien la referencia | Qué haremos en Grovelab |
| --- | --- |
| Navegación por cultivos: tarjetas que llevan a cada cultivo y de ahí a sus productos | Misma lógica, con cultivos propios y un buscador por cultivo, plaga y categoría |
| Ficha de producto con registro SENASA, ingrediente activo, formulación, ficha técnica y hoja de seguridad descargables | Ficha equivalente, con dosis recomendadas por cultivo y productos relacionados |
| Formulario "Solicitar información" y botón "Contactar a un Asesor" | Formulario de cotización, botón de WhatsApp y chat en línea en cada ficha |
| Cifras, logos de marcas, noticias y pie con datos de contacto y certificaciones | Cifras reales de Grovelab, casos en campo y un pie completo con contacto y respaldo |
| Diseño ordenado y corporativo | Diseño moderno con tipografía de gran formato, movimiento suave y una experiencia interactiva propia |

La diferencia de fondo: Grovelab formula y fabrica, y ofrece marca propia y asesoría técnica. La nueva web debe contar eso, no parecer un catálogo de distribuidor.

Usamos la referencia como guía de organización; el diseño, los textos y las imágenes serán originales de Grovelab.

## Cómo quedaría la nueva web

La nueva web se organiza por cultivos y productos, y muestra el diferencial de Grovelab desde el primer desplazamiento.

**Mapa del sitio**

- Inicio
- Productos: ocho categorías (plaguicidas con insecticidas, fungicidas y herbicidas; reguladores de crecimiento; bioestimulantes; nutricionales; fitoprotectores; adyuvantes; sólidos; acondicionadores de suelo) y una ficha por producto
- Cultivos: una página por cultivo con los productos recomendados
- Nosotros
- Servicios: importación directa, asesoría y logística en importaciones, registro y marca propia
- Blog y noticias
- Zonas comerciales
- Contacto

**El inicio, de arriba hacia abajo**

1. Portada con titular de gran formato, por ejemplo "Productos para el agro, formulados para cada cultivo", y un botón de cotización.
2. Experiencia interactiva "Del suelo a la cosecha" (se detalla abajo).
3. Buscador de productos por cultivo, plaga o categoría.
4. Cultivos destacados, en tarjetas con imagen.
5. Productos destacados.
6. Respaldo: registro SENASA, certificaciones y cifras reales de la empresa (a definir con Grovelab).
7. Servicios y marca propia.
8. Testimonios en video de campo, que cargan solo cuando el visitante los reproduce.
9. Noticias y blog.
10. Zonas comerciales y llamado final a contactar.

El pie incluirá teléfono, dirección, correo, redes sociales y WhatsApp. La paleta y la tipografía se definen a partir de la marca actual de Grovelab.

## Experiencia estrella: del suelo a la cosecha

Una planta ilustrada crece mientras el visitante se desplaza y explica, en unos 30 segundos, cómo Grovelab nutre y protege cada etapa del cultivo.

1. **Raíz y suelo:** la cámara entra al suelo y muestra la nutrición con nutrientes quelatizados y fuentes orgánicas naturales.
2. **Crecimiento:** al subir el tallo y las hojas, se activan los grupos de producto (bioestimulantes, nutricionales, fitoprotectores).
3. **Selector de cultivo:** el visitante elige un cultivo (por ejemplo vid, palto, arándano o mango, a confirmar con Grovelab) y la planta cambia y sugiere los productos recomendados.
4. **Cosecha:** el fruto maduro cierra con el botón "Solicitar asesoría para tu cultivo".

Por qué funciona: cuenta el diferencial de Grovelab (formulaciones específicas por cultivo y suelo) de forma visual y memorable, algo que una web de catálogo no muestra.

Cómo cuidamos el rendimiento: se dibuja con gráficos vectoriales y animación CSS, sin video ni 3D pesado. En celulares se simplifica, quien prefiera menos movimiento ve una versión estática, y los productos y textos siempre están en la página para los buscadores.

## Panel administrable, WhatsApp y chat en línea

El equipo de Grovelab podrá actualizar la web sin depender de un programador, y los clientes podrán contactarlos por WhatsApp o chat desde cualquier página.

**Panel administrable**

- Productos: nombre, categoría, cultivos, plagas, ingrediente activo, registro SENASA, imágenes y fichas técnicas en PDF.
- Cultivos, noticias y blog, zonas comerciales, banners y textos del sitio.
- Consultas recibidas por los formularios, con aviso por correo.
- Usuarios con permisos distintos, por ejemplo uno que solo publica noticias.
- Carga inicial de los productos actuales (alrededor de 70, a confirmar) para no empezar de cero.

**WhatsApp**

- Botón flotante en todas las páginas.
- En cada ficha de producto, un botón que abre WhatsApp con el mensaje ya escrito ("Hola, quiero información sobre \[producto\]").

**Chat en línea**

- Ventana de chat atendida por el equipo de Grovelab, con un servicio externo que ofrece plan gratuito para empezar.
- Opcional y como alcance adicional: respuestas automáticas por la API oficial de WhatsApp, que tiene costo mensual de terceros.

**Formularios de cotización** con aceptación de la política de datos personales y registro de cada consulta en el panel.

## Por qué Next.js y no continuar con WordPress

Proponemos construir la web desde cero con Next.js porque la web actual tendría que rehacerse casi por completo para alcanzar el nivel buscado, y Next.js permite una web más rápida, segura y con diseño a medida.

| Aspecto | Web actual (WordPress con plugins) | Web nueva (Next.js con panel administrable) |
| --- | --- | --- |
| Velocidad | Depende del tema y de cada plugin; las páginas se arman al ser pedidas | Páginas generadas con anticipación, servidas desde una red global e imágenes optimizadas automáticamente |
| Seguridad y mantenimiento | WordPress y cada plugin necesitan actualizaciones frecuentes y son objetivo habitual de ataques | Menos piezas de terceros, por tanto menos puntos débiles y menos actualizaciones |
| Diseño | Limitado por el tema y los plugins | Libertad total, necesaria para la experiencia "Del suelo a la cosecha" |
| Posicionamiento en buscadores | Depende de plugins de SEO | Control directo de títulos, descripciones, datos estructurados y direcciones |
| Panel de administración | Conocido, pero con muchos menús que no se usan | Limpio, solo con lo que Grovelab edita |
| Nuevas funciones | Cada función suele sumar otro plugin | Se programa solo lo necesario |

**Lo que debemos aclarar con transparencia**

- WordPress bien construido también puede ser rápido. Elegimos Next.js porque el objetivo incluye una experiencia a medida y alto rendimiento, y porque la web actual, con archivos desde 2019, requeriría rehacerse de todos modos.
- El contenido (productos, noticias, textos) lo edita Grovelab desde el panel. Los cambios de diseño o de estructura sí requieren un desarrollador.
- Para no perder posicionamiento, mantendremos las direcciones actuales de los productos o las redirigiremos a las nuevas.
- La web nueva se publica en un hosting para Next.js con un costo mensual bajo, que detallaremos en la propuesta; el dominio actual se conserva.

## Siguientes pasos

El siguiente paso es una llamada de 20 minutos para confirmar el alcance y poder enviar una propuesta con plazos e inversión exactos.

1. Llamada de alcance con Grovelab.
2. Propuesta con alcance, plazos e inversión.
3. Diseño del inicio y de la experiencia interactiva, para su aprobación.
4. Desarrollo, carga de productos y pruebas.
5. Publicación y capacitación en el uso del panel.

**Lo que necesitamos de Grovelab**

- [ ] Cantidad de productos y secciones a mantener.
- [ ] Si habrá venta en línea o solo cotización y WhatsApp.
- [ ] Quién actualizará el contenido y con qué frecuencia.
- [ ] Fotos, videos, logo y textos actualizados, o si hay que producirlos.
- [ ] Cultivos principales a destacar.
- [ ] Fecha límite o evento al que quieran llegar con la web lista.

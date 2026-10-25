# Alcance — Web Grovelab (borrador)

Estado: borrador para validar con el cliente.

## Objetivo
Web moderna, rápida y administrable que muestre el catálogo de Grovelab y permita enviar pedidos por WhatsApp.

## Incluye
- Inicio, Productos (categorías y fichas), Cultivos, Nosotros, Servicios, Blog/Noticias, Zonas comerciales, Contacto.
- Buscador de productos por cultivo, plaga o categoría.
- **Pedido por WhatsApp** (ver flujo).
- Panel administrable: productos, cultivos, noticias, zonas, banners, textos, pedidos recibidos y usuarios con permisos.
- Carga inicial de los productos actuales (≈70, por confirmar).
- SEO: títulos, descripciones y redirecciones de las URL actuales.
- Experiencia interactiva "Del suelo a la cosecha" (última fase).

## No incluye (por ahora)
Pagos en línea, checkout, cuentas de cliente, boletas/facturas desde la web.

## Flujo del pedido
1. Ficha del producto → elegir presentación y cantidad.
2. "Agregar a mi pedido" → lista "Mi pedido".
3. Datos mínimos: nombre, teléfono, ciudad/zona; opcional: cultivo y hectáreas.
4. Se guarda el pedido en el panel.
5. Se abre WhatsApp con el mensaje redactado.
Idea por confirmar: dirigir el pedido al WhatsApp del asesor de la zona elegida.

## Modelo de datos (borrador)
Producto, Presentación, Categoría, Cultivo, Plaga, ZonaComercial (con asesor y WhatsApp), Pedido, ItemPedido, Noticia, Usuario del panel.

## Fases
1. Base: proyecto, reglas, despliegue de prueba, panel con login.
2. Catálogo: categorías, cultivos, fichas, tabla de dosis, buscador.
3. Pedido por WhatsApp con registro en el panel.
4. SEO, redirecciones y migración de productos.
5. Experiencia "Del suelo a la cosecha".

## Pendientes con Grovelab
- Lista final de productos, imágenes, fichas y registros SENASA.
- Número(s) de WhatsApp y si habrá asesor por zona.
- Si pueden publicar o no precios.
- Condiciones para publicar y recibir pedidos de productos regulados (SENASA).
- Quién actualizará el contenido y con qué frecuencia.
- Texto de política de privacidad.

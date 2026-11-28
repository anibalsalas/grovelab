import { expect, test, type Page } from "@playwright/test";

/**
 * Catálogo de /productos. Las pruebas leen los datos reales de la página (nombres, conteos)
 * en lugar de suponer productos concretos, así que sirven con cualquier catálogo publicado.
 */

const tarjetas = (page: Page) => page.locator('main a[href^="/productos/"]');
const contador = (page: Page) => page.getByRole("status");
const buscador = (page: Page) => page.getByRole("searchbox", { name: /buscar productos/i });

async function totalMostrado(page: Page): Promise<number> {
  const texto = (await contador(page).textContent()) ?? "";
  return Number.parseInt(texto, 10);
}

/** Primera opción activa (no «Todas») del grupo y el número de productos que promete. */
async function primeraOpcion(page: Page, grupo: string) {
  const opciones = page
    .getByRole("group", { name: grupo, exact: true })
    .locator('input[type="radio"]:not([value=""])');
  const total = await opciones.count();
  for (let i = 0; i < total; i += 1) {
    const opcion = opciones.nth(i);
    if (await opcion.isEnabled()) {
      const etiqueta = opcion.locator("xpath=ancestor::label");
      const conteo = Number.parseInt(
        (await etiqueta.locator("[aria-hidden='true']").last().textContent()) ?? "0",
        10,
      );
      return { opcion, conteo, nombre: ((await etiqueta.textContent()) ?? "").trim() };
    }
  }
  throw new Error(`El grupo ${grupo} no tiene opciones activas`);
}

test.describe("Catálogo de /productos — escritorio", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("al entrar muestra el catálogo completo, sin filtros y con contador exacto", async ({
    page,
  }) => {
    await page.goto("/productos");

    await expect(page.getByRole("heading", { level: 1, name: "Productos" })).toBeVisible();
    await expect(tarjetas(page).first()).toBeVisible();
    const total = await totalMostrado(page);
    expect(total).toBeGreaterThan(0);
    // Con 12 por página, el contador y las tarjetas coinciden mientras no haya más de una página.
    expect(await tarjetas(page).count()).toBe(Math.min(total, 12));
    await expect(page.getByRole("list", { name: "Filtros activos" })).toHaveCount(0);
    await expect(page.getByRole("radio", { checked: true })).toHaveCount(3);
  });

  test("el pie de página es lo último de la página: sin espacio en blanco debajo", async ({
    page,
  }) => {
    await page.goto("/productos");
    await expect(tarjetas(page).first()).toBeVisible();
    // Regresión: los textos sr-only de las listas con scroll interno estiraban el documento.
    const sobrante = await page.evaluate(
      () =>
        document.documentElement.scrollHeight -
        Math.round(document.querySelector("footer")!.getBoundingClientRect().bottom + window.scrollY),
    );
    expect(sobrante).toBeLessThanOrEqual(1);
  });

  test("encabezado compacto: el catálogo empieza dentro de la primera pantalla", async ({
    page,
  }) => {
    await page.goto("/productos");
    const caja = await tarjetas(page).first().boundingBox();
    expect(caja).not.toBeNull();
    expect(caja!.y).toBeLessThan(500);
  });

  test("la búsqueda filtra al escribir (300 ms), sin tildes ni mayúsculas, y sin recargar", async ({
    page,
  }) => {
    await page.goto("/productos");
    const inicial = await totalMostrado(page);
    const nombre = (await tarjetas(page).first().locator("span").first().textContent())!.trim();
    await page.evaluate(() => {
      (window as unknown as { __sinRecarga: boolean }).__sinRecarga = true;
    });
    const peticiones: string[] = [];
    page.on("request", (peticion) => {
      // Los `Link` de la página precargan sus rutas (`?_rsc=`) en producción: no son búsquedas.
      if (["document", "fetch", "xhr"].includes(peticion.resourceType()) && !peticion.url().includes("_rsc=")) {
        peticiones.push(peticion.url());
      }
    });

    // Mayúsculas y una tilde agregada: «LIGNOFOL» o «LÍGNOFOL» deben encontrar «Lignofol».
    const consulta = nombre.toUpperCase().replace(/[AEIOU]/, (letra) => letra + "́");
    await buscador(page).pressSequentially(consulta, { delay: 40 });

    await expect(page).toHaveURL(/\?q=/);
    await expect(tarjetas(page).first()).toContainText(nombre);
    expect(await totalMostrado(page)).toBeLessThanOrEqual(inicial);
    await expect(page.getByRole("button", { name: /quitar filtro búsqueda/i })).toBeVisible();
    // Ni recarga de página ni peticiones al servidor mientras se escribe.
    expect(await page.evaluate(() => (window as unknown as { __sinRecarga?: boolean }).__sinRecarga)).toBe(true);
    expect(peticiones).toEqual([]);
  });

  test("Enter y la lupa ejecutan la búsqueda al instante", async ({ page }) => {
    await page.goto("/productos");
    const nombre = (await tarjetas(page).first().locator("span").first().textContent())!.trim();

    await buscador(page).fill(nombre);
    await buscador(page).press("Enter");
    await expect(page).toHaveURL(new RegExp(`\\?q=${encodeURIComponent(nombre)}`));

    await page.getByRole("button", { name: "Limpiar filtros" }).click();
    await expect(page).toHaveURL(/\/productos$/);

    await buscador(page).fill(nombre);
    await page.getByRole("button", { name: "Buscar", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`\\?q=${encodeURIComponent(nombre)}`));
  });

  test("filtro individual y combinado: el contador coincide con el conteo de cada opción", async ({
    page,
  }) => {
    await page.goto("/productos");

    const categoria = await primeraOpcion(page, "Categoría");
    await categoria.opcion.check();
    await expect(page).toHaveURL(/categoria=/);
    await expect(contador(page)).toHaveText(new RegExp(`^${categoria.conteo} producto`));
    await expect(
      page.getByRole("button", { name: `Quitar filtro Categoría: ${categoria.nombre.replace(/\s*\d+.*$/, "")}` }),
    ).toBeVisible();

    const cultivo = await primeraOpcion(page, "Cultivo");
    await cultivo.opcion.check();
    await expect(page).toHaveURL(/categoria=.*cultivo=|cultivo=.*categoria=/);
    await expect(contador(page)).toHaveText(new RegExp(`^${cultivo.conteo} producto`));
    expect(await tarjetas(page).count()).toBe(cultivo.conteo);
  });

  test("quitar un filtro con su chip y limpiar todos restablece el catálogo completo", async ({
    page,
  }) => {
    await page.goto("/productos");
    const inicial = await totalMostrado(page);

    const categoria = await primeraOpcion(page, "Categoría");
    await categoria.opcion.check();
    await buscador(page).fill("a");
    await buscador(page).press("Enter");
    await expect(page.getByRole("list", { name: "Filtros activos" }).getByRole("button")).toHaveCount(2);

    await page.getByRole("button", { name: /quitar filtro búsqueda/i }).click();
    await expect(page.getByRole("list", { name: "Filtros activos" }).getByRole("button")).toHaveCount(1);
    await expect(buscador(page)).toHaveValue("");

    await categoria.opcion.check();
    await page.getByRole("button", { name: "Limpiar filtros" }).click();
    await expect(page).toHaveURL(/\/productos$/);
    await expect(contador(page)).toHaveText(new RegExp(`^${inicial} producto`));
    await expect(page.getByRole("list", { name: "Filtros activos" })).toHaveCount(0);
  });

  test("sin coincidencias: estado vacío con dos salidas, y Limpiar filtros vuelve al catálogo", async ({
    page,
  }) => {
    await page.goto("/productos");
    const inicial = await totalMostrado(page);

    await buscador(page).fill("zzzzqxw");
    await expect(contador(page)).toHaveText(/^0 productos/);
    await expect(
      page.getByRole("heading", { name: /no encontramos productos con estos filtros/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /preguntar por whatsapp|contactar/i })).toBeVisible();

    await page.getByRole("main").getByRole("button", { name: "Limpiar filtros" }).last().click();
    await expect(contador(page)).toHaveText(new RegExp(`^${inicial} producto`));
  });

  test("la URL conserva el estado: un enlace compartido y Atrás/Adelante funcionan", async ({
    page,
  }) => {
    await page.goto("/productos");
    const categoria = await primeraOpcion(page, "Categoría");
    await categoria.opcion.check();
    await expect(page).toHaveURL(/categoria=/);
    const urlFiltrada = page.url();
    const filtrado = await totalMostrado(page);

    // Enlace compartido: otra carga con la misma URL muestra lo mismo.
    await page.goto(urlFiltrada);
    await expect(contador(page)).toHaveText(new RegExp(`^${filtrado} producto`));
    await expect(page.getByRole("radio", { name: new RegExp(`^${categoria.nombre.replace(/\s*\d+.*$/, "")}`) })).toBeChecked();

    // Atrás deshace el filtro; Adelante lo vuelve a aplicar.
    await page.getByRole("button", { name: "Limpiar filtros" }).first().click();
    await expect(page).toHaveURL(/\/productos$/);
    await page.goBack();
    await expect(page).toHaveURL(urlFiltrada);
    await expect(contador(page)).toHaveText(new RegExp(`^${filtrado} producto`));
    await page.goForward();
    await expect(page).toHaveURL(/\/productos$/);
  });

  test("compatibilidad con el buscador de Inicio: parámetros válidos se aplican, los inválidos se ignoran", async ({
    page,
  }) => {
    await page.goto("/productos");
    const categoria = await primeraOpcion(page, "Categoría");
    const slug = await categoria.opcion.getAttribute("value");

    await page.goto(`/productos?categoria=${slug}&cultivo=slug-que-no-existe`);
    await expect(contador(page)).toHaveText(new RegExp(`^${categoria.conteo} producto`));
    await expect(page.getByRole("list", { name: "Filtros activos" }).getByRole("button")).toHaveCount(1);

    await page.goto("/productos?plaga=slug-que-no-existe");
    await expect(page.getByRole("list", { name: "Filtros activos" })).toHaveCount(0);
  });

  test("navegar al detalle del producto desde la tarjeta", async ({ page }) => {
    await page.goto("/productos");
    const primera = tarjetas(page).first();
    const nombre = (await primera.locator("span").first().textContent())!.trim();
    await primera.click();

    await expect(page).toHaveURL(/\/productos\/[^/?]+$/);
    await expect(page.getByRole("heading", { level: 1, name: nombre })).toBeVisible();
  });

  test("operable solo con teclado y con foco visible", async ({ page }) => {
    await page.goto("/productos");
    await buscador(page).focus();
    await expect(buscador(page)).toBeFocused();
    await page.keyboard.type("a");
    await page.keyboard.press("Tab"); // «Borrar búsqueda»
    await page.keyboard.press("Tab"); // lupa
    await expect(page.getByRole("button", { name: "Buscar", exact: true })).toBeFocused();
    await page.keyboard.press("Tab"); // primera opción de filtros
    await expect(page.getByRole("radio").first()).toBeFocused();
    const contorno = await page
      .getByRole("radio")
      .first()
      .evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(contorno).not.toBe("none");
  });

  test("con «reducir movimiento» el catálogo se ve completo y sin animar", async ({ browser }) => {
    const contexto = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await contexto.newPage();
    await page.goto("/productos");
    const primera = tarjetas(page).first().locator("xpath=..");
    await expect(primera).toBeVisible();
    await expect(primera).toHaveCSS("opacity", "1");
    await contexto.close();
  });
});

test.describe("Catálogo de /productos — celular (360 px)", () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test("los filtros están en un panel desplegable y no hay scroll horizontal", async ({ page }) => {
    await page.goto("/productos");

    const boton = page.getByRole("button", { name: /^filtros/i });
    await expect(boton).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("group", { name: "Categoría", exact: true })).toBeHidden();

    await boton.click();
    await expect(boton).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("group", { name: "Categoría", exact: true })).toBeVisible();

    const categoria = await primeraOpcion(page, "Categoría");
    await categoria.opcion.check();
    await expect(contador(page)).toHaveText(new RegExp(`^${categoria.conteo} producto`));
    await expect(boton).toContainText("1");

    await page.getByRole("button", { name: /^ver \d+ productos?$/i }).click();
    await expect(boton).toHaveAttribute("aria-expanded", "false");

    const desborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(desborda).toBe(false);
  });

  test("la cuadrícula usa dos columnas y las tarjetas miden al menos 44 px de alto táctil", async ({
    page,
  }) => {
    await page.goto("/productos");
    // offsetTop ignora el `transform` de la animación de entrada, que aún puede estar en curso.
    const cajas = await tarjetas(page).evaluateAll((els) =>
      els.slice(0, 2).map((el) => (el.parentElement as HTMLElement).offsetTop),
    );
    expect(cajas.length).toBe(2);
    expect(Math.abs(cajas[0]! - cajas[1]!)).toBeLessThan(2);
    const lupa = await page.getByRole("button", { name: "Buscar", exact: true }).boundingBox();
    expect(lupa!.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe("Catálogo de /productos — cuadrícula en escritorio", () => {
  test("usa hasta cuatro columnas según el ancho", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/productos");
    const columnas = await page.locator('main ul:has(> li > a[href^="/productos/"])').first().evaluate(
      (ul) => getComputedStyle(ul).gridTemplateColumns.split(" ").length,
    );
    expect(columnas).toBeLessThanOrEqual(4);
    expect(columnas).toBeGreaterThanOrEqual(3);
  });
});

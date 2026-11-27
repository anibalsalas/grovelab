import { expect, test, type Page } from "@playwright/test";

/** Abre la primera ficha de producto publicada. */
async function abrirPrimeraFicha(page: Page) {
  await page.goto("/productos");
  const enlace = page.locator('a[href^="/productos/"]').first();
  await expect(enlace).toBeVisible();
  await enlace.click();
  await expect(
    page.getByRole("heading", { name: "Agregar a mi pedido" }),
  ).toBeVisible();
}

test.describe("Mi pedido: ficha y cabecera", () => {
  test("agregar un producto muestra la confirmación y el contador, y sobrevive a recargar", async ({
    page,
  }) => {
    await abrirPrimeraFicha(page);

    // Sin productos, el contador de la cabecera no aparece.
    await expect(page.getByRole("link", { name: /^Mi pedido,/ })).toHaveCount(0);

    const radios = page.getByRole("radio");
    await radios.first().check();
    await page.getByRole("button", { name: "Aumentar cantidad" }).click();
    await page.getByRole("button", { name: "Agregar a mi pedido" }).click();

    await expect(page.getByRole("status")).toContainText(/Agregaste .* × 2\./);
    await expect(
      page.getByRole("link", { name: "Mi pedido, 1 producto" }),
    ).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("link", { name: "Mi pedido, 1 producto" }),
    ).toBeVisible();
  });

  test("la misma combinación suma cantidad y no duplica el producto", async ({
    page,
  }) => {
    await abrirPrimeraFicha(page);
    await page.getByRole("radio").first().check();

    const agregar = page.getByRole("button", { name: "Agregar a mi pedido" });
    await agregar.click();
    await agregar.click();

    await expect(
      page.getByRole("link", { name: "Mi pedido, 1 producto" }),
    ).toBeVisible();
    const guardado = await page.evaluate(() =>
      window.localStorage.getItem("grovelab.pedido.v1"),
    );
    const filas = (JSON.parse(guardado ?? "{}") as { filas: { cantidad: number }[] })
      .filas;
    expect(filas).toHaveLength(1);
    expect(filas[0]?.cantidad).toBe(2);
  });

  test("sin elegir presentación (si hay varias) pide elegir y no agrega", async ({
    page,
  }) => {
    await abrirPrimeraFicha(page);
    const radios = page.getByRole("radio");
    test.skip(
      (await radios.count()) < 2,
      "El primer producto tiene una sola presentación y viene marcada.",
    );

    await page.getByRole("button", { name: "Agregar a mi pedido" }).click();
    // Se acota al formulario: Next.js tiene su propio role="alert" para anunciar rutas.
    await expect(page.locator("form").getByRole("alert")).toHaveText(
      "Elige una presentación.",
    );
    await expect(page.getByRole("link", { name: /^Mi pedido,/ })).toHaveCount(0);
  });

  test("una cantidad fuera de rango se rechaza con un mensaje", async ({ page }) => {
    await abrirPrimeraFicha(page);
    await page.getByRole("radio").first().check();
    await page.getByRole("textbox", { name: "Cantidad" }).fill("");
    await page.getByRole("button", { name: "Agregar a mi pedido" }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "cantidad entre 1 y 9999",
    );
  });

  test("un pedido guardado con formato roto se ignora sin errores", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("grovelab.pedido.v1", "{no es json");
    });
    await page.goto("/productos");
    await expect(page.getByRole("link", { name: /^Mi pedido,/ })).toHaveCount(0);
  });
});

/** Agrega el primer producto con su primera presentación y abre /pedido desde el enlace de confirmación. */
async function agregarYRevisar(page: Page) {
  await abrirPrimeraFicha(page);
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Agregar a mi pedido" }).click();
  await page.getByRole("link", { name: /^Revisar mi pedido/ }).click();
  await expect(page).toHaveURL(/\/pedido$/);
  await expect(page.getByRole("list", { name: "Productos de mi pedido" })).toBeVisible();
}

test.describe("/pedido: lista editable", () => {
  test("sin productos muestra el estado vacío con salida a Productos", async ({
    page,
  }) => {
    await page.goto("/pedido");
    await expect(
      page.getByRole("heading", { name: "Tu pedido está vacío" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Ver productos" })).toBeVisible();
  });

  test("un producto que ya no existe se quita con un aviso", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "grovelab.pedido.v1",
        JSON.stringify({
          version: 1,
          filas: [{ slug: "producto-que-no-existe-e2e", presentacion: "1 L", cantidad: 1 }],
        }),
      );
    });
    await page.goto("/pedido");
    await expect(page.getByRole("status")).toContainText("ya no está disponible");
    await expect(
      page.getByRole("heading", { name: "Tu pedido está vacío" }),
    ).toBeVisible();
  });

  test("cambia la cantidad con los botones y escribiendo, y se guarda", async ({
    page,
  }) => {
    await agregarYRevisar(page);

    await page.getByRole("button", { name: /^Aumentar cantidad de/ }).click();
    const campo = page.getByRole("textbox", { name: /^Cantidad de/ });
    await expect(campo).toHaveValue("2");

    await campo.fill("5");
    await campo.press("Enter");
    await expect(campo).toHaveValue("5");

    const cantidad = await page.evaluate(
      () =>
        (
          JSON.parse(window.localStorage.getItem("grovelab.pedido.v1") ?? "{}") as {
            filas: { cantidad: number }[];
          }
        ).filas[0]?.cantidad,
    );
    expect(cantidad).toBe(5);
  });

  test("un valor inválido al escribir vuelve a la cantidad anterior", async ({
    page,
  }) => {
    await agregarYRevisar(page);
    const campo = page.getByRole("textbox", { name: /^Cantidad de/ });
    await campo.fill("0");
    await campo.press("Enter");
    await expect(campo).toHaveValue("1");
  });

  test("quitar un producto deja el pedido vacío", async ({ page }) => {
    await agregarYRevisar(page);
    await page.getByRole("button", { name: /^Quitar .* del pedido$/ }).click();
    await expect(
      page.getByRole("heading", { name: "Tu pedido está vacío" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /^Mi pedido,/ })).toHaveCount(0);
  });

  test("vaciar pide confirmación y se puede cancelar", async ({ page }) => {
    await agregarYRevisar(page);

    await page.getByRole("button", { name: "Vaciar pedido" }).click();
    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByRole("list", { name: "Productos de mi pedido" })).toBeVisible();

    await page.getByRole("button", { name: "Vaciar pedido" }).click();
    await page.getByRole("button", { name: "Sí, vaciar" }).click();
    await expect(
      page.getByRole("heading", { name: "Tu pedido está vacío" }),
    ).toBeVisible();
  });
});

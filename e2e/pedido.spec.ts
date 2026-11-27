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

/** El servidor exige unos segundos entre que carga el formulario y el envío (antiabuso). */
const ESPERA_ANTIABUSO_MS = 3500;

async function interceptarWhatsApp(page: Page) {
  await page.route("https://wa.me/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: "<p>WhatsApp</p>" }),
  );
}

test.describe("/pedido: envío por WhatsApp", () => {
  test("desde la ficha, tres acciones abren WhatsApp con el pedido armado", async ({
    page,
  }) => {
    await interceptarWhatsApp(page);
    await abrirPrimeraFicha(page);
    await page.getByRole("radio").first().check();

    // Acción 1: agregar. Acción 2: revisar. Acción 3: enviar (en la misma pantalla del formulario).
    await page.getByRole("button", { name: "Agregar a mi pedido" }).click();
    await page.getByRole("link", { name: /^Revisar mi pedido/ }).click();
    await expect(page).toHaveURL(/\/pedido$/);
    await page.getByRole("list", { name: "Productos de mi pedido" }).waitFor();
    await page.waitForTimeout(ESPERA_ANTIABUSO_MS);

    const conDatos = (await page.getByLabel("Nombre", { exact: true }).count()) > 0;
    test.skip(conDatos, "La política está publicada: este caso es el modo sin datos.");

    // En el modo sin datos no se pide nombre ni teléfono.
    await expect(page.getByLabel("Teléfono")).toHaveCount(0);
    await page.getByRole("button", { name: "Enviar por WhatsApp" }).click();

    await page.waitForURL(/^https:\/\/wa\.me\//);
    const url = new URL(page.url());
    // Número ficticio de pruebas (playwright.config.ts): 900000000 → 51900000000.
    expect(url.pathname).toBe("/51900000000");
    const texto = url.searchParams.get("text") ?? "";
    expect(texto).toMatch(/^Hola, quiero cotizar este pedido \(N\.º \d{4,}\):/);
    expect(texto).toMatch(/• .+ — .+ × 1/);
    expect(texto).not.toMatch(/Nombre:/);
  });

  test("tras enviar, la lista local queda vacía", async ({ page }) => {
    await interceptarWhatsApp(page);
    await abrirPrimeraFicha(page);
    await page.getByRole("radio").first().check();
    await page.getByRole("button", { name: "Agregar a mi pedido" }).click();
    await page.getByRole("link", { name: /^Revisar mi pedido/ }).click();
    await page.getByRole("list", { name: "Productos de mi pedido" }).waitFor();
    test.skip(
      (await page.getByLabel("Nombre", { exact: true }).count()) > 0,
      "Con política publicada se necesitan datos: lo cubre la otra prueba.",
    );
    await page.waitForTimeout(ESPERA_ANTIABUSO_MS);
    await page.getByRole("button", { name: "Enviar por WhatsApp" }).click();
    await page.waitForURL(/^https:\/\/wa\.me\//);

    await page.goBack();
    await expect(page.getByRole("list", { name: "Productos de mi pedido" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /^Mi pedido,/ })).toHaveCount(0);
  });

  test("el campo trampa descarta el envío sin abrir WhatsApp", async ({ page }) => {
    let tocoWhatsApp = false;
    await page.route("https://wa.me/**", (route) => {
      tocoWhatsApp = true;
      return route.abort();
    });
    await abrirPrimeraFicha(page);
    await page.getByRole("radio").first().check();
    await page.getByRole("button", { name: "Agregar a mi pedido" }).click();
    await page.getByRole("link", { name: /^Revisar mi pedido/ }).click();
    await page.getByRole("list", { name: "Productos de mi pedido" }).waitFor();
    test.skip(
      (await page.getByLabel("Nombre", { exact: true }).count()) > 0,
      "Se prueba en el modo sin datos.",
    );
    await page.waitForTimeout(ESPERA_ANTIABUSO_MS);

    await page.locator('input[name="sitioWeb"]').evaluate((el) => {
      (el as HTMLInputElement).value = "https://spam.example";
    });
    await page.getByRole("button", { name: "Enviar por WhatsApp" }).click();

    await expect(
      page.getByRole("heading", { name: /^Listo/ }),
    ).toBeVisible();
    expect(tocoWhatsApp).toBe(false);
    await expect(page).toHaveURL(/\/pedido$/);
  });

  test("con política publicada pide nombre, teléfono y aceptación, y los valida", async ({
    page,
  }) => {
    await interceptarWhatsApp(page);
    await abrirPrimeraFicha(page);
    await page.getByRole("radio").first().check();
    await page.getByRole("button", { name: "Agregar a mi pedido" }).click();
    await page.getByRole("link", { name: /^Revisar mi pedido/ }).click();
    await page.getByRole("list", { name: "Productos de mi pedido" }).waitFor();
    test.skip(
      (await page.getByLabel("Nombre", { exact: true }).count()) === 0,
      "Sin política publicada no se piden datos personales (se cubre en las otras pruebas).",
    );
    await page.waitForTimeout(ESPERA_ANTIABUSO_MS);

    // Sin datos: errores por campo, y no se abre WhatsApp.
    await page.getByRole("button", { name: "Enviar por WhatsApp" }).click();
    await expect(page.getByText("Ingresa tu nombre.")).toBeVisible();
    await expect(page.getByText("Ingresa un teléfono válido.")).toBeVisible();
    await expect(page.getByText("Debes aceptar la política de privacidad.")).toBeVisible();

    // Teléfono distinto en cada corrida: el servidor limita pedidos por teléfono y hora.
    const telefono = `9${Math.floor(10_000_000 + Math.random() * 89_999_999)}`;
    await page.getByLabel("Nombre", { exact: true }).fill("Prueba E2E");
    await page.getByLabel("Teléfono").fill(telefono);
    await page.getByRole("checkbox", { name: /política de privacidad/ }).check();
    await page.getByRole("button", { name: "Enviar por WhatsApp" }).click();

    await page.waitForURL(/^https:\/\/wa\.me\//);
    const texto = new URL(page.url()).searchParams.get("text") ?? "";
    expect(texto).toContain("Nombre: Prueba E2E");
    expect(texto).not.toContain(telefono);
  });
});

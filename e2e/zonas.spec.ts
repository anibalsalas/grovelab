import { expect, test } from "@playwright/test";

// La ruta depende de si hay zonas publicadas: con ninguna es 404 y no aparece en el menú
// ni en el sitemap. Con alguna, cada tarjeta debe ser correcta. Las dos situaciones son válidas.
test.describe("Zonas comerciales", () => {
  test("la página, el menú y el sitemap están de acuerdo", async ({ page, request }) => {
    const respuesta = await page.goto("/zonas-comerciales");
    const hayPagina = respuesta?.status() === 200;

    const enMenu = await page
      .getByRole("navigation", { name: "Principal" })
      .getByRole("link", { name: "Zonas", exact: true })
      .count();
    const sitemap = await (await request.get("/sitemap.xml")).text();

    if (!hayPagina) {
      expect(respuesta?.status()).toBe(404);
      expect(enMenu).toBe(0);
      expect(sitemap).not.toContain("/zonas-comerciales");
      return;
    }

    await expect(
      page.getByRole("heading", { level: 1, name: "Zonas comerciales" }),
    ).toBeVisible();
    expect(enMenu).toBe(1);
    expect(sitemap).toContain("/zonas-comerciales");

    // Todo botón de WhatsApp tiene un nombre propio y abre en pestaña nueva de forma segura.
    const botones = page.getByRole("link", { name: /^Escribir por WhatsApp al asesor de / });
    for (const boton of await botones.all()) {
      await expect(boton).toHaveAttribute("rel", /noopener/);
      await expect(boton).toHaveAttribute("href", /^https:\/\/wa\.me\/\d{9,15}\?text=/);
    }
  });
});

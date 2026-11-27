import { expect, test } from "@playwright/test";

test.describe("Menú móvil", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("con movimiento reducido, los enlaces se ven al abrir sin esperar animación", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await page.getByRole("button", { name: /^menú$/i }).click();
    const dialogo = page.getByRole("dialog", { name: /menú de navegación/i });
    const productos = dialogo.getByRole("link", { name: "Productos", exact: true });

    await expect(productos).toBeVisible();
    // Sin animación de entrada: opacidad final desde el primer momento.
    await expect(productos.locator("xpath=..")).toHaveCSS("opacity", "1");
  });

  test("abre, navega y cierra con Escape", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /^menú$/i }).click();
    const dialogo = page.getByRole("dialog", { name: /menú de navegación/i });
    await expect(dialogo).toBeVisible();

    await expect(
      // «Cultivos» depende de que haya cultivos publicados; «Productos» siempre está.
      dialogo.getByRole("link", { name: "Productos", exact: true }),
    ).toBeVisible();
    // /buscar es solo una redirección a /productos: no va en el menú.
    await expect(
      dialogo.getByRole("link", { name: "Buscar", exact: true }),
    ).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("dialog", { name: /menú de navegación/i }),
    ).not.toBeVisible();
  });
});

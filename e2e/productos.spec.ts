import { expect, test } from "@playwright/test";

test.describe("Panel de filtros en /productos", () => {
  test("filtro sin resultados muestra el estado vacío con sus dos salidas", async ({
    page,
  }) => {
    await page.goto("/productos?categoria=categoria-inexistente-e2e");

    await expect(
      page.getByRole("heading", { name: /no encontramos productos con estos filtros/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /ver todos los productos/i }),
    ).toBeVisible();
  });

  test("Quitar filtros limpia la URL y el botón Atrás vuelve al filtro anterior", async ({
    page,
  }) => {
    await page.goto("/productos?categoria=categoria-inexistente-e2e");
    await expect(page).toHaveURL("/productos?categoria=categoria-inexistente-e2e");

    await page.getByRole("button", { name: /quitar filtros/i }).click();
    await expect(page).toHaveURL("/productos");

    await page.goBack();
    await expect(page).toHaveURL("/productos?categoria=categoria-inexistente-e2e");
  });

  test("en 360 px el panel empieza plegado y se abre con el botón", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/productos");

    const boton = page.getByRole("button", { name: /filtrar|ocultar/i });
    await expect(boton).toHaveAttribute("aria-expanded", "false");

    await boton.click();
    await expect(boton).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByLabel(/buscar por palabra/i)).toBeVisible();
  });

  test("en 1440 px el panel está visible sin pulsar nada", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/productos");

    await expect(page.getByLabel(/buscar por palabra/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^filtrar$/i })).not.toBeVisible();
  });
});

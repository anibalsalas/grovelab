import { expect, test } from "@playwright/test";

test.describe("Buscador público", () => {
  test("muestra estado inicial sin filtros en /buscar", async ({ page }) => {
    await page.goto("/buscar");

    await expect(
      page.getByRole("heading", { name: /buscar productos/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/elige al menos un filtro/i),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /explorar cultivos/i })).toBeVisible();
  });
});

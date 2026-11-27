import { expect, test } from "@playwright/test";

test.describe("Redirección de /buscar", () => {
  test("/buscar sin filtros redirige a /productos", async ({ page }) => {
    await page.goto("/buscar");
    await expect(page).toHaveURL("/productos");
  });

  test("/buscar?plaga=slug redirige conservando el filtro", async ({ page }) => {
    await page.goto("/buscar?plaga=una-plaga-de-prueba");
    await expect(page).toHaveURL("/productos?plaga=una-plaga-de-prueba");
  });

  test("/buscar con varios filtros conserva todos al redirigir", async ({ page }) => {
    await page.goto("/buscar?q=nutricion&cultivo=vid&categoria=bioestimulantes");
    const url = new URL(page.url());
    expect(url.pathname).toBe("/productos");
    expect(url.searchParams.get("q")).toBe("nutricion");
    expect(url.searchParams.get("cultivo")).toBe("vid");
    expect(url.searchParams.get("categoria")).toBe("bioestimulantes");
  });
});

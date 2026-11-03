import { expect, test } from "@playwright/test";

test.describe("Menú móvil", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("abre, navega y cierra con Escape", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /^menú$/i }).click();
    await expect(page.getByRole("dialog", { name: /menú de navegación/i })).toBeVisible();

    await expect(page.getByRole("link", { name: "Cultivos" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("dialog", { name: /menú de navegación/i }),
    ).not.toBeVisible();
  });
});

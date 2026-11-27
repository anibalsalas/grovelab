import { expect, test } from "@playwright/test";

test.describe("Portada", () => {
  test("carga sin errores de consola", async ({ page }) => {
    const erroresConsola: string[] = [];
    page.on("console", (mensaje) => {
      if (mensaje.type() === "error") {
        erroresConsola.push(mensaje.text());
      }
    });
    page.on("pageerror", (error) => {
      erroresConsola.push(error.message);
    });

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    expect(erroresConsola).toEqual([]);
  });
});

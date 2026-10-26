import { expect, test } from "@playwright/test";

test.describe("Acceso al panel Payload", () => {
  test("muestra el formulario de inicio de sesión en /admin/login", async ({
    page,
  }) => {
    await page.goto("/admin/login");

    await expect(page.getByRole("textbox", { name: /correo/i })).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /iniciar sesión/i }),
    ).toBeVisible();
  });

  test("redirige /admin al login sin sesión", async ({ page }) => {
    await page.goto("/admin");

    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole("textbox", { name: /correo/i })).toBeVisible();
  });

  test("no expone usuarios por API sin sesión", async ({ request }) => {
    const response = await request.get("/api/users");

    expect([401, 403]).toContain(response.status());
  });
});

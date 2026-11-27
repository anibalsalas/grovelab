import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  expect: {
    timeout: 90_000,
  },
  use: {
    baseURL,
    navigationTimeout: 90_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
    // Número ficticio solo para las pruebas: activa la función de pedido sin tocar
    // ni depender del WHATSAPP_NUMBER real de .env.local (la variable de proceso manda).
    env: { WHATSAPP_NUMBER: "900000000" },
  },
});

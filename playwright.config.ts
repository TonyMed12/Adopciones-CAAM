import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { config as loadEnv } from "dotenv";

// Carga variables de entorno: primero .env.test (especifico para E2E),
// luego .env.local como fallback (Supabase, etc).
loadEnv({ path: path.resolve(__dirname, ".env.test") });
loadEnv({ path: path.resolve(__dirname, ".env.local") });

const PORT = Number(process.env.E2E_PORT ?? 3000);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

const STORAGE_STATE = path.resolve(__dirname, "tests/.auth/user.json");

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  timeout: 60_000,
  expect: { timeout: 10_000 },

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // 1 worker => simplifica el rate-limit + storageState compartido

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

  use: {
    baseURL: BASE_URL,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "es-MX",
    timezoneId: "America/Mexico_City",
    viewport: { width: 1366, height: 800 },
  },

  projects: [
    /**
     * 1. SETUP — login una sola vez por corrida; persiste cookies a
     *    tests/.auth/user.json para que los proyectos autenticados los
     *    reutilicen. Si las credenciales E2E no estan definidas, el
     *    propio setup se omite y los projects dependientes tambien.
     */
    {
      name: "setup",
      testMatch: /tests\/setup\/.*\.setup\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },

    /**
     * 2. PUBLIC — tests que no requieren sesion:
     *    registro, login, catalogo publico, filtrado, detalle, gate de
     *    adopcion (modal "iniciar sesion para adoptar").
     *
     *    No depende del setup -> se puede correr aislado.
     */
    {
      name: "public",
      testMatch: /tests\/e2e\/[^/]+\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },

    /**
     * 3. AUTHENTICATED — tests que sí requieren un usuario logueado
     *    (catalogo protegido, inicio del flujo de adopcion con sesion).
     *    Reutiliza storageState del setup.
     */
    {
      name: "authenticated",
      testMatch: /tests\/e2e\/auth\/.*\.spec\.ts$/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: STORAGE_STATE,
      },
    },
  ],

  webServer: process.env.E2E_SKIP_WEBSERVER
    ? undefined
    : {
        command: "npm run dev",
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stdout: "ignore",
        stderr: "pipe",
      },
});

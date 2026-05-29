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

/**
 * Solo activamos los projects `setup` + `authenticated` cuando hay
 * credenciales E2E. Si no, ni siquiera se registran -> Playwright no
 * intenta leer un storageState inexistente y no marca tests como
 * fallidos por ENOENT.
 */
const HAS_E2E_CREDS = !!(
  process.env.E2E_USER_EMAIL && process.env.E2E_USER_PASSWORD
);

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
     * PUBLIC — tests que no requieren sesion: registro, login, catalogo
     * publico, filtrado, detalle, gate de adopcion. Siempre activo.
     */
    {
      name: "public",
      testMatch: /tests\/e2e\/[^/]+\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },

    /**
     * SETUP + AUTHENTICATED — solo se registran si hay credenciales E2E.
     * Asi, en entornos sin credenciales (CI sin secrets, dev sin Supabase)
     * Playwright ni siquiera intenta cargar el storageState y la suite
     * publica se mantiene 100% verde.
     */
    ...(HAS_E2E_CREDS
      ? [
          {
            name: "setup",
            testMatch: /tests\/setup\/.*\.setup\.ts$/,
            use: { ...devices["Desktop Chrome"] },
          },
          {
            name: "authenticated",
            testMatch: /tests\/e2e\/auth\/.*\.spec\.ts$/,
            dependencies: ["setup"],
            use: {
              ...devices["Desktop Chrome"],
              storageState: STORAGE_STATE,
            },
          },
        ]
      : []),
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

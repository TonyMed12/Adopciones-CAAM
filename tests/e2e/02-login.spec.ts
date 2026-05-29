import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { env, hasValidCredentials } from "../helpers/env";

test.describe("Flujo 2 — Inicio de sesion", () => {
  test("renderiza el formulario y los botones de proveedores sociales", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await expect(login.emailInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.submitButton).toBeVisible();
    await expect(login.googleButton).toBeVisible();
    await expect(login.githubButton).toBeVisible();
    await expect(login.registerLink).toBeVisible();
  });

  test("muestra error de validacion si los campos estan vacios", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.submit();

    // El componente setea: "Checa tu info papito."
    await expect(login.errorAlert).toBeVisible();
    await expect(login.errorAlert).toContainText(/checa tu info/i);
  });

  test("rechaza credenciales invalidas y muestra mensaje del backend", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login("no-existe@caam-tests.local", "PasswordIncorrecta1!");

    // El backend responde 401 con un mensaje; la app lo pinta en role=alert
    await expect(login.errorAlert).toBeVisible({ timeout: 15_000 });
    await expect(login.errorAlert).toContainText(
      /credenciales|invalid|incorrect|no es valid|no se pudo/i
    );

    // No debe haber navegado fuera de /login
    await expect(page).toHaveURL(/\/login/);
  });

  test("login valido redirige al dashboard correspondiente", async ({ page }) => {
    test.skip(
      !hasValidCredentials(),
      "Define E2E_USER_EMAIL y E2E_USER_PASSWORD en .env.test para correr este caso."
    );

    const login = new LoginPage(page);
    await login.goto();
    await login.login(env.validUserEmail, env.validUserPassword);

    await page.waitForURL(/\/dashboards\/(usuario|administrador)/i, { timeout: 20_000 });
    expect(page.url()).toMatch(/\/dashboards\/(usuario|administrador)/);
  });
});

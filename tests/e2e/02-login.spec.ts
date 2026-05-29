import { test, expect } from "../fixtures/test";
import { LoginPage } from "../pages/LoginPage";
import { env, hasValidCredentials } from "../helpers/env";

/**
 * Flujo 2 — Inicio de sesion.
 *
 * El test "login valido" hace UN unico submit por corrida. El resto
 * de tests autenticados reutiliza la sesion via storageState generado
 * por el setup project, asi NUNCA llegamos al limite de 5 logins/min
 * del rate limiter.
 */
test.describe("Flujo 2 — Inicio de sesion", () => {
  test("renderiza el formulario y los proveedores sociales", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await expect(login.emailInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.submitButton).toBeVisible();
    await expect(login.googleButton).toBeVisible();
    await expect(login.githubButton).toBeVisible();
    await expect(login.registerLink).toBeVisible();
  });

  test("error de validacion si los campos estan vacios", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.submit();

    await expect(login.errorAlert).toBeVisible();
    await expect(login.errorAlert).toContainText(/checa tu info/i);
  });

  test("rechaza credenciales invalidas con el mensaje del backend", async ({
    page,
  }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login("no-existe@e2e.caam.test", "PasswordIncorrecta1!");

    await expect(login.errorAlert).toBeVisible({ timeout: 15_000 });
    await expect(login.errorAlert).toContainText(
      /credenciales|invalid|incorrect|no es valid|no se pudo|demasiadas/i
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test("login valido redirige al dashboard segun rol", async ({ page }) => {
    test.skip(
      !hasValidCredentials(),
      "Define E2E_USER_EMAIL y E2E_USER_PASSWORD en .env.test"
    );

    const login = new LoginPage(page);
    await login.goto();
    await login.login(env.validUserEmail, env.validUserPassword);

    await page.waitForURL(/\/dashboards\/(usuario|administrador)(\/|$)/i, {
      timeout: 30_000,
    });
    expect(page.url()).toMatch(/\/dashboards\/(usuario|administrador)/);
  });
});

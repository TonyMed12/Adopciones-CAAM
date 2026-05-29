import { test, expect } from "@playwright/test";
import { RegistroPage } from "../pages/RegistroPage";
import { generateTestUser } from "../helpers/data";
import { env } from "../helpers/env";

test.describe("Flujo 1 — Registro de usuario adoptante", () => {
  test("acceso al formulario y navegacion entre los 3 pasos", async ({ page }) => {
    const registro = new RegistroPage(page);
    await registro.goto();
    await registro.expectPaso(1);

    const user = generateTestUser();

    // Paso 1 -> Paso 2
    await registro.fillPaso1(user);
    await registro.next();
    await registro.expectPaso(2);

    // Paso 2 -> Paso 3
    await registro.fillPaso2(user);
    await registro.next();
    await registro.expectPaso(3);

    // Verifica que se puede regresar
    await registro.prev();
    await registro.expectPaso(2);
  });

  test("muestra errores cuando el paso 1 esta vacio", async ({ page }) => {
    const registro = new RegistroPage(page);
    await registro.goto();
    await registro.next();

    // El componente muestra mensajes "Por favor ingresa ..." debajo de cada input
    await expect(page.getByText(/por favor ingresa tu nombre/i)).toBeVisible();
    await expect(page.getByText(/por favor ingresa tu apellido paterno/i)).toBeVisible();
    await expect(page.getByText(/por favor ingresa tu correo/i)).toBeVisible();
    await registro.expectPaso(1);
  });

  test("valida formato de email y bloquea avance", async ({ page }) => {
    const registro = new RegistroPage(page);
    await registro.goto();

    const u = generateTestUser({ email: "no-es-email" });
    await registro.fillPaso1(u);
    await registro.next();

    // Aun seguimos en paso 1 (la validacion del schema/native HTML lo impide)
    await registro.expectPaso(1);
  });

  test("paso 3: detecta passwords que no coinciden", async ({ page }) => {
    const registro = new RegistroPage(page);
    await registro.goto();

    const u = generateTestUser();
    await registro.fillPaso1(u);
    await registro.next();
    await registro.fillPaso2(u);
    await registro.next();
    await registro.expectPaso(3);

    await registro.passwordInput.fill(u.password);
    await registro.confirmPasswordInput.fill("OtraDistinta1");
    await registro.confirmPasswordInput.blur();

    await expect(page.getByText(/las contrase(ñ|n)as no coinciden/i)).toBeVisible();
  });

  test("paso 3: muestra requisitos de contraseña en tiempo real", async ({ page }) => {
    const registro = new RegistroPage(page);
    await registro.goto();

    const u = generateTestUser();
    await registro.fillPaso1(u);
    await registro.next();
    await registro.fillPaso2(u);
    await registro.next();
    await registro.expectPaso(3);

    // Escribimos una password mala -> aparecen los requisitos
    await registro.passwordInput.fill("abc");
    await expect(page.getByText(/m(i|í)nimo 8 caracteres/i)).toBeVisible();
    await expect(page.getByText(/al menos una letra may(u|ú)scula/i)).toBeVisible();
    await expect(page.getByText(/al menos un n(u|ú)mero/i)).toBeVisible();
  });

  test("registra usuario nuevo end-to-end (solo si no es dry-run)", async ({ page }) => {
    test.skip(
      env.registerDryRun,
      "E2E_REGISTER_DRY_RUN=1 — el test no escribira en Supabase"
    );

    const registro = new RegistroPage(page);
    await registro.goto();

    const u = generateTestUser();
    await registro.fillPaso1(u);
    await registro.next();
    await registro.expectPaso(2);

    await registro.fillPaso2(u);
    await registro.next();
    await registro.expectPaso(3);

    await registro.fillPaso3(u);
    await registro.crearCuentaButton.click();

    // Tras un registro exitoso la app navega a /pendiente
    await page.waitForURL(/\/pendiente/i, { timeout: 20_000 });
    expect(page.url()).toMatch(/\/pendiente/);
  });
});

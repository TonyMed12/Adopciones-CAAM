import { test, expect } from "../fixtures/test";
import { RegistroPage } from "../pages/RegistroPage";
import { generateTestUser } from "../helpers/data";
import { env } from "../helpers/env";

/**
 * Flujo 1 — Registro de usuario adoptante.
 *
 * Notas tras auditar el componente real:
 *  - El formulario NO valida formato de email en `validateCurrentStep`,
 *    solo "no vacio" y "no ya existente". Por eso el test antiguo
 *    "valida formato de email y bloquea avance" estaba mal diseñado:
 *    la app sí avanza al paso 2 con un email mal formado, porque la
 *    funcion `checkEmailExists` retorna `false` cuando el string no
 *    tiene "@" y no agrega error. Por eso este test fue eliminado
 *    (validar comportamiento inexistente seria un falso positivo).
 */
test.describe("Flujo 1 — Registro de usuario adoptante", () => {
  test("acceso al formulario y navegacion completa entre los 3 pasos", async ({
    page,
  }) => {
    const registro = new RegistroPage(page);
    await registro.goto();
    await registro.expectPaso(1);

    const user = generateTestUser();

    await registro.fillPaso1(user);
    await registro.next();
    await registro.expectPaso(2);

    await registro.fillPaso2(user);
    await registro.next();
    await registro.expectPaso(3);

    // Verifica que se puede regresar y avanzar de nuevo
    await registro.prev();
    await registro.expectPaso(2);
  });

  test("muestra errores cuando el paso 1 esta vacio", async ({ page }) => {
    const registro = new RegistroPage(page);
    await registro.goto();

    // No esperamos checks asincronos porque no llenamos nada
    await registro.siguienteButton.click();

    await expect(
      page.getByText(/por favor ingresa tu nombre/i)
    ).toBeVisible();
    await expect(
      page.getByText(/por favor ingresa tu apellido paterno/i)
    ).toBeVisible();
    await expect(
      page.getByText(/por favor ingresa tu correo/i)
    ).toBeVisible();
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

    await expect(
      page.getByText(/las contrase(ñ|n)as no coinciden/i)
    ).toBeVisible();
  });

  test("paso 3: muestra requisitos de contraseña en tiempo real", async ({
    page,
  }) => {
    const registro = new RegistroPage(page);
    await registro.goto();

    const u = generateTestUser();
    await registro.fillPaso1(u);
    await registro.next();
    await registro.fillPaso2(u);
    await registro.next();
    await registro.expectPaso(3);

    await registro.passwordInput.fill("abc");

    await expect(page.getByText(/m(i|í)nimo 8 caracteres/i)).toBeVisible();
    await expect(
      page.getByText(/al menos una letra may(u|ú)scula/i)
    ).toBeVisible();
    await expect(page.getByText(/al menos un n(u|ú)mero/i)).toBeVisible();
  });

  test("registra usuario nuevo end-to-end (solo si no es dry-run)", async ({
    page,
  }) => {
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

    await page.waitForURL(/\/pendiente/i, { timeout: 30_000 });
    expect(page.url()).toMatch(/\/pendiente/);
  });
});

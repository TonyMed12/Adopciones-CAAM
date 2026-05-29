import { expect, Locator, Page } from "@playwright/test";
import type { TestUser } from "../helpers/data";

/**
 * Page Object para /register (formulario de adoptante en 3 pasos).
 *
 * Detalles importantes (descubiertos auditando el componente real):
 *  - `validateCurrentStep()` NO valida formato de email, solo "no vacio"
 *    y "no ya existente" (via API /api/auth/check-email).
 *  - El boton "Siguiente" se DESHABILITA mientras `isCheckingEmail`,
 *    `isCheckingCurp`, `emailExists` o `curpExists` esten activos.
 *    Por eso necesitamos esperar a que los spinners desaparezcan.
 *  - El DatePicker usa react-datepicker con `showYearDropdown` +
 *    `showMonthDropdown` (selects nativos). Intentar tipear en el
 *    input es fragil porque `onChangeRaw` mutila el value en cada
 *    keystroke. La forma robusta es:
 *      1. abrir el popup (click)
 *      2. seleccionar anio/mes en los <select> internos
 *      3. clickear la celda del dia (.react-datepicker__day--NNN)
 *  - El select de ocupacion es un <select> nativo con opciones fijas.
 */
export class RegistroPage {
  readonly page: Page;

  // Paso 1
  readonly nombresInput: Locator;
  readonly apPaternoInput: Locator;
  readonly apMaternoInput: Locator;
  readonly emailInput: Locator;
  readonly telefonoInput: Locator;
  readonly emailSpinner: Locator;

  // Paso 2
  readonly fechaInput: Locator;
  readonly curpInput: Locator;
  readonly ocupacionSelect: Locator;
  readonly curpSpinner: Locator;

  // Paso 3
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly acceptTerms: Locator;
  readonly acceptPrivacy: Locator;

  // Navegacion
  readonly siguienteButton: Locator;
  readonly anteriorButton: Locator;
  readonly crearCuentaButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nombresInput = page.locator("#nombres");
    this.apPaternoInput = page.locator("#apellido_paterno");
    this.apMaternoInput = page.locator("#apellido_materno");
    this.emailInput = page.locator("#email");
    this.telefonoInput = page.locator("#telefono");
    this.emailSpinner = page.locator("#email + .animate-spin, #email ~ div .animate-spin").first();

    this.fechaInput = page.locator(".react-datepicker-wrapper input").first();
    this.curpInput = page.locator("#curp");
    this.ocupacionSelect = page.locator("#ocupacion");
    this.curpSpinner = page.locator("#curp + .animate-spin, #curp ~ div .animate-spin").first();

    this.passwordInput = page.locator("#password");
    this.confirmPasswordInput = page.locator("#confirmPassword");
    this.acceptTerms = page.locator("#acceptTerms");
    this.acceptPrivacy = page.locator("#acceptPrivacy");

    this.siguienteButton = page.getByRole("button", { name: /siguiente/i });
    this.anteriorButton = page.getByRole("button", { name: /anterior/i });
    this.crearCuentaButton = page.getByRole("button", {
      name: /crear cuenta|registrando/i,
    });
  }

  async goto() {
    await this.page.goto("/register");
    await expect(this.page.getByText(/registro de adoptante/i)).toBeVisible();
  }

  async expectPaso(n: 1 | 2 | 3) {
    await expect(
      this.page.getByText(new RegExp(`paso ${n} de 3`, "i"))
    ).toBeVisible();
  }

  async fillPaso1(u: TestUser) {
    await this.nombresInput.fill(u.nombres);
    await this.apPaternoInput.fill(u.apellido_paterno);
    await this.apMaternoInput.fill(u.apellido_materno);
    await this.emailInput.fill(u.email);
    await this.telefonoInput.fill(u.telefono);
    // Forzar blur sobre el email para disparar checkEmailExists ANTES
    // de pedir avanzar (y luego esperamos a que el spinner desaparezca).
    await this.emailInput.blur();
  }

  /**
   * Selecciona la fecha usando los controles INTERNOS del calendario
   * (dropdowns de anio/mes + celda del dia). Mucho mas estable que
   * tipear en el input, porque evita la interaccion con `onChangeRaw`.
   */
  async setFechaNacimiento(year: number, month: number, day: number) {
    await this.fechaInput.click();
    await this.page.locator(".react-datepicker").first().waitFor({ timeout: 5_000 });

    await this.page
      .locator(".react-datepicker__year-select")
      .selectOption(String(year));
    await this.page
      .locator(".react-datepicker__month-select")
      .selectOption(String(month - 1)); // 0-indexed

    // Dia: clase con 3 digitos zero-padded. Filtramos las celdas
    // que pertenecen a meses adyacentes (outside-month).
    const dayCell = this.page
      .locator(`.react-datepicker__day--${String(day).padStart(3, "0")}`)
      .locator(":not(.react-datepicker__day--outside-month)")
      .first();
    // Fallback robusto: si el filtro no rinde, tomar la primera celda visible.
    if (await dayCell.count()) {
      await dayCell.click();
    } else {
      await this.page
        .locator(`.react-datepicker__day--${String(day).padStart(3, "0")}`)
        .first()
        .click();
    }
  }

  async fillPaso2(u: TestUser) {
    await this.setFechaNacimiento(u.fechaYear, u.fechaMonth, u.fechaDay);

    await this.curpInput.fill(u.curp);
    await this.curpInput.blur();

    await this.ocupacionSelect.selectOption(u.ocupacion);
  }

  async fillPaso3(
    u: TestUser,
    { acceptTerms = true, acceptPrivacy = true } = {}
  ) {
    await this.passwordInput.fill(u.password);
    await this.confirmPasswordInput.fill(u.password);
    if (acceptTerms) await this.acceptTerms.check();
    if (acceptPrivacy) await this.acceptPrivacy.check();
  }

  /**
   * Espera a que se completen las verificaciones asincronas que
   * deshabilitan el boton "Siguiente" (check-email, check-curp).
   */
  async waitForAsyncChecks() {
    await this.page
      .locator(".animate-spin")
      .first()
      .waitFor({ state: "detached", timeout: 10_000 })
      .catch(() => null);
    await expect(this.siguienteButton).toBeEnabled({ timeout: 10_000 });
  }

  async next() {
    await this.waitForAsyncChecks();
    await this.siguienteButton.click();
  }

  async prev() {
    await this.anteriorButton.click();
  }
}

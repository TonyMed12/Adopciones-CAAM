import { expect, Locator, Page } from "@playwright/test";
import type { TestUser } from "../helpers/data";

/**
 * Page Object para /register (formulario de adoptante en 3 pasos).
 *
 * El formulario usa estado interno y valida cada paso antes de avanzar.
 * Este PO aisla la navegacion entre pasos y el llenado de cada campo.
 */
export class RegistroPage {
  readonly page: Page;

  // Paso 1
  readonly nombresInput: Locator;
  readonly apPaternoInput: Locator;
  readonly apMaternoInput: Locator;
  readonly emailInput: Locator;
  readonly telefonoInput: Locator;

  // Paso 2
  readonly fechaInput: Locator;
  readonly curpInput: Locator;
  readonly ocupacionSelect: Locator;

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

    this.fechaInput = page.locator(".react-datepicker-wrapper input");
    this.curpInput = page.locator("#curp");
    this.ocupacionSelect = page.locator("#ocupacion");

    this.passwordInput = page.locator("#password");
    this.confirmPasswordInput = page.locator("#confirmPassword");
    this.acceptTerms = page.locator("#acceptTerms");
    this.acceptPrivacy = page.locator("#acceptPrivacy");

    this.siguienteButton = page.getByRole("button", { name: /siguiente/i });
    this.anteriorButton = page.getByRole("button", { name: /anterior/i });
    this.crearCuentaButton = page.getByRole("button", { name: /crear cuenta|registrando/i });
  }

  async goto() {
    await this.page.goto("/register");
    await expect(this.page.getByText(/registro de adoptante/i)).toBeVisible();
  }

  async expectPaso(n: 1 | 2 | 3) {
    await expect(this.page.getByText(new RegExp(`paso ${n} de 3`, "i"))).toBeVisible();
  }

  async fillPaso1(u: TestUser) {
    await this.nombresInput.fill(u.nombres);
    await this.apPaternoInput.fill(u.apellido_paterno);
    await this.apMaternoInput.fill(u.apellido_materno);
    await this.emailInput.fill(u.email);
    await this.telefonoInput.fill(u.telefono);
  }

  async fillPaso2(u: TestUser) {
    // El DatePicker permite escribir con formato dd/MM/yyyy.
    await this.fechaInput.click();
    await this.fechaInput.fill("");
    await this.fechaInput.type(u.fecha_nacimiento, { delay: 20 });
    // Cerrar el datepicker
    await this.page.keyboard.press("Escape");

    await this.curpInput.fill(u.curp);
    await this.ocupacionSelect.selectOption(u.ocupacion);
  }

  async fillPaso3(u: TestUser, { acceptTerms = true, acceptPrivacy = true } = {}) {
    await this.passwordInput.fill(u.password);
    await this.confirmPasswordInput.fill(u.password);
    if (acceptTerms) await this.acceptTerms.check();
    if (acceptPrivacy) await this.acceptPrivacy.check();
  }

  async next() {
    await this.siguienteButton.click();
  }

  async prev() {
    await this.anteriorButton.click();
  }
}

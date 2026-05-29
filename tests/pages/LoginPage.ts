import { expect, Locator, Page } from "@playwright/test";

/**
 * Page Object para /login.
 *
 * Encapsula las interacciones con el formulario de inicio de sesion
 * para que los tests sean declarativos y resistentes a cambios de UI.
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly googleButton: Locator;
  readonly githubButton: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"][autocomplete="email"]');
    this.passwordInput = page.locator('input[type="password"][autocomplete="current-password"]');
    this.submitButton = page.getByRole("button", { name: /iniciar sesi(o|ó)n$/i }).first();
    // Excluye el announcer invisible que Next.js monta como
    // <div role="alert" id="__next-route-announcer__"> y que rompe
    // las consultas con `getByRole('alert')` por strict mode.
    this.errorAlert = page.locator('[role="alert"]:not(#__next-route-announcer__)');
    this.googleButton = page.getByRole("button", { name: /google/i });
    this.githubButton = page.getByRole("button", { name: /github/i });
    this.registerLink = page.getByRole("link", { name: /reg(i|í)strate/i });
  }

  async goto() {
    await this.page.goto("/login");
    await expect(this.page.getByRole("heading", { name: /bienvenido/i })).toBeVisible();
  }

  async fill(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.fill(email, password);
    await this.submit();
  }
}

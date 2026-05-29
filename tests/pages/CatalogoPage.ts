import { expect, Locator, Page } from "@playwright/test";

/**
 * Page Object BASE para las vistas de catalogo de mascotas.
 *
 * Existen dos rutas en la app que reutilizan los mismos componentes
 * de UI (`Filters` + `MascotasFeed`):
 *
 *   - PUBLICA   : /dashboards/mascotas
 *                 layout sin auth, "Adoptar" abre <ModalLoginRequired>.
 *
 *   - PROTEGIDA : /dashboards/usuario/mascotas
 *                 protegida por `requireRole(2)` en su layout.tsx.
 *                 "Adoptar" dispara el flujo real (hook + redirects).
 *
 * Esta clase concentra los locators comunes; las subclases concretas
 * solo definen su `goto()` y, opcionalmente, su heading esperado.
 */
export class CatalogoPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly especieSelect: Locator;
  readonly sexoSelect: Locator;
  readonly limpiarFiltros: Locator;
  readonly mascotaCards: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder(/busca por nombre/i);
    this.especieSelect = page.getByRole("button", { name: /filtrar por especie/i });
    this.sexoSelect = page.getByRole("button", { name: /filtrar por sexo/i });
    this.limpiarFiltros = page.getByRole("button", { name: /^limpiar$/i }).first();
    this.mascotaCards = page.locator('section[aria-label="Lista de mascotas"] article');
    this.emptyState = page.getByText(/no encontramos mascotas|a(u|ú)n no hay mascotas/i);
  }

  async waitForFeed() {
    await Promise.race([
      this.mascotaCards
        .first()
        .waitFor({ state: "visible", timeout: 20_000 })
        .catch(() => null),
      this.emptyState
        .first()
        .waitFor({ state: "visible", timeout: 20_000 })
        .catch(() => null),
    ]);
  }

  private async selectChip(buttonLocator: Locator, optionLabel: RegExp | string) {
    await buttonLocator.click();
    await this.page.getByRole("option", { name: optionLabel }).first().click();
  }

  async filterByEspecie(label: RegExp | string) {
    await this.selectChip(this.especieSelect, label);
  }

  async filterBySexo(label: RegExp | string) {
    await this.selectChip(this.sexoSelect, label);
  }

  async search(text: string) {
    await this.searchInput.fill(text);
  }

  async clearFilters() {
    if (await this.limpiarFiltros.isVisible().catch(() => false)) {
      await this.limpiarFiltros.click();
    }
  }

  cardsCount(): Promise<number> {
    return this.mascotaCards.count();
  }

  async openFirstCardDetails() {
    await this.mascotaCards
      .first()
      .getByRole("button", { name: /ver detalles de/i })
      .click();
  }

  /**
   * Click en "Adoptar" de la primera tarjeta con boton habilitado.
   * Devuelve la tarjeta usada por si el test quiere assertear sobre ella.
   */
  async clickAdoptOnFirstAvailableCard(): Promise<Locator> {
    const card = this.mascotaCards
      .filter({ has: this.page.getByRole("button", { name: /^adoptar$/i }) })
      .first();
    await expect(card).toBeVisible();
    await card.getByRole("button", { name: /^adoptar$/i }).click();
    return card;
  }
}

/**
 * Catalogo PUBLICO: /dashboards/mascotas
 *
 * Layout: Header (publico) + PageShell. "Adoptar" abre el modal
 * `ModalLoginRequired` (no redirige inmediatamente a /login).
 */
export class CatalogoPublicoPage extends CatalogoPage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: /mascotas disponibles/i });
  }

  async goto() {
    await this.page.goto("/dashboards/mascotas");
    await expect(this.heading).toBeVisible();
  }
}

/**
 * Catalogo PROTEGIDO: /dashboards/usuario/mascotas
 *
 * Requiere sesion con rol 2. Pensado para correr con storageState
 * generado por el setup project.
 */
export class CatalogoUsuarioPage extends CatalogoPage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", {
      name: /adopta a tu pr(o|ó)ximo amigo/i,
    });
  }

  async goto() {
    await this.page.goto("/dashboards/usuario/mascotas");
    await expect(this.heading).toBeVisible();
  }
}

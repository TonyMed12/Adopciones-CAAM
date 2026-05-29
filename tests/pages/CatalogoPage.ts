import { expect, Locator, Page } from "@playwright/test";

/**
 * Page Object para /dashboards/usuario/mascotas (catalogo publico).
 *
 * Esta vista es PUBLICA (sin sesion) y muestra el grid de mascotas.
 * Los filtros estan controlados por <ChipSelect> que es un boton + popup,
 * por eso los abrimos por aria-label y elegimos la opcion por rol option.
 */
export class CatalogoPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly especieSelect: Locator;
  readonly sexoSelect: Locator;
  readonly limpiarFiltros: Locator;
  readonly mascotaCards: Locator;
  readonly emptyState: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder(/busca por nombre/i);
    this.especieSelect = page.getByRole("button", { name: /filtrar por especie/i });
    this.sexoSelect = page.getByRole("button", { name: /filtrar por sexo/i });
    this.limpiarFiltros = page.getByRole("button", { name: /^limpiar$/i }).first();
    this.mascotaCards = page.locator('section[aria-label="Lista de mascotas"] article');
    this.emptyState = page.getByText(/no encontramos mascotas|a(u|ú)n no hay mascotas/i);
    this.heading = page.getByRole("heading", { name: /adopta a tu pr(o|ó)ximo amigo/i });
  }

  async goto() {
    await this.page.goto("/dashboards/usuario/mascotas");
    await expect(this.heading).toBeVisible();
  }

  /**
   * Espera que el feed termine de cargar (desaparezcan los skeletons)
   * y que aparezcan tarjetas o el empty state.
   */
  async waitForFeed() {
    // El skeleton se muestra mientras isLoading=true. Cuando termina,
    // aparece <section aria-label="Lista de mascotas"> o el empty state.
    await Promise.race([
      this.mascotaCards.first().waitFor({ state: "visible", timeout: 15_000 }).catch(() => null),
      this.emptyState.first().waitFor({ state: "visible", timeout: 15_000 }).catch(() => null),
    ]);
  }

  /**
   * Selecciona una opcion en un ChipSelect (boton + listbox emergente).
   */
  async selectChip(buttonLocator: Locator, optionLabel: RegExp | string) {
    await buttonLocator.click();
    const option = this.page.getByRole("option", { name: optionLabel }).first();
    await option.click();
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

  async cardsCount(): Promise<number> {
    return this.mascotaCards.count();
  }

  /**
   * Abre el modal de detalle de la primera mascota disponible
   * haciendo click en su imagen (boton "Ver detalles de ...").
   */
  async openFirstCardDetails() {
    const firstCardButton = this.mascotaCards
      .first()
      .getByRole("button", { name: /ver detalles de/i });
    await firstCardButton.click();
  }

  /**
   * Click en el boton "Adoptar" de la primera mascota disponible.
   */
  async clickAdoptOnFirstCard() {
    const card = this.mascotaCards.first();
    await card.getByRole("button", { name: /^adoptar$/i }).click();
  }
}

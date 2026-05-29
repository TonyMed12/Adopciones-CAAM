import { test, expect } from "@playwright/test";
import { CatalogoPage } from "../pages/CatalogoPage";

test.describe("Flujo 4 — Filtrado y busqueda de mascotas", () => {
  test("aplica un filtro de especie y refleja el chip activo", async ({ page }) => {
    const catalogo = new CatalogoPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    await catalogo.filterByEspecie(/perro|gato|conejo|ave|otro/i);

    // Debe aparecer la franja de "Filtros activos"
    await expect(page.getByText(/filtros activos/i)).toBeVisible();
  });

  test("filtra por sexo y muestra el chip correspondiente", async ({ page }) => {
    const catalogo = new CatalogoPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    await catalogo.filterBySexo(/macho/i);
    await expect(page.getByText(/filtros activos/i)).toBeVisible();

    // Si hay resultados, verificamos que las tarjetas mostradas sean del sexo elegido
    const visible = await catalogo.cardsCount();
    if (visible > 0) {
      // El badge de sexo se imprime con "Macho" o "Hembra"
      const badges = catalogo.mascotaCards.locator("span", { hasText: /macho/i });
      await expect(badges.first()).toBeVisible();
    }
  });

  test("busqueda por texto inexistente lleva al empty state", async ({ page }) => {
    const catalogo = new CatalogoPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    await catalogo.search("zzz-mascota-inexistente-xyz-2026");

    // La query refetches; esperamos el empty state especifico
    await expect(
      page.getByText(/no encontramos mascotas con esos filtros/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test('boton "Limpiar" remueve todos los filtros activos', async ({ page }) => {
    const catalogo = new CatalogoPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    await catalogo.search("algo-para-activar");
    await expect(page.getByText(/filtros activos/i)).toBeVisible();

    await catalogo.clearFilters();
    await expect(page.getByText(/filtros activos/i)).toHaveCount(0);
    await expect(catalogo.searchInput).toHaveValue("");
  });
});

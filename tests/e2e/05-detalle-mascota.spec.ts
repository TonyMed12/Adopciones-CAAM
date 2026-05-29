import { test, expect } from "../fixtures/test";
import { CatalogoPublicoPage } from "../pages/CatalogoPage";

/**
 * Flujo 5 — Perfil publico de una mascota.
 *
 * Catalogo publico abre un modal con el nombre + datos.
 * El perfil completo tambien existe como ruta publica en /mascota/[id].
 */
test.describe("Flujo 5 — Perfil publico de mascota", () => {
  test("desde el catalogo se puede abrir y cerrar el modal de detalle", async ({
    page,
  }) => {
    const catalogo = new CatalogoPublicoPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    test.skip(
      (await catalogo.cardsCount()) === 0,
      "Sin mascotas seed en este entorno."
    );

    const firstCard = catalogo.mascotaCards.first();
    const nombre = (await firstCard.locator("h3").first().textContent())?.trim() ?? "";
    expect(nombre.length).toBeGreaterThan(0);

    await catalogo.openFirstCardDetails();

    await expect(
      page.getByText(nombre, { exact: false }).first()
    ).toBeVisible();

    await page.getByRole("button", { name: /cerrar/i }).first().click();
    await expect(page.getByRole("button", { name: /cerrar/i })).toHaveCount(0);
  });

  test("la landing tiene un acceso publico al catalogo de mascotas", async ({
    page,
  }) => {
    await page.goto("/");

    const link = page.getByRole("link", { name: /ver mascotas/i }).first();
    await expect(link).toBeVisible();

    const href = await link.getAttribute("href");
    expect(href).toMatch(/\/dashboards\/(usuario\/)?mascotas/);
  });
});

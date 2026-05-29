import { test, expect } from "@playwright/test";
import { CatalogoPage } from "../pages/CatalogoPage";

test.describe("Flujo 5 — Perfil publico de una mascota", () => {
  test("desde el catalogo se puede abrir y cerrar el modal de detalle", async ({ page }) => {
    const catalogo = new CatalogoPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    test.skip(
      (await catalogo.cardsCount()) === 0,
      "Sin mascotas seed en este entorno — se omite."
    );

    // Capturamos el nombre de la primera mascota desde el card
    const firstCard = catalogo.mascotaCards.first();
    const nombre = (await firstCard.locator("h3").first().textContent())?.trim() ?? "";
    expect(nombre.length).toBeGreaterThan(0);

    await catalogo.openFirstCardDetails();

    // El modal contiene el nombre de la mascota (en encabezados internos)
    await expect(page.getByText(nombre, { exact: false }).first()).toBeVisible();

    // Cerrar
    await page.getByRole("button", { name: /cerrar/i }).first().click();
    await expect(page.getByRole("button", { name: /cerrar/i })).toHaveCount(0);
  });

  test("la landing tiene un acceso publico al catalogo", async ({ page }) => {
    await page.goto("/");

    // En el landing existe el link "Ver mascotas" hacia /dashboards/mascotas
    // que es la version publica del catalogo
    const link = page.getByRole("link", { name: /ver mascotas/i }).first();
    await expect(link).toBeVisible();

    // Solo verificamos el href (para evitar depender del scroll/animaciones)
    const href = await link.getAttribute("href");
    expect(href).toMatch(/\/dashboards\/(usuario\/)?mascotas/);
  });
});

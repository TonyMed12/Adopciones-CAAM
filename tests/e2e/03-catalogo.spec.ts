import { test, expect } from "@playwright/test";
import { CatalogoPage } from "../pages/CatalogoPage";

test.describe("Flujo 3 — Consulta del catalogo de mascotas", () => {
  test("carga la vista publica del catalogo con su encabezado", async ({ page }) => {
    const catalogo = new CatalogoPage(page);
    await catalogo.goto();

    await expect(catalogo.heading).toBeVisible();
    await expect(page.getByText(/mascotas disponibles/i)).toBeVisible();
  });

  test("renderiza tarjetas de mascotas o un empty state coherente", async ({ page }) => {
    const catalogo = new CatalogoPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    const total = await catalogo.cardsCount();

    if (total > 0) {
      // Cada tarjeta debe tener al menos los botones "Ver mas" y "Adoptar"
      const firstCard = catalogo.mascotaCards.first();
      await expect(firstCard.getByRole("button", { name: /ver m(a|á)s/i })).toBeVisible();
      await expect(
        firstCard.getByRole("button", { name: /^(adoptar|adoptada|en proceso|no disponible)$/i })
      ).toBeVisible();
    } else {
      await expect(catalogo.emptyState).toBeVisible();
    }
  });

  test("abre el modal de detalle al hacer click en una tarjeta", async ({ page }) => {
    const catalogo = new CatalogoPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    test.skip(
      (await catalogo.cardsCount()) === 0,
      "El catalogo esta vacio en este entorno — se omite el test de modal."
    );

    await catalogo.openFirstCardDetails();

    // El modal monta un boton de cerrar accesible
    await expect(page.getByRole("button", { name: /cerrar/i })).toBeVisible();
  });
});

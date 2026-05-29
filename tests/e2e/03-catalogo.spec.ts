import { test, expect } from "../fixtures/test";
import { CatalogoPublicoPage } from "../pages/CatalogoPage";

/**
 * Flujo 3 — Consulta del catalogo de mascotas (vista PUBLICA).
 *
 * Ruta: /dashboards/mascotas
 * Layout: Header publico + PageShell, sin requireRole.
 */
test.describe("Flujo 3 — Consulta del catalogo de mascotas", () => {
  test("carga el encabezado de la vista publica", async ({ page }) => {
    const catalogo = new CatalogoPublicoPage(page);
    await catalogo.goto();

    await expect(catalogo.heading).toBeVisible();
    await expect(page.getByText(/cat(a|á)logo/i).first()).toBeVisible();
  });

  test("renderiza tarjetas de mascotas o un empty state coherente", async ({
    page,
  }) => {
    const catalogo = new CatalogoPublicoPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    const total = await catalogo.cardsCount();

    if (total > 0) {
      const firstCard = catalogo.mascotaCards.first();
      await expect(
        firstCard.getByRole("button", { name: /ver m(a|á)s/i })
      ).toBeVisible();
      await expect(
        firstCard.getByRole("button", {
          name: /^(adoptar|adoptada|en proceso|no disponible)$/i,
        })
      ).toBeVisible();
    } else {
      await expect(catalogo.emptyState).toBeVisible();
    }
  });

  test("abre el modal de detalle al hacer click en una tarjeta", async ({
    page,
  }) => {
    const catalogo = new CatalogoPublicoPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    test.skip(
      (await catalogo.cardsCount()) === 0,
      "El catalogo esta vacio en este entorno."
    );

    await catalogo.openFirstCardDetails();

    await expect(page.getByRole("button", { name: /cerrar/i })).toBeVisible();
  });
});

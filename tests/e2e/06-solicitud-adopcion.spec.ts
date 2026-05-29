import { test, expect } from "../fixtures/test";
import { CatalogoPublicoPage } from "../pages/CatalogoPage";

/**
 * Flujo 6 — Gate de autenticacion para adoptar (vista PUBLICA).
 *
 * En /dashboards/mascotas, al hacer click en "Adoptar" sin sesion,
 * la pagina abre el componente `ModalLoginRequired` (NO redirige a
 * /login automaticamente — el usuario debe presionar el boton dentro
 * del modal). Esto es distinto del comportamiento en /mascota/[id],
 * donde MascotaPublicAdoptButton SI hace router.push("/login")
 * directamente.
 *
 * La variante autenticada del flujo vive en tests/e2e/auth/ y reutiliza
 * la sesion compartida via storageState (project "authenticated").
 */
test.describe("Flujo 6 — Inicio del proceso de adopcion (sin sesion)", () => {
  test("click en Adoptar abre el modal 'Inicia sesion para adoptar'", async ({
    page,
  }) => {
    const catalogo = new CatalogoPublicoPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    test.skip(
      (await catalogo.cardsCount()) === 0,
      "Sin mascotas seed en este entorno."
    );

    await catalogo.clickAdoptOnFirstAvailableCard();

    await expect(
      page.getByRole("heading", { name: /inicia sesi(o|ó)n para adoptar/i })
    ).toBeVisible();
    await expect(
      page.getByText(/necesitas una cuenta para comenzar/i)
    ).toBeVisible();
  });

  test("desde el modal, 'Iniciar sesion' redirige a /login", async ({ page }) => {
    const catalogo = new CatalogoPublicoPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    test.skip(
      (await catalogo.cardsCount()) === 0,
      "Sin mascotas seed en este entorno."
    );

    await catalogo.clickAdoptOnFirstAvailableCard();

    await page
      .getByRole("button", { name: /^iniciar sesi(o|ó)n$/i })
      .first()
      .click();

    await page.waitForURL(/\/login/i, { timeout: 10_000 });
    expect(page.url()).toMatch(/\/login/);
  });
});

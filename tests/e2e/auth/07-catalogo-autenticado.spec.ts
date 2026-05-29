import { test, expect } from "../../fixtures/test";
import { CatalogoUsuarioPage } from "../../pages/CatalogoPage";

/**
 * Project "authenticated" — reutiliza la sesion creada en el setup
 * (`tests/setup/auth.setup.ts`) via storageState. NO realiza login
 * en ningun momento, por lo que no consume cuota del rate limiter.
 *
 * Cubre la variante autenticada de los flujos 3 y 6:
 *  - Acceso al catalogo protegido (/dashboards/usuario/mascotas).
 *  - Click en Adoptar con sesion -> el hook real reacciona.
 */
test.describe("Catalogo protegido con sesion reutilizada", () => {
  test("entra a /dashboards/usuario/mascotas sin re-loguear", async ({ page }) => {
    const catalogo = new CatalogoUsuarioPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    await expect(catalogo.heading).toBeVisible();
  });

  test("con sesion valida, Adoptar inicia el flujo real", async ({ page }) => {
    const catalogo = new CatalogoUsuarioPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    test.skip(
      (await catalogo.cardsCount()) === 0,
      "Sin mascotas seed en este entorno."
    );

    await catalogo.clickAdoptOnFirstAvailableCard();

    // El hook `useIniciarAdopcionMascota` puede producir tres resultados
    // segun el estado del perfil:
    //  - overlay/redireccion "Procesando solicitud..."  -> URL .../adopcion
    //  - modal de validacion de documentos
    //  - toast "Ya tienes una adopcion/cita activa"
    const overlay = page.getByText(/procesando solicitud|adopci(o|ó)n/i).first();
    const modalDocs = page.getByText(/documentos|validar|completar/i).first();
    const toast = page.getByText(/ya tienes una (adopci(o|ó)n|cita)/i).first();

    await expect(overlay.or(modalDocs).or(toast)).toBeVisible({
      timeout: 20_000,
    });
  });
});

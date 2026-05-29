import { test, expect } from "@playwright/test";
import { CatalogoPage } from "../pages/CatalogoPage";
import { LoginPage } from "../pages/LoginPage";
import { env, hasValidCredentials } from "../helpers/env";

test.describe("Flujo 6 — Inicio del proceso de adopcion", () => {
  test("sin sesion, clickear Adoptar redirige al login (gate de autenticacion)", async ({
    page,
  }) => {
    const catalogo = new CatalogoPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    test.skip(
      (await catalogo.cardsCount()) === 0,
      "Sin mascotas seed en este entorno — se omite."
    );

    // Buscamos una tarjeta cuyo boton este habilitado ("Adoptar")
    const adoptable = catalogo.mascotaCards
      .filter({
        has: page.getByRole("button", { name: /^adoptar$/i }),
      })
      .first();

    await expect(adoptable).toBeVisible();
    await adoptable.getByRole("button", { name: /^adoptar$/i }).click();

    // El flujo sin sesion debe llevar a /login
    await page.waitForURL(/\/login/i, { timeout: 15_000 });
    expect(page.url()).toMatch(/\/login/);
  });

  test("con sesion valida, Adoptar inicia el flujo (o redirige al dashboard de adopcion)", async ({
    page,
  }) => {
    test.skip(
      !hasValidCredentials(),
      "Define E2E_USER_EMAIL y E2E_USER_PASSWORD en .env.test para correr este caso."
    );

    // 1. Login
    const login = new LoginPage(page);
    await login.goto();
    await login.login(env.validUserEmail, env.validUserPassword);
    await page.waitForURL(/\/dashboards\//i, { timeout: 20_000 });

    // 2. Catalogo
    const catalogo = new CatalogoPage(page);
    await catalogo.goto();
    await catalogo.waitForFeed();

    test.skip((await catalogo.cardsCount()) === 0, "Sin mascotas seed — se omite.");

    const adoptable = catalogo.mascotaCards
      .filter({ has: page.getByRole("button", { name: /^adoptar$/i }) })
      .first();
    await adoptable.getByRole("button", { name: /^adoptar$/i }).click();

    // El hook `useIniciarAdopcionMascota` puede:
    //  - abrir overlay de adopcion en progreso  -> URL pasa a /adopcion
    //  - abrir modal de docs incompletos        -> visible "Validar documentos"
    //  - mostrar toast de solicitud/cita activa
    // Cualquiera de esos resultados es valido para considerar el flujo "iniciado".
    const enProceso = page.getByText(/procesando solicitud|adopci(o|ó)n/i).first();
    const modalDocs = page.getByText(/documentos|validar|completar/i).first();
    const toast = page.getByText(/ya tienes una (adopci(o|ó)n|cita)/i).first();

    await expect(
      enProceso.or(modalDocs).or(toast)
    ).toBeVisible({ timeout: 15_000 });
  });
});

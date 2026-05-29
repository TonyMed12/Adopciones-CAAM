/**
 * Setup project: ejecuta el login UNA sola vez por corrida de la suite y
 * guarda el estado de la sesion (cookies + localStorage) en
 * `tests/.auth/user.json`. Los tests que necesitan sesion lo reutilizan via
 * `storageState` en su project, evitando logins repetidos que dispararian
 * el rate limit de `/api/auth/login`.
 *
 * Si no hay credenciales E2E configuradas, el setup se omite y los tests
 * que dependen de el tambien (degradacion con gracia).
 */

import path from "path";
import fs from "fs";
import { test as setup, expect } from "../fixtures/test";
import { LoginPage } from "../pages/LoginPage";
import { env, hasValidCredentials } from "../helpers/env";

export const AUTH_FILE = path.resolve("tests/.auth/user.json");

setup("autenticar usuario E2E (reutilizable)", async ({ page, context }) => {
  setup.skip(
    !hasValidCredentials(),
    "Define E2E_USER_EMAIL y E2E_USER_PASSWORD en .env.test para generar la sesion compartida."
  );

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  const login = new LoginPage(page);
  await login.goto();
  await login.login(env.validUserEmail, env.validUserPassword);

  // El backend redirige por rol al dashboard correspondiente.
  await page.waitForURL(/\/dashboards\/(usuario|administrador)(\/|$)/i, {
    timeout: 30_000,
  });

  // Sanidad: cookie de sesion presente (BetterAuth o Supabase)
  const cookies = await context.cookies();
  expect(
    cookies.some(
      (c) =>
        c.name.includes("better-auth") ||
        (c.name.startsWith("sb-") && c.name.endsWith("-auth-token"))
    ),
    "No se encontro cookie de sesion despues del login"
  ).toBeTruthy();

  await context.storageState({ path: AUTH_FILE });
});

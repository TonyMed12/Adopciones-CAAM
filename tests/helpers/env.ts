/**
 * Centraliza el acceso a variables de entorno usadas por la suite E2E.
 * Asi evitamos referencias dispersas a `process.env.*` y normalizamos
 * el manejo de valores opcionales.
 */

export const env = {
  baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",

  /** Usuario de prueba ya registrado (login valido). Opcional. */
  validUserEmail: process.env.E2E_USER_EMAIL ?? "",
  validUserPassword: process.env.E2E_USER_PASSWORD ?? "",

  /**
   * Si es "1", el flujo de registro se detiene antes del submit final.
   * Util para correr la suite sin escribir en Supabase.
   */
  registerDryRun: process.env.E2E_REGISTER_DRY_RUN === "1",
};

export function hasValidCredentials(): boolean {
  return !!env.validUserEmail && !!env.validUserPassword;
}

/**
 * Custom test fixture para la suite E2E de CAAM.
 *
 * PROBLEMA ORIGINAL
 * -----------------
 * `src/lib/rate-limit.ts` mantiene un `Map<string, RateLimitRecord>` en memoria
 * y limita a 5 requests por minuto por IP. Los endpoints derivan la IP asi:
 *
 *     request.headers.get("x-forwarded-for") || ... || "local"
 *
 * Por defecto Playwright NO envia `x-forwarded-for`, asi que TODOS los tests
 * comparten el bucket `"local"`. Cuando la suite supera 5 llamadas a
 * /api/auth/{login,register,check-email} en menos de 60s, el limiter
 * devuelve 429 y los tests caen en cascada.
 *
 * SOLUCION
 * --------
 * Este fixture sobreescribe `extraHTTPHeaders` (opcion nativa de Playwright)
 * para inyectar un `x-forwarded-for` UNICO por test (combinacion de
 * workerIndex + contador monotonico). Asi cada test recibe su propio
 * bucket de 5 req/min y la suite completa puede correrse sin disparar
 * 429s, SIN modificar el codigo de produccion.
 *
 * Usamos la opcion nativa (en vez de sobreescribir `context`) para no
 * perder otras opciones del project (viewport, locale, storageState,
 * timezoneId, etc.) — Playwright las merge-a automaticamente.
 */

import { test as base } from "@playwright/test";

let monotonic = 0;

function uniqueIpFor(workerIndex: number): string {
  // Rango privado 10.x.x.x. workerIndex en B, contador en C y D.
  const n = ++monotonic;
  const c = Math.floor(n / 250) % 250;
  const d = n % 250;
  return `10.${workerIndex + 1}.${c}.${d + 1}`;
}

export const test = base.extend({
  extraHTTPHeaders: async ({}, use, testInfo) => {
    const ip = uniqueIpFor(testInfo.workerIndex);
    await use({
      // El rate limiter usa este header como primera fuente para
      // identificar la IP. Cada test recibe una IP unica -> bucket
      // independiente de 5 req/min.
      "x-forwarded-for": ip,
      "x-real-ip": ip,
    });
  },
});

export { expect } from "@playwright/test";

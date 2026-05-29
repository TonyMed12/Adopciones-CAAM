/**
 * Generador de datos de prueba unicos y deterministas para la suite E2E.
 *
 * Los formatos respetan EXACTAMENTE las validaciones reales del proyecto:
 *  - Email: zod `.email()` (RFC 5322) + check-email API
 *  - CURP : `/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/`
 *           4 letras + YYMMDD + H/M + 5 letras + 1 alfanumerico + 1 digito
 *  - Tel  : `/^(\+52\s?)?(\d{3}\s?\d{3}\s?\d{4}|\d{10})$/`
 *  - Pass : >=8 chars, al menos 1 minuscula, 1 mayuscula, 1 digito
 *  - Nombre/Apellido: solo letras (regex `^[a-zA-ZÀ-ÿñÑ\s]+$`)
 *  - Fecha: edad entre 18 y 100 (component valida en onChange via window.validarEdad)
 */

const APELLIDOS = ["Garcia", "Lopez", "Hernandez", "Martinez", "Rodriguez"];
const NOMBRES = ["Juan", "Maria", "Carlos", "Lucia", "Pedro", "Ana"];
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const ALPHANUM = LETTERS + DIGITS;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomFrom(charset: string, n: number): string {
  let out = "";
  for (let i = 0; i < n; i++) {
    out += charset[Math.floor(Math.random() * charset.length)];
  }
  return out;
}

/**
 * Sufijo unico (base36) para emails y otros campos que requieren unicidad.
 */
function uniqueSuffix(): string {
  const ts = Date.now().toString(36).slice(-6);
  const rnd = Math.random().toString(36).slice(2, 6);
  return `${ts}${rnd}`;
}

/**
 * Genera una CURP que cumple el regex oficial usado por la app.
 * No corresponde a una persona real, pero pasa la validacion
 * de formato Y es unica por corrida (la API rechaza duplicados).
 */
export function generateCurp(): string {
  // 1-4: 4 letras (iniciales). Usamos un prefijo determinista "EETE"
  //      para identificar facilmente registros generados por la suite.
  const initials = "EETE";

  // 5-10: YYMMDD plausible (anio 60-89 para usuarios adultos)
  const yy = String(60 + Math.floor(Math.random() * 30)).padStart(2, "0");
  const mm = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
  const dd = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");

  // 11: sexo
  const sex = Math.random() < 0.5 ? "H" : "M";

  // 12-16: 5 letras del lugar de nacimiento
  const place = randomFrom(LETTERS, 5);

  // 17: alfanumerico (la consonante interna en CURPs reales; aqui aleatorio)
  const consonant = randomFrom(ALPHANUM, 1);

  // 18: digito final (homoclave)
  const homoclave = randomFrom(DIGITS, 1);

  return `${initials}${yy}${mm}${dd}${sex}${place}${consonant}${homoclave}`;
}

export interface TestUser {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  telefono: string;
  fecha_nacimiento_iso: string; // YYYY-MM-DD, util para crear via API
  fechaYear: number;
  fechaMonth: number; // 1-12
  fechaDay: number; // 1-31
  curp: string;
  ocupacion: string;
  password: string;
}

/**
 * Genera un usuario de prueba unico, valido para todo el flujo de registro.
 *
 * Por defecto usa dominio `@e2e.caam.test` (RFC valido pero claramente de pruebas).
 * Si la instancia Supabase rechaza ese TLD, puede sobreescribirse via override.
 */
export function generateTestUser(overrides: Partial<TestUser> = {}): TestUser {
  const suffix = uniqueSuffix();

  // Fecha fija (mayor de edad), variando solo el dia para evitar
  // colisiones poco probables pero posibles si dos usuarios comparten todo.
  const day = 1 + (Date.now() % 27);

  return {
    nombres: pick(NOMBRES),
    apellido_paterno: pick(APELLIDOS),
    apellido_materno: pick(APELLIDOS),
    email: `e2e.${suffix}@e2e.caam.test`,
    telefono: "4431234567",
    fecha_nacimiento_iso: `1995-01-${String(day).padStart(2, "0")}`,
    fechaYear: 1995,
    fechaMonth: 1,
    fechaDay: day,
    curp: generateCurp(),
    ocupacion: "Estudiante",
    password: "Caam2025E2e",
    ...overrides,
  };
}

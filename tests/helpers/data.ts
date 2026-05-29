/**
 * Generador de datos de prueba unicos y deterministas para la suite E2E.
 *
 * Estrategia:
 *  - Cada corrida genera un sufijo unico (timestamp + random) para evitar
 *    colisiones de email/curp entre ejecuciones repetidas.
 *  - Los CURPs producidos cumplen la longitud (18 chars) que la app valida,
 *    aunque NO sean CURPs validos del registro civil (no nos interesa, la
 *    app solo valida largo).
 */

const APELLIDOS = ["Garcia", "Lopez", "Hernandez", "Martinez", "Rodriguez"];
const NOMBRES = ["Juan", "Maria", "Carlos", "Lucia", "Pedro", "Ana"];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uniqueSuffix(): string {
  // 6 digitos timestamp + 4 random alfanumericos
  const ts = Date.now().toString(36).slice(-6);
  const rnd = Math.random().toString(36).slice(2, 6);
  return `${ts}${rnd}`.toUpperCase();
}

export interface TestUser {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string; // formato dd/MM/yyyy para el DatePicker
  curp: string; // 18 chars
  ocupacion: string;
  password: string;
}

/**
 * Genera un usuario de prueba unico, ideal para registro.
 * El email queda como `e2e+<sufijo>@caam-tests.local`.
 */
export function generateTestUser(overrides: Partial<TestUser> = {}): TestUser {
  const suffix = uniqueSuffix();

  // CURP de 18 chars: 4 letras + 6 digitos (fecha) + H + 5 letras + 2 chars finales
  // Construimos algo determinista en longitud aunque no sea valido oficialmente.
  const curp = `TEST${"010190"}H${"DFXXX"}${suffix.slice(0, 2)}`.slice(0, 18).padEnd(18, "X");

  return {
    nombres: pick(NOMBRES),
    apellido_paterno: pick(APELLIDOS),
    apellido_materno: pick(APELLIDOS),
    email: `e2e+${suffix.toLowerCase()}@caam-tests.local`,
    telefono: "4431234567",
    fecha_nacimiento: "01/01/1995",
    curp,
    ocupacion: "Estudiante",
    password: "Caam2025#E2E",
    ...overrides,
  };
}

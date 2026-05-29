# CAAM — Suite de pruebas E2E con Playwright

Suite de pruebas end-to-end para el sistema **CAAM (Centro de Atención Animal de Morelia)**, una plataforma web construida con **Next.js 15 + TypeScript + Supabase** para la gestión de adopciones de mascotas, citas, documentación y seguimiento post-adopción.

---

## Integrantes del equipo

> _Edita esta sección con los nombres y matrículas reales antes de entregar._

- `<Integrante 1>`
- `<Integrante 2>`
- `<Integrante 3>`

---

## Herramienta utilizada

**[Playwright](https://playwright.dev/)** (`@playwright/test ^1.55`).

Razones de la elección:

- **Multi-navegador real** (Chromium, Firefox, WebKit) con una sola API.
- **Auto-waiting** en todos los locators → menos `sleep`/`waitFor` manuales, menos *flaky tests*.
- **Trace viewer + video + screenshots** automáticos al fallar, ideales como evidencia.
- **Test runner integrado** con paralelización, reportes HTML y modo UI interactivo.
- Se alinea con el stack del proyecto: TypeScript de primera clase y arranque automático del `webServer` de Next.js sin scripts externos.
- Ya estaba listado como `devDependency` en el proyecto, así que su integración es natural.

---

## Estructura del proyecto de pruebas

```
.
├── playwright.config.ts          # Configuración global de Playwright
├── .env.test.example             # Plantilla de variables de entorno E2E
├── tests/
│   ├── e2e/                      # Specs de los 6 flujos
│   │   ├── 01-registro.spec.ts
│   │   ├── 02-login.spec.ts
│   │   ├── 03-catalogo.spec.ts
│   │   ├── 04-filtrado.spec.ts
│   │   ├── 05-detalle-mascota.spec.ts
│   │   └── 06-solicitud-adopcion.spec.ts
│   ├── pages/                    # Page Objects (POM)
│   │   ├── LoginPage.ts
│   │   ├── RegistroPage.ts
│   │   └── CatalogoPage.ts
│   └── helpers/                  # Utilidades reutilizables
│       ├── data.ts               # Generador de usuarios únicos
│       └── env.ts                # Acceso centralizado a variables de entorno
├── playwright-report/            # Reporte HTML (auto-generado, ignored)
└── test-results/                 # Trazas / videos / screenshots (auto-generado, ignored)
```

**Patrones aplicados:**

- **Page Object Model** para aislar selectores y mantener tests declarativos.
- **Helpers + fixtures** para datos de prueba únicos por corrida.
- **`test.skip` condicional** para que la suite degrade con gracia en entornos sin Supabase o sin seed de mascotas.

---

## Requisitos previos

- **Node.js** ≥ 18
- **npm** (viene con Node)
- (Opcional) Supabase del proyecto en funcionamiento para los flujos de submit real.

---

## Instalación

```bash
# 1. Instalar dependencias del proyecto (incluye @playwright/test)
npm install

# 2. Instalar el navegador de Playwright (Chromium)
npm run test:e2e:install
```

## Configuración del entorno de pruebas

Copia la plantilla de variables y rellena los valores que apliquen:

**PowerShell (Windows):**
```powershell
Copy-Item .env.test.example .env.test
```

**Bash (Linux/macOS):**
```bash
cp .env.test.example .env.test
```

Contenido de `.env.test`:

```env
# URL base de la app (cambia el puerto si lo necesitas)
E2E_BASE_URL=http://localhost:3000
E2E_PORT=3000

# Si la app ya está corriendo, evita que Playwright la levante otra vez:
# E2E_SKIP_WEBSERVER=1

# Usuario YA registrado en Supabase para probar el flujo de login válido.
# Si lo dejas vacío, los casos que requieren sesión se omiten automáticamente.
E2E_USER_EMAIL=
E2E_USER_PASSWORD=

# Si vale "1", el flujo de registro NO ejecuta el submit final
# (valida toda la UI multi-paso sin escribir en Supabase). Recomendado para CI.
E2E_REGISTER_DRY_RUN=1
```

> El archivo `.env.test` está en `.gitignore` y nunca se commitea.

---

## Ejecución

| Comando | Descripción |
|---|---|
| `npm run test:e2e` | Corre toda la suite en headless (default) |
| `npm run test:e2e:headed` | Igual, pero con el navegador visible |
| `npm run test:e2e:ui` | Abre el **UI Mode** interactivo de Playwright |
| `npm run test:e2e:debug` | Ejecución paso a paso con Inspector |
| `npm run test:e2e:report` | Abre el reporte HTML generado |

Ejemplos:

```bash
# Toda la suite
npm run test:e2e

# Solo un flujo
npx playwright test tests/e2e/02-login.spec.ts

# Un test específico por nombre
npx playwright test -g "rechaza credenciales invalidas"

# Modo UI (recomendado para desarrollo)
npm run test:e2e:ui
```

El `webServer` de Playwright arranca `npm run dev` automáticamente. Si ya tienes la app corriendo en `http://localhost:3000`, la reutiliza.

---

## Los 6 flujos automatizados

Cada flujo representa un proceso real y de valor dentro del sistema CAAM. No son pruebas redundantes ni triviales — combinan navegación, llenado de formularios, validaciones, gates de autenticación y consumo de datos del backend.

### Flujo 1 — Registro de usuario adoptante (`01-registro.spec.ts`)

Valida el formulario multi-paso de alta de adoptante (`/register`):

- Renderizado y navegación entre los **3 pasos** (datos personales → datos adicionales → contraseña y términos).
- Mensajes de **campo requerido** cuando el paso 1 está vacío.
- **Bloqueo de avance** ante email mal formado.
- Detección en tiempo real de **contraseñas que no coinciden**.
- **Indicador en vivo** de los requisitos de la contraseña (longitud, mayúsculas, minúsculas, números).
- (Opcional) Registro **end-to-end** real con redirección a `/pendiente` cuando `E2E_REGISTER_DRY_RUN=0`.

### Flujo 2 — Inicio de sesión (`02-login.spec.ts`)

Cubre la pantalla `/login` y el endpoint `POST /api/auth/login`:

- Render del formulario y de los botones de **OAuth** (Google, GitHub).
- Validación de campos vacíos con el mensaje del frontend.
- Rechazo de credenciales inválidas con `role="alert"` mostrando el error del backend.
- (Opcional) Login válido y **redirección por rol** al dashboard de usuario o administrador.

### Flujo 3 — Consulta del catálogo de mascotas (`03-catalogo.spec.ts`)

Vista pública en `/dashboards/usuario/mascotas`:

- Carga del encabezado y la sección "Mascotas disponibles".
- Render de **tarjetas** con sus botones de acción, o **empty state** si no hay datos.
- Apertura del **modal de detalle** al clickear "Ver detalles de ...".

### Flujo 4 — Filtrado y búsqueda (`04-filtrado.spec.ts`)

Interacción con el componente `Filters`:

- Filtro por **especie** vía `ChipSelect` (popup accesible).
- Filtro por **sexo** y verificación de que los badges de los resultados coinciden.
- Búsqueda con texto inexistente → **empty state** específico ("No encontramos mascotas con esos filtros").
- Botón **"Limpiar"** que remueve todos los chips activos y resetea el input.

### Flujo 5 — Perfil público de una mascota (`05-detalle-mascota.spec.ts`)

- Captura el nombre de la primera mascota del catálogo, abre el modal de detalle y **verifica que el nombre coincide**; luego lo cierra.
- Confirma que la **landing pública** (`/`) contiene un acceso (`Ver mascotas`) hacia el catálogo público.

### Flujo 6 — Inicio del proceso de adopción (`06-solicitud-adopcion.spec.ts`)

Valida el **gate de autenticación** del flujo de adopción:

- **Sin sesión**: click en "Adoptar" en una tarjeta → redirección a `/login`.
- (Opcional, con `E2E_USER_*` configurado) **Con sesión válida**: el hook `useIniciarAdopcionMascota` reacciona según el estado del usuario y se valida que aparezca alguno de los resultados esperados:
  - Overlay "Procesando solicitud..."
  - Modal de validación de documentos
  - Toast de "Ya tienes una adopción/cita activa"

---

## Estrategia de datos de prueba

- **Datos únicos por corrida**: `helpers/data.ts` genera un sufijo `timestamp + random` para email y CURP, evitando colisiones entre ejecuciones.
- **Dry-run de registro** (`E2E_REGISTER_DRY_RUN=1`): permite correr la suite sin escribir en Supabase. Pensado para CI.
- **Login válido opcional**: si `E2E_USER_EMAIL`/`E2E_USER_PASSWORD` no están definidos, los casos que requieren sesión se `skip` automáticamente.
- **Catálogo vacío**: cada test que depende de tarjetas hace `test.skip` cuando `cardsCount === 0`, evitando falsos rojos en entornos sin seed.
- **Sin necesidad de cleanup**: el aislamiento por sufijo único hace que ejecuciones repetidas no choquen.

---

## Reportes y evidencias

Tras cualquier ejecución se generan automáticamente:

- **`playwright-report/index.html`** — reporte HTML navegable (abrir con `npm run test:e2e:report`).
- **`test-results/<test>/`** — para cada test fallido se guarda:
  - `trace.zip` (línea de tiempo + DOM snapshots, abrir con `npx playwright show-trace`)
  - `screenshot.png` al momento del fallo
  - `video.webm` de toda la ejecución

> Estos directorios están ignorados por git pero deben quedar disponibles localmente para anexar evidencias al entregable.

---

## Resultados esperados

En un entorno con Supabase configurado y con seed de mascotas:

- **Flujo 1**: 6/6 tests verdes (5 sin tocar BD + 1 end-to-end).
- **Flujo 2**: 4/4 tests verdes (incluyendo login válido).
- **Flujo 3, 4, 5**: 100% verdes.
- **Flujo 6**: 2/2 tests verdes.

En entornos sin BD o sin seed: los casos opcionales se marcan como `skipped` (no `failed`), de modo que la suite sigue siendo verde y demuestra resiliencia.

---

## Solución de problemas

| Síntoma | Causa probable / Acción |
|---|---|
| `webServer Timed out waiting 120000ms` | El dev server no arrancó. Lánzalo manual (`npm run dev`) y pon `E2E_SKIP_WEBSERVER=1`. |
| Tests del catálogo se `skip` | No hay seed de mascotas en Supabase. Pobla la tabla `mascotas` con datos de prueba. |
| Login válido falla con 401 | Verifica `E2E_USER_EMAIL`/`E2E_USER_PASSWORD` y que el usuario tenga el email confirmado. |
| Registro real falla por "email ya existe" | El sufijo único debería evitarlo; revisa que no haya un proxy/cache cacheando respuestas. |
| `Browser not found` | Ejecuta `npm run test:e2e:install` para instalar Chromium. |

---

## Posibles mejoras a futuro

- Añadir **proyectos** en `playwright.config.ts` para correr Firefox y WebKit además de Chromium.
- Seed determinista vía cliente admin de Supabase en `globalSetup` (crear/limpiar usuario y mascotas de prueba automáticamente).
- Integración en **CI (GitHub Actions)** con publicación del reporte HTML como artefacto.
- Pruebas de **flujos de administrador** (validar documentos, aprobar adopciones, alta de mascotas) reutilizando los Page Objects existentes.
- Cobertura del flujo de **agendar cita** y **seguimiento post-adopción** una vez que exista un usuario seed aprobado.

---

## Licencia

Uso académico — Materia de Pruebas de Software.

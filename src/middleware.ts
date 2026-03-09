export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";
import { auth } from "@/lib/auth";

const PUBLIC_PATHS = [
  "/",
  "/adopciones",
  "/quienes-somos",
  "/contacto",
  "/login",
  "/registro",
  "/recuperacion",
  "/recuperacion/reestablecer_contrasena",
  "/verificar-email",
  "/confirmado",
  "/pendiente",
  "/dashboards/usuario/mascotas",
  "/dashboards/mascotas",
  "/dashboards/usuarios",
  "/nosotros",
  "/usuario/adopcion",
  "/mascota",
  "/auth/redirect",
  "/redirect",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Middleware activado para:", pathname);

  // archivos estáticos
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // APIs públicas
  if (pathname.startsWith("/api/email/")) {
    return NextResponse.next();
  }

  // auth APIs
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // rutas públicas
  if (
    PUBLIC_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    )
  ) {
    return NextResponse.next();
  }

  // intentar sesión BetterAuth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session?.user?.email) {
    console.log("Sesion BetterAuth:", session.user.email);
    return NextResponse.next();
  }

  // actualizar sesión Supabase
  const response = await updateSession(request);

  // verificar cookie de sesión Supabase
  const supabaseCookie = request.cookies
    .getAll()
    .find((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));

  if (supabaseCookie) {
    return response;
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
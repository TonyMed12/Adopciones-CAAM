// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = [
  "/",                 // landing
  "/adopciones",
  "/quienes-somos",
  "/contacto",
  "/login",
  "/registro",
  "/recuperacion",
  "/verificar-email",
  "/dashboards/administrador/mascotas",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Deja pasar estáticos y assets
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Deja pasar rutas públicas
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Para el resto, aplica tu lógica de sesión Supabase
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

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
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/recover",
  "/api/auth/check-email",
  "/api/auth/reset-password",   
  "/api/email/send",      
  "/api/email/registro",     
  "/api/email/reenviar",       
  "/mascota",
  "/api/email/documento",
  
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middleware activado para:", pathname);

  // Permitir archivos estáticos
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

// PERMITIR CUALQUIER PUTISIMO CORREO
if (pathname.startsWith("/api/email/")) {
  return NextResponse.next();
}


  // Permitir rutas públicas
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Resto de rutas requieren sesión
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

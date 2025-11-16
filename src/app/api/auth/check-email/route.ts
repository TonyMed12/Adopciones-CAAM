import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, curp, action } = body;

    // Si la acción es verificar CURP
    if (action === "check-curp") {
      if (!curp) {
        return NextResponse.json(
          { error: "CURP es requerido" },
          { status: 400 }
        );
      }

      // Verificar si el CURP ya existe en la tabla perfiles
      const { data: perfiles, error: perfilesError } = await supabaseAdmin
        .from("perfiles")
        .select("curp")
        .eq("curp", curp.toUpperCase())
        .limit(1);

      if (perfilesError) {
        return NextResponse.json(
          { error: "Error al verificar CURP" },
          { status: 500 }
        );
      }

      const curpExists = perfiles && perfiles.length > 0;

      return NextResponse.json({ 
        exists: curpExists,
        available: !curpExists 
      }, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Si no, verificar email (comportamiento por defecto)
    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe en auth.users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      return NextResponse.json(
        { error: "Error al verificar email" },
        { status: 500 }
      );
    }

    // Buscar si el email ya está registrado (case-insensitive)
    const emailExists = authUsers.users.some(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    );

    return NextResponse.json({ 
      exists: emailExists,
      available: !emailExists 
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Error desconocido";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Endpoint de prueba GET (opcional - puedes eliminarlo si quieres)
export async function GET() {
  return NextResponse.json({ 
    message: "API check-email funcionando",
    method: "Use POST con {email: 'tu@email.com'} o {curp: 'CURP...', action: 'check-curp'}"
  });
}
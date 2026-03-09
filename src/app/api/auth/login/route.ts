import { NextResponse } from 'next/server';
import { signInWithEmail } from '@/services/auth.service';
import { LoginSchema } from '@/utils/zod-schemas';
import { rateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {

    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "local";

    const allowed = rateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta nuevamente en un minuto." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', issues: validation.error.issues },
        { status: 400 }
      );
    }

    const result = await signInWithEmail(validation.data);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "No se pudo obtener el usuario." },
        { status: 500 }
      );
    }

    const { data: perfil } = await supabase
      .from("perfiles")
      .select("rol_id")
      .eq("email", user.email)
      .single();

    return NextResponse.json(
      {
        message: "Inicio de sesión exitoso",
        rol: perfil?.rol_id
      },
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Ocurrió un error inesperado.' },
      { status: 500 }
    );
  }
}
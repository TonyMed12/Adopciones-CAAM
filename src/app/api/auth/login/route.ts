import { NextResponse } from 'next/server';
import { signInWithEmail } from '@/services/auth.service';
import { LoginSchema } from '@/utils/zod-schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      // Detalles de los errores encontrados de Zod.
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', issues: validation.error.issues },
        { status: 400 }
      );
    }

    const { error } = await signInWithEmail(validation.data);

    if (error) {
      // Si srvicio devuelve un error
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { message: 'Inicio de sesión exitoso' },
      { status: 200 }
    );
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Ocurrió un error inesperado.' }, { status: 500 });
  }
}


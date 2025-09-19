import { NextResponse } from 'next/server';
import { signInWithEmail } from '@/services/auth.service';
import { LoginSchema } from '@/utils/zod-schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      // Si la validación falla, devolvemos un error 400
      // con los detalles de los errores encontrados por Zod.
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', issues: validation.error.issues },
        { status: 400 }
      );
    }

    // Si los datos son válidos, llamamos a nuestra función de servicio
    // pasándole los datos ya limpios y validados.
    const { error } = await signInWithEmail(validation.data);

    if (error) {
      // Si el servicio devuelve un error
      // devolvemos un error 401.
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Si no hubo errores, la sesión se inició correctamente en Supabase.
    // Devolvemos una respuesta 200.
    return NextResponse.json(
      { message: 'Inicio de sesión exitoso' },
      { status: 200 }
    );
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Ocurrió un error inesperado.' }, { status: 500 });
  }
}


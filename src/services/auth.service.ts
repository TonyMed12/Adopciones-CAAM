
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import type { LoginPayload } from '@/utils/zod-schemas';

export async function signInWithEmail(payload: LoginPayload) {
  const cookieStore = cookies();
  

  const supabase = createClient(cookieStore);
  
  // Extraemos los datos del payload.
  const { correo, contrasena } = payload;

  const { error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: contrasena,
  });


  if (error) {
    return {
      success: false,
      message: error.message,
      error: error,
    };
  }

  return {
    success: true,
    message: 'Inicio de sesión exitoso.',
  };
}
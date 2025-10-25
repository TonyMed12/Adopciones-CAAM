// src/services/perfil.service.ts

import { createClient } from '@/lib/supabase/server';
import type { Perfil, User } from '@/data/user/types';
import { perfilToUser } from '@/data/user/types';

/**
 * Obtiene el perfil del usuario actual autenticado
 */
export async function getCurrentPerfil() {
  const supabase = await createClient();

  try {
    // 1. Obtener usuario autenticado
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return { 
        success: false, 
        error: 'Usuario no autenticado',
        perfil: null 
      };
    }

    // 2. Obtener perfil completo
    const { data: perfil, error: perfilError } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (perfilError) {
      console.error('Error obteniendo perfil:', perfilError);
      return { 
        success: false, 
        error: 'Error al obtener perfil: ' + perfilError.message,
        perfil: null 
      };
    }

    // 3. Convertir a formato User para la UI
    const user = perfilToUser(perfil as Perfil);

    return { 
      success: true, 
      perfil: user 
    };

  } catch (error) {
    console.error('Error inesperado:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return {
      success: false,
      error: 'Error inesperado: ' + errorMessage,
      perfil: null
    };
  }
}

/**
 * Actualiza el perfil del usuario
 */
export async function updatePerfil(
  perfilId: string,
  updates: Partial<Perfil>
) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('perfiles')
      .update(updates)
      .eq('id', perfilId)
      .select()
      .single();

    if (error) {
      return { 
        success: false, 
        error: 'Error al actualizar perfil: ' + error.message,
        perfil: null 
      };
    }

    const user = perfilToUser(data as Perfil);
    return { 
      success: true, 
      perfil: user 
    };

  } catch (error) {
    console.error('Error inesperado:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return {
      success: false,
      error: 'Error inesperado: ' + errorMessage,
      perfil: null
    };
  }
}

export type PerfilResponse = {
  success: boolean;
  perfil: User | null;
  error?: string;
};

export async function obtenerPerfilActual(): Promise<PerfilResponse> {
  try {
    const supabase = await createClient();
    
    // Obtener usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'No autenticado',
        perfil: null
      };
    }

    // Buscar perfil por email
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('email', user.email)
      .single();

    if (error) {
      console.error('Error obteniendo perfil:', error);
      return {
        success: false,
        error: error.message,
        perfil: null
      };
    }

    return {
      success: true,
      perfil: perfilToUser(data)
    };
  } catch (error) {
    console.error('Error inesperado:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return {
      success: false,
      error: 'Error inesperado: ' + errorMessage,
      perfil: null
    };
  }
}
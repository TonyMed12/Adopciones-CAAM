"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  Direccion,
  Documento,
  Perfil,
  SolicitudAdopcionMin as SolicitudAdopcion,
} from "./perfil";

export async function obtenerPerfilActual(): Promise<{
  perfil: Perfil | null;
  direccion: Direccion | null;
  solicitudes: SolicitudAdopcion[];
  documentos: Documento[];
  rol_id: number | null;
}> {
  const supabase = await createClient();

  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) {
    console.error("Error obteniendo usuario:", authError?.message);
    return { perfil: null, direccion: null, solicitudes: [], documentos: [], rol_id: null };
  }

  const userId = userData.user.id;

  // Perfil
  const { data: perfil, error: perfilErr } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (perfilErr) {
    console.error("Error obteniendo perfil:", perfilErr.message);
    return { perfil: null, direccion: null, solicitudes: [], documentos: [], rol_id: null };
  }

  // Dirección principal
  const { data: direccion } = await supabase
    .from("direcciones")
    .select("*")
    .eq("usuario_id", userId)
    .eq("direccion_principal", true)
    .maybeSingle();

  // Solicitudes pendientes (sin usar relaciones)
  const { data: solicitudesBase, error: solicitudesError } = await supabase
    .from("solicitudes_adopcion")
    .select("id, numero_solicitud, estado, prioridad, motivo_adopcion, mascota_id")
    .eq("usuario_id", userId)
    .eq("estado", "pendiente");

  if (solicitudesError) {
    console.error("Error obteniendo solicitudes:", solicitudesError.message);
  }

  let solicitudes: SolicitudAdopcion[] = [];

  if (solicitudesBase && solicitudesBase.length > 0) {
    const mascotaIds = solicitudesBase.map((s) => s.mascota_id);

    const { data: mascotas, error: mascError } = await supabase
      .from("mascotas")
      .select("id, nombre, imagen_url")
      .in("id", mascotaIds);

    if (mascError) {
      console.error("Error obteniendo mascotas:", mascError.message);
    }

    solicitudes = solicitudesBase.map((sol) => ({
      ...sol,
      mascota: mascotas?.find((m) => m.id === sol.mascota_id) || null,
    })) as SolicitudAdopcion[];
  }

  // Documentos aprobados
  const { data: documentos, error: docError } = await supabase
    .from("documentos")
    .select("id, perfil_id, tipo, status, url, created_at")
    .eq("perfil_id", userId)
    .eq("status", "aprobado");

  if (docError) {
    console.error("Error obteniendo documentos:", docError.message);
  }

  return {
    perfil: perfil as Perfil,
    direccion: (direccion || null) as Direccion | null,
    solicitudes,
    documentos: (documentos || []) as Documento[],
    rol_id: perfil?.rol_id ?? null,
  };
}

// -------------------------------------------------------

export async function actualizarPerfil(id: string, data: { ocupacion: string; telefono: string }) {
  const supabase = await createClient();
  const { error } = await supabase.from("perfiles").update(data).eq("id", id);

  if (error) {
    console.error("Error actualizando perfil:", error.message);
    return { success: false };
  }
  return { success: true };
}

// -------------------------------------------------------

export async function guardarDireccion(direccion: Partial<Direccion>) {
  const supabase = await createClient();

  const { data: existente } = await supabase
    .from("direcciones")
    .select("id")
    .eq("usuario_id", direccion.usuario_id)
    .eq("direccion_principal", true)
    .maybeSingle();

  let error = null;
  if (existente) {
    const { error: updateError } = await supabase
      .from("direcciones")
      .update(direccion)
      .eq("id", existente.id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase.from("direcciones").insert([direccion]);
    error = insertError;
  }

  if (error) {
    console.error("Error guardando dirección:", error.message);
    return { success: false };
  }
  return { success: true };
}

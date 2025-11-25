"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  Direccion,
  Documento,
  Perfil,
  SolicitudAdopcionMin as SolicitudAdopcion,
} from "../types/perfil";

export async function obtenerPerfilActual() {
  const supabase = await createClient();

  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) {
    console.error("Error obteniendo usuario:", authError?.message);
    throw new Error("No se pudo obtener el usuario autenticado.");
  }

  const userId = userData.user.id;

  // 🔹 Perfil
  const { data: perfil, error: perfilErr } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (perfilErr) {
    console.error("Error obteniendo perfil:", perfilErr.message);
    throw new Error("No se pudo obtener el perfil del usuario.");
  }

  // 🔹 Dirección principal
  const { data: direccion } = await supabase
    .from("direcciones")
    .select("*")
    .eq("usuario_id", userId)
    .eq("direccion_principal", true)
    .maybeSingle();

  // 🔹 Solicitudes pendientes
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

  // 🔹 Documentos aprobados
  const { data: documentos, error: docError } = await supabase
    .from("documentos")
    .select("id, perfil_id, tipo, status, url, created_at")
    .eq("perfil_id", userId)
    .eq("status", "aprobado");

  if (docError) {
    console.error("Error obteniendo documentos:", docError.message);
  }

  // 🔹 Mascotas adoptadas
  const { data: solicitudesUsuario, error: solicitudesAdoError } = await supabase
    .from("solicitudes_adopcion")
    .select("mascota_id")
    .eq("usuario_id", userId);

  if (solicitudesAdoError) {
    console.error("Error obteniendo solicitudes de adopción:", solicitudesAdoError.message);
  }

  let mascotasAdoptadas: { id: string; nombre: string; imagen_url: string | null }[] = [];

  if (solicitudesUsuario && solicitudesUsuario.length > 0) {
    const mascotaIds = solicitudesUsuario.map((s) => s.mascota_id);

    const { data: mascotas, error: mascError } = await supabase
      .from("mascotas")
      .select(`
      id,
      nombre,
      imagen_url,
      sexo,
      tamano,
      disponible_adopcion,
      esterilizado,
      edad,
      personalidad,
      fecha_ingreso,
      raza:raza_id(id, nombre, especie)
      `)
      .in("id", mascotaIds)
      .eq("estado", "adoptada");

    if (mascError) {
      console.error("Error obteniendo mascotas adoptadas:", mascError.message);
    }

    mascotasAdoptadas = mascotas ?? [];
  }

  return {
    perfil: perfil as Perfil,
    direccion: (direccion || null) as Direccion | null,
    solicitudes,
    documentos: (documentos || []) as Documento[],
    mascotasAdoptadas,
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

// ======================== OBTENER MASCOTAS ADOPTADAS ========================
export async function obtenerMascotasAdoptadas(usuarioId: string) {
  const supabase = await createClient();

  //Obtener solicitudes del usuario
  const { data: solicitudes, error: solError } = await supabase
    .from("solicitudes_adopcion")
    .select("mascota_id")
    .eq("usuario_id", usuarioId);

  if (solError) {
    console.error("Error obteniendo solicitudes:", solError.message);
    return [];
  }

  if (!solicitudes?.length) return [];

  const mascotaIds = solicitudes.map((s) => s.mascota_id);

  //Filtrar solo las mascotas cuyo estado = "adoptada"
  const { data: mascotas, error: mascError } = await supabase
    .from("mascotas")
    .select("id, nombre, imagen_url, estado")
    .in("id", mascotaIds)
    .eq("estado", "adoptada");

  if (mascError) {
    console.error("Error obteniendo mascotas adoptadas:", mascError.message);
    return [];
  }

  return mascotas ?? [];
}

export async function getUsuarioAuthId(perfilUsuarioId: string | null) {
  if (!perfilUsuarioId) return null;

  const supabaseSrv = await createClient();

  const { data } = await supabaseSrv
    .from("perfiles")
    .select("id, auth_user_id")
    .eq("id", perfilUsuarioId)
    .maybeSingle();

  return data?.auth_user_id || perfilUsuarioId;
}

export async function getPerfilById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("perfiles")
    .select("id, nombres, apellido_paterno, apellido_materno, email")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}
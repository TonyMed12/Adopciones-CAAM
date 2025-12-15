"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  Direccion,
  Documento,
  Perfil,
  SolicitudAdopcionMin as SolicitudAdopcion,
} from "../types/perfil";
import { logger } from "@/lib/logger";

export async function obtenerPerfilActual() {
  const supabase = await createClient();

  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) {
    logger.error("obtenerPerfilActual:auth_error", {
      message: authError?.message,
    });
    throw new Error("No se pudo obtener el usuario autenticado.");
  }

  const userId = userData.user.id;

  // Perfil
  const { data: perfil, error: perfilErr } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (perfilErr) {
    logger.error("obtenerPerfilActual:perfil_error", {
      message: perfilErr.message,
      userId,
    });
    throw new Error("No se pudo obtener el perfil del usuario.");
  }

  // Dirección principal
  const { data: direccion } = await supabase
    .from("direcciones")
    .select("*")
    .eq("usuario_id", userId)
    .eq("direccion_principal", true)
    .maybeSingle();

  // Solicitudes pendientes
  const { data: solicitudesBase, error: solicitudesError } = await supabase
    .from("solicitudes_adopcion")
    .select("id, numero_solicitud, estado, prioridad, motivo_adopcion, mascota_id")
    .eq("usuario_id", userId)
    .eq("estado", "pendiente");

  if (solicitudesError) {
    logger.error("obtenerPerfilActual:solicitudes_error", {
      message: solicitudesError.message,
      userId,
    });
  }

  let solicitudes: SolicitudAdopcion[] = [];

  if (solicitudesBase && solicitudesBase.length > 0) {
    const mascotaIds = solicitudesBase.map((s) => s.mascota_id);

    const { data: mascotas, error: mascError } = await supabase
      .from("mascotas")
      .select("id, nombre, imagen_url")
      .in("id", mascotaIds);

    if (mascError) {
      logger.error("obtenerPerfilActual:mascotas_error", {
        message: mascError.message,
        userId,
      });
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
    logger.error("obtenerPerfilActual:documentos_error", {
      message: docError.message,
      userId,
    });
  }

  // Mascotas adoptadas
  const { data: solicitudesUsuario, error: solicitudesAdoError } = await supabase
    .from("solicitudes_adopcion")
    .select("mascota_id")
    .eq("usuario_id", userId);

  if (solicitudesAdoError) {
    logger.error("obtenerPerfilActual:solicitudes_adopcion_error", {
      message: solicitudesAdoError.message,
      userId,
    });
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
      logger.error("obtenerPerfilActual:mascotas_adoptadas_error", {
        message: mascError.message,
        userId,
      });
    }

    mascotasAdoptadas = mascotas ?? [];
  }

  logger.info("obtenerPerfilActual:success", {
    userId,
  });

  return {
    perfil: perfil as Perfil,
    direccion: (direccion || null) as Direccion | null,
    solicitudes,
    documentos: (documentos || []) as Documento[],
    mascotasAdoptadas,
    rol_id: perfil?.rol_id ?? null,
  };
}


export async function actualizarPerfil(id: string, data: { ocupacion: string; telefono: string }) {
  const supabase = await createClient();
  const { error } = await supabase.from("perfiles").update(data).eq("id", id);

  if (error) {
    logger.error("actualizarPerfil:error", {
      message: error.message,
      id,
    });
    return { success: false };
  }

  logger.info("actualizarPerfil:success", { id });
  return { success: true };
}


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
    logger.error("guardarDireccion:error", {
      message: error.message,
      usuarioId: direccion.usuario_id,
    });
    return { success: false };
  }

  logger.info("guardarDireccion:success", {
    usuarioId: direccion.usuario_id,
  });
  return { success: true };
}

export async function obtenerMascotasAdoptadas(usuarioId: string) {
  const supabase = await createClient();

  //Obtener solicitudes del usuario
  const { data: solicitudes, error: solError } = await supabase
    .from("solicitudes_adopcion")
    .select("mascota_id")
    .eq("usuario_id", usuarioId);

  if (solError) {
    logger.error("obtenerMascotasAdoptadas:solicitudes_error", {
      message: solError.message,
      usuarioId,
    });
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
    logger.error("obtenerMascotasAdoptadas:mascotas_error", {
      message: mascError.message,
      usuarioId,
    });
    return [];
  }

  logger.info("obtenerMascotasAdoptadas:success", {
    usuarioId,
    total: mascotas?.length ?? 0,
  });

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

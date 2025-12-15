"use server";

import type { RevisionAdopcion } from "@/features/adopciones/types/adopciones";
import { createClient } from "@/lib/supabase/server";
import { SolicitudUsuario, SolicitudCompleta } from "../types/solicitudes";
import { mapSolicitudUsuario } from "../mappers/solicitudes-mappers";
import { getUsuarioAuthId } from "@/features/perfil/actions/perfil-actions";
import { logger } from "@/lib/logger";

export async function updateSolicitudEstado(
  supabaseSrv: any,
  parsed: RevisionAdopcion,
  solicitudId: string
) {
  logger.info("updateSolicitudEstado:start", {
    solicitudId,
    nuevoEstado: parsed.estado,
  });

  const { data, error } = await supabaseSrv
    .from("solicitudes_adopcion")
    .update({ estado: parsed.estado })
    .eq("id", solicitudId)
    .select("id, mascota_id, usuario_id")
    .single();

  if (error) {
    logger.error("updateSolicitudEstado:supabase_error", {
      solicitudId,
      message: error.message,
    });
    return null; 
  }

  logger.info("updateSolicitudEstado:success", {
    solicitudId: data.id,
    usuarioId: data.usuario_id,
  });

  return data as { id: string; mascota_id: string | null; usuario_id: string };
}

export async function actualizarSolicitudEstado(
  solicitudId: string,
  nuevoEstado: "en_proceso" | "rechazada" | "pendiente"
) {
  const supabase = await createClient();

  logger.info("actualizarSolicitudEstado:start", {
    solicitudId,
    nuevoEstado,
  });

  const { data, error } = await supabase
    .from("solicitudes_adopcion")
    .update({
      estado: nuevoEstado,
      updated_at: new Date().toISOString(),
    })
    .eq("id", solicitudId)
    .select("id, estado, updated_at")
    .single();

  if (error) {
    logger.error("actualizarSolicitudEstado:supabase_error", {
      solicitudId,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("actualizarSolicitudEstado:success", {
    solicitudId: data.id,
    estado: data.estado,
  });

  return data;
}

export async function listarSolicitudesActivasPorUsuario(
  usuarioId: string
): Promise<SolicitudUsuario[]> {
  const supabase = await createClient();

  logger.info("listarSolicitudesActivasPorUsuario:start", {
    usuarioId,
  });

  const { data, error } = await supabase
    .from("solicitudes_adopcion")
    .select(`
      id,
      estado,
      fecha_creada: created_at,
      mascota: mascotas (
        id,
        nombre,
        imagen_url
      )
    `)
    .eq("usuario_id", usuarioId)
    .in("estado", ["pendiente", "en_proceso"]);

  if (error) {
    logger.error("listarSolicitudesActivasPorUsuario:supabase_error", {
      usuarioId,
      message: error.message,
    });
    throw new Error(error.message); 
  }

  logger.info("listarSolicitudesActivasPorUsuario:success", {
    usuarioId,
    total: data?.length ?? 0,
  });

  return (data ?? []).map(mapSolicitudUsuario);
}

export async function obtenerSolicitudParaAdopcion(
  solicitudId: string
): Promise<SolicitudCompleta | null> {
  const supabase = await createClient();

  logger.info("obtenerSolicitudParaAdopcion:start", {
    solicitudId,
  });

  const { data, error } = await supabase
    .from("solicitudes_adopcion")
    .select(
      `
      id,
      numero_solicitud,
      estado,
      created_at,
      motivo_adopcion,
      mascota: mascotas (
        id,
        nombre,
        imagen_url
      )
    `
    )
    .eq("id", solicitudId)
    .maybeSingle();

  if (error) {
    logger.error("obtenerSolicitudParaAdopcion:supabase_error", {
      solicitudId,
      message: error.message,
    });
    throw new Error(error.message); 
  }

  logger.info("obtenerSolicitudParaAdopcion:success", {
    solicitudId,
    encontrada: !!data,
  });

  return data as SolicitudCompleta | null;
}

export async function crearSolicitudAdopcion(mascotaId: string) {
  const supabase = await createClient();

  logger.info("crearSolicitudAdopcion:start", {
    mascotaId,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.error("crearSolicitudAdopcion:no_auth");
    throw new Error("No autenticado");
  }

  const usuarioId = await getUsuarioAuthId(user.id);
  if (!usuarioId) {
    logger.error("crearSolicitudAdopcion:perfil_no_encontrado", {
      authUserId: user.id,
    });
    throw new Error("Perfil no encontrado");
  }

  const numero = "SOL-" + Math.floor(100000 + Math.random() * 900000);

  const { data, error } = await supabase
    .from("solicitudes_adopcion")
    .insert({
      numero_solicitud: numero,
      usuario_id: usuarioId,
      mascota_id: mascotaId,
      estado: "pendiente",
      motivo_adopcion: "Pendiente de llenar",
    })
    .select("id")
    .single();

  if (error) {
    logger.error("crearSolicitudAdopcion:supabase_error", {
      mascotaId,
      usuarioId,
      message: error.message,
    });
    throw new Error(error.message);
  }

  await supabase
    .from("mascotas")
    .update({
      estado: "en_proceso",
      disponible_adopcion: false,
    })
    .eq("id", mascotaId);

  logger.info("crearSolicitudAdopcion:success", {
    solicitudId: data.id,
    mascotaId,
    usuarioId,
  });

  return data;
}

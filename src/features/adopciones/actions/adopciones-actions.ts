"use server";

import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import {
  NuevaAdopcionSchema,
  RevisionAdopcionSchema,
} from "../schemas/adopciones-schemas";
import type {
  Adopcion,
  NuevaAdopcion,
  RevisionAdopcion,
  AdopcionAdminRow,
} from "../types/adopciones";
import { fetchAdopcionesBase } from "./helpers/fetchAdopcionesBase";
import { fetchSolicitudesMeta } from "./helpers/fetchSolicitudesMeta";
import { indexSolicitudesPorId } from "./helpers/indexSolicitudesPorId";
import { mapAdopcionesAdminRows } from "./helpers/mapAdopcionesAdminRows";
import { throwIf } from "./helpers/throwIf";
import { updateSolicitudEstado } from "@/features/solicitudes/actions/solicitudes-actions";
import { getUsuarioAuthId } from "@/features/perfil/actions/perfil-actions";
import { mapAdopcionUsuario } from "../mappers/adopciones-mappers";
import { logger } from "@/lib/logger";

export async function listarAdopciones(): Promise<Adopcion[]> {
  logger.info("listarAdopciones:start");

  const { data, error } = await supabase
    .from("adopciones")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("listarAdopciones:supabase_error", {
      message: error.message,
    });
  }

  throwIf(error);

  logger.info("listarAdopciones:success", {
    returned: data?.length ?? 0,
  });

  return (data ?? []) as Adopcion[];
}

export async function crearAdopcion(input: unknown): Promise<Adopcion> {
  const parsed = NuevaAdopcionSchema.parse(input);

  logger.info("crearAdopcion:start", {
    solicitudId: parsed.solicitud_id,
  });

  const { data, error } = await supabase
    .from("adopciones")
    .insert({
      solicitud_id: parsed.solicitud_id,
      tipo_vivienda: parsed.tipo_vivienda,
      espacio_disponible: parsed.espacio_disponible,
      otras_mascotas: parsed.otras_mascotas,
      detalle_otras_mascotas: parsed.detalle_otras_mascotas,
      evidencia_hogar_urls: parsed.evidencia_hogar_urls,
      compromiso_seguimiento: parsed.compromiso_seguimiento,
      compromiso_cuidado: parsed.compromiso_cuidado,
      observaciones_usuario: parsed.observaciones_usuario || null,
      estado: "pendiente",
    })
    .select()
    .single();

  if (error) {
    logger.error("crearAdopcion:supabase_error", {
      message: error.message,
    });
  }

  throwIf(error);

  logger.info("crearAdopcion:success", {
    adopcionId: data.id,
  });

  return data as Adopcion;
}

export async function revisarAdopcion(input: unknown): Promise<Adopcion> {
  const parsed = RevisionAdopcionSchema.parse(input);

  logger.info("revisarAdopcion:start", {
    adopcionId: parsed.id,
    estado: parsed.estado,
  });

  const { data, error } = await supabase
    .from("adopciones")
    .update({
      admin_responsable: parsed.admin_responsable,
      estado: parsed.estado,
      observaciones_admin: parsed.observaciones_admin || null,
      contrato_url: parsed.contrato_url || null,
      seguimiento_programado: parsed.seguimiento_programado || null,
      fecha_revision: new Date().toISOString(),
    })
    .eq("id", parsed.id)
    .select()
    .single();

  if (error) {
    logger.error("revisarAdopcion:supabase_error", {
      adopcionId: parsed.id,
      message: error.message,
    });
  }

  throwIf(error);

  logger.info("revisarAdopcion:success", {
    adopcionId: parsed.id,
  });

  return data as Adopcion;
}

export async function obtenerAdopcionPorId(
  id: string
): Promise<Adopcion | null> {
  logger.info("obtenerAdopcionPorId:start", {
    id,
  });

  const { data, error } = await supabase
    .from("adopciones")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    logger.error("obtenerAdopcionPorId:supabase_error", {
      id,
      message: error.message,
    });
  }

  throwIf(error);

  logger.info("obtenerAdopcionPorId:success", {
    id,
  });

  return data as Adopcion;
}

export async function listarAdopcionesAdmin(): Promise<AdopcionAdminRow[]> {
  logger.info("listarAdopcionesAdmin:start");

  const adopciones = await fetchAdopcionesBase();

  const solIds = [
    ...new Set(adopciones.map((a: any) => a.solicitud_id).filter(Boolean)),
  ];

  if (solIds.length === 0) {
    logger.info("listarAdopcionesAdmin:sin_solicitudes");
    return [];
  }

  const solicitudes = await fetchSolicitudesMeta(solIds);
  const byId = indexSolicitudesPorId(solicitudes);

  const rows = mapAdopcionesAdminRows(adopciones, byId);

  logger.info("listarAdopcionesAdmin:success", {
    returned: rows.length,
  });

  return rows;
}

async function moverCitaAGemela(
  supabaseSrv: any,
  usuarioAuthId: string,
  mascotaId: string,
  solicitudId: string
) {
  logger.info("moverCitaAGemela:start", {
    usuarioAuthId,
    mascotaId,
  });

  const { data: cita } = await supabaseSrv
    .from("citas_adopcion")
    .select("*")
    .eq("usuario_id", usuarioAuthId)
    .eq("mascota_id", mascotaId)
    .order("creada_en", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!cita) return;

  const { data: existe } = await supabaseSrv
    .from("citas_adopcion_aprobadas")
    .select("id")
    .eq("id", cita.id)
    .maybeSingle();

  if (!existe) {
    await supabaseSrv.from("citas_adopcion_aprobadas").insert([
      {
        id: cita.id,
        usuario_id: cita.usuario_id,
        solicitud_id: cita.solicitud_id ?? solicitudId,
        mascota_id: cita.mascota_id,
        fecha_cita: cita.fecha_cita,
        hora_cita: cita.hora_cita,
        estado: "completada",
        creada_en: cita.creada_en,
        actualizada_en: new Date().toISOString(),
        asistencia: cita.asistencia ?? "asistio",
        interaccion: cita.interaccion ?? "buena_aprobada",
        nota: cita.nota ?? "Cita aprobada al aceptar adopción.",
        aprobada_en: new Date().toISOString(),
      },
    ]);
  }

  await supabaseSrv.from("citas_adopcion").delete().eq("id", cita.id);

  logger.info("moverCitaAGemela:success", {
    citaId: cita.id,
  });
}

async function eliminarCitasPendientes(
  supabaseSrv: any,
  usuarioAuthId: string,
  mascotaId: string
) {
  logger.info("eliminarCitasPendientes:start", {
    usuarioAuthId,
    mascotaId,
  });

  const { data: citasRelacionadas } = await supabaseSrv
    .from("citas_adopcion")
    .select("id")
    .eq("usuario_id", usuarioAuthId)
    .eq("mascota_id", mascotaId);

  if (!citasRelacionadas?.length) return;

  await supabaseSrv
    .from("citas_adopcion")
    .delete()
    .in("id", citasRelacionadas.map((c) => c.id));

  logger.info("eliminarCitasPendientes:success", {
    total: citasRelacionadas.length,
  });
}

export async function cambiarEstadoAdopcion(params: {
  id: string;
  estado: "aprobada" | "rechazada";
  observaciones_admin?: string | null;
  contrato_url?: string | null;
  seguimiento_programado?: string | null;
  admin_responsable: string;
}): Promise<Adopcion> {
  const supabaseSrv = await createClient();
  const parsed = RevisionAdopcionSchema.parse(params);

  logger.info("cambiarEstadoAdopcion:start", {
    adopcionId: parsed.id,
    estado: parsed.estado,
  });

  const { data, error } = await supabaseSrv
    .from("adopciones")
    .update({
      admin_responsable: parsed.admin_responsable,
      estado: parsed.estado,
      observaciones_admin: parsed.observaciones_admin || null,
      contrato_url: parsed.contrato_url || null,
      seguimiento_programado: parsed.seguimiento_programado || null,
      fecha_revision: new Date().toISOString(),
    })
    .eq("id", parsed.id)
    .select("id, solicitud_id, estado")
    .single();

  if (error) {
    logger.error("cambiarEstadoAdopcion:supabase_error", {
      adopcionId: parsed.id,
      message: error.message,
    });
  }

  throwIf(error);

  if (!data?.solicitud_id) return data as Adopcion;

  const solicitud = await updateSolicitudEstado(
    supabaseSrv,
    parsed,
    data.solicitud_id
  );

  if (!solicitud?.mascota_id) return data as Adopcion;

  const mascotaId = solicitud.mascota_id;
  const usuarioAuthId = await getUsuarioAuthId(solicitud.usuario_id);

  if (!usuarioAuthId) return data as Adopcion;

  if (parsed.estado === "aprobada") {
    const mod = await import("@/features/mascotas/actions/mascotas-actions");
    await mod.marcarMascotaAdoptada(supabaseSrv, mascotaId);

    await moverCitaAGemela(supabaseSrv, usuarioAuthId, mascotaId, solicitud.id);
  } else {
    const mod = await import("@/features/mascotas/actions/mascotas-actions");
    await mod.marcarMascotaDisponible(supabaseSrv, mascotaId);

    await eliminarCitasPendientes(supabaseSrv, usuarioAuthId, mascotaId);
  }

  logger.info("cambiarEstadoAdopcion:success", {
    adopcionId: parsed.id,
  });

  return data as Adopcion;
}

export async function obtenerAdopcionesIdsPorUsuario(auth_id: string) {
  const supabase = await createClient();

  logger.info("obtenerAdopcionesIdsPorUsuario:start", {
    auth_id,
  });

  const { data: perfil, error: perfilError } = await supabase
    .from("perfiles")
    .select("id")
    .eq("id", auth_id)
    .maybeSingle();

  if (perfilError || !perfil) {
    logger.info("obtenerAdopcionesIdsPorUsuario:sin_perfil", {
      auth_id,
    });
    return [];
  }

  const { data, error } = await supabase
    .from("adopciones")
    .select("id")
    .eq("adoptante_id", perfil.id);

  if (error) {
    logger.error("obtenerAdopcionesIdsPorUsuario:supabase_error", {
      auth_id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("obtenerAdopcionesIdsPorUsuario:success", {
    returned: data?.length ?? 0,
  });

  return data?.map((a) => a.id) || [];
}

export async function obtenerAdopcionesConMascotaYAdoptante(ids: string[]) {
  const supabase = await createClient();

  logger.info("obtenerAdopcionesConMascotaYAdoptante:start", {
    idsCount: ids.length,
  });

  const { data, error } = await supabase
    .from("adopciones")
    .select(`
      id,
      estado,
      mascotas!mascota_id ( id, nombre, imagen_url ),
      perfiles!adoptante_id ( id, nombres, apellido_paterno, apellido_materno, email )
    `)
    .in("id", ids);

  if (error) {
    logger.error("obtenerAdopcionesConMascotaYAdoptante:supabase_error", {
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("obtenerAdopcionesConMascotaYAdoptante:success", {
    returned: data?.length ?? 0,
  });

  return data || [];
}

export async function listarAdopcionesPorUsuario(adoptanteId: string) {
  const supabase = await createClient();

  logger.info("listarAdopcionesPorUsuario:start", {
    adoptanteId,
  });

  const { data, error } = await supabase
    .from("adopciones")
    .select(`
      id,
      numero_adopcion,
      fecha_adopcion,
      estado,
      mascota:mascotas (
        id,
        nombre,
        imagen_url
      )
    `)
    .eq("adoptante_id", adoptanteId)
    .order("fecha_adopcion", { ascending: false });

  if (error) {
    logger.error("listarAdopcionesPorUsuario:supabase_error", {
      adoptanteId,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("listarAdopcionesPorUsuario:success", {
    returned: data?.length ?? 0,
  });

  return (data ?? []).map(mapAdopcionUsuario);
}

"use server";

import { createClient } from "@/lib/supabase/server";
import type { NuevaCita } from "../types/cita";
import { validarHorarioCita } from "./validations/validarHorarioCita";
import { validarEvaluacionCita } from "./validations/validarEvaluacionCita";
import type { EvaluacionInput } from "./validations/validarEvaluacionCita";
import { resolverLogicaEvaluacionCita } from "./../helpers/resolverLogicaEvaluacionCita";
import { actualizarSolicitudEstado } from "@/features/solicitudes/actions/solicitudes-actions";
import { marcarMascotaDisponible } from "@/features/mascotas";
import { getPerfilById } from "@/features/perfil/actions/perfil-actions";
import { logger } from "@/lib/logger";

export async function listarCitas() {
  const supabase = await createClient();

  logger.info("listarCitas:start");

  const { data, error } = await supabase
    .from("citas_adopcion")
    .select("*")
    .order("fecha_cita", { ascending: true });

  if (error) {
    logger.error("listarCitas:supabase_error", {
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("listarCitas:success", {
    returned: data?.length ?? 0,
  });

  return data ?? [];
}

export async function reprogramarCita(id: string, fecha: string, hora: string) {
  const supabase = await createClient();

  logger.info("reprogramarCita:start", {
    id,
    fecha,
    hora,
  });

  await validarHorarioCita(fecha, hora, id);

  const { data, error } = await supabase
    .from("citas_adopcion")
    .update({
      fecha_cita: fecha,
      hora_cita: hora,
      actualizada_en: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      "id, fecha_cita, hora_cita, estado, usuario_id, mascota_id, asistencia, interaccion, nota"
    )
    .single();

  if (error) {
    logger.error("reprogramarCita:supabase_error", {
      id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("reprogramarCita:success", {
    id,
  });

  return data;
}

export async function cancelarCita(id: string) {
  const supabase = await createClient();

  logger.info("cancelarCita:start", {
    id,
  });

  const { data, error } = await supabase
    .from("citas_adopcion")
    .update({
      estado: "cancelada",
      actualizada_en: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, estado")
    .single();

  if (error) {
    logger.error("cancelarCita:supabase_error", {
      id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("cancelarCita:success", {
    id,
  });

  return data;
}

async function obtenerCita(id: string) {
  const supabase = await createClient();

  logger.info("obtenerCita:start", {
    id,
  });

  const { data, error } = await supabase
    .from("citas_adopcion")
    .select("id, solicitud_id, mascota_id, usuario_id")
    .eq("id", id)
    .single();

  if (error) {
    logger.error("obtenerCita:supabase_error", {
      id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  if (!data) {
    logger.error("obtenerCita:not_found", {
      id,
    });
    throw new Error("Cita no encontrada");
  }

  return data as {
    id: string;
    solicitud_id: string | null;
    mascota_id: string | null;
    usuario_id: string | null;
  };
}

export async function evaluarCita(id: string, input: EvaluacionInput) {
  const supabase = await createClient();

  logger.info("evaluarCita:start", {
    id,
  });

  const check = validarEvaluacionCita(input);
  if (!check.ok) {
    logger.error("evaluarCita:validation_error", {
      id,
      errores: check.errores,
    });
    throw new Error(check.errores.join(" | "));
  }

  const cita = await obtenerCita(id);
  const r = resolverLogicaEvaluacionCita(input);

  const { data: updated, error: errUpdate } = await supabase
    .from("citas_adopcion")
    .update({
      estado: r.estadoCita,
      asistencia: r.asistencia,
      interaccion: r.interaccion,
      nota: r.nota,
      actualizada_en: new Date().toISOString(),
    })
    .eq("id", id)
    .select(`
        id,
        fecha_cita,
        hora_cita,
        estado,
        usuario_id,
        mascota_id,
        asistencia,
        interaccion,
        nota,
        mascota:mascota_id (id, nombre)
    `)
    .single();

  if (errUpdate) {
    logger.error("evaluarCita:update_error", {
      id,
      message: errUpdate.message,
    });
    throw new Error(errUpdate.message);
  }

  if (cita.solicitud_id && r.estadoSolicitud !== null) {
    await actualizarSolicitudEstado(cita.solicitud_id, r.estadoSolicitud);
  }

  if (
    r.asistencia === "asistio" &&
    r.interaccion === "no_apta" &&
    cita.mascota_id
  ) {
    await marcarMascotaDisponible(cita.mascota_id);
  }

  const usuario = await getPerfilById(updated.usuario_id);

  logger.info("evaluarCita:success", {
    id,
    estado: r.estadoCita,
  });

  return {
    ...updated,
    usuario: usuario ?? null,
  };
}

export async function crearCita(input: NuevaCita) {
  const supabase = await createClient();
  const payload = { estado: "programada", ...input };

  logger.info("crearCita:start", {
    usuarioId: input.usuario_id,
    mascotaId: input.mascota_id,
  });

  const { data, error } = await supabase
    .from("citas_adopcion")
    .insert(payload)
    .select(`
      id, fecha_cita, hora_cita, estado, usuario_id, mascota_id,
      mascotas (id, nombre)
    `)
    .single();

  if (error) {
    logger.error("crearCita:supabase_error", {
      message: error.message,
    });
    throw new Error(error.message);
  }

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("id, nombres, email")
    .eq("id", data.usuario_id)
    .single();

  logger.info("crearCita:success", {
    id: data.id,
  });

  return { ...data, usuario: perfil || null };
}

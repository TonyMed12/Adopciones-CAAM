"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function obtenerSolicitudParaAdopcion(solicitudId: string) {
  logger.info("obtenerSolicitudParaAdopcion:start", {
    solicitudId,
  });

  if (!UUID_REGEX.test(solicitudId)) {
    logger.warn("obtenerSolicitudParaAdopcion:invalid_uuid", {
      solicitudId,
    });
    throw new Error("El parámetro solicitud_id no es un UUID válido.");
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("solicitudes_adopcion")
      .select("id, numero_solicitud, usuario_id, mascota_id, estado")
      .eq("id", solicitudId)
      .single();

    if (error) {
      logger.error("obtenerSolicitudParaAdopcion:supabase_error", {
        solicitudId,
        message: error.message,
      });
      throw new Error(error.message);
    }

    if (!data) {
      logger.warn("obtenerSolicitudParaAdopcion:not_found", {
        solicitudId,
      });
      throw new Error("Solicitud no encontrada.");
    }

    logger.info("obtenerSolicitudParaAdopcion:success", {
      solicitudId: data.id,
      estado: data.estado,
    });

    return data as {
      id: string;
      numero_solicitud: string;
      usuario_id: string;
      mascota_id: string;
      estado: string;
    };
  } catch (err) {
    logger.error("obtenerSolicitudParaAdopcion:unexpected_error", {
      solicitudId,
      error: err instanceof Error ? err.message : err,
    });
    throw err;
  }
}

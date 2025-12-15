"use server";

import type { Mascota } from "@/features/mascotas/types/mascotas";
import type { IniciarAdopcionResult } from "../types/iniciar-adopcion";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

import { listarSolicitudesActivasPorUsuario } from "@/features/solicitudes/actions/solicitudes-actions";
import { listarCitas } from "@/features/citas/actions/citas-actions";
import { listarDocumentosPorUsuario } from "@/features/documentos/actions/documentos-actions";
import { getUsuarioAuthId } from "@/features/perfil/actions/perfil-actions";

export async function iniciarAdopcionMascota(
  mascota: Mascota
): Promise<IniciarAdopcionResult> {
  logger.info("iniciarAdopcionMascota:start", {
    mascotaId: mascota.id,
  });

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.info("iniciarAdopcionMascota:no_auth");
      return { ok: false, reason: "NO_AUTH" };
    }

    const usuarioId = await getUsuarioAuthId(user.id);
    if (!usuarioId) {
      logger.info("iniciarAdopcionMascota:no_auth_usuario", {
        authUserId: user.id,
      });
      return { ok: false, reason: "NO_AUTH" };
    }

    // Documentos
    const documentos = await listarDocumentosPorUsuario(usuarioId);
    if (documentos.length === 0) {
      logger.info("iniciarAdopcionMascota:docs_incompletos", {
        usuarioId,
      });
      return {
        ok: false,
        reason: "DOCS_INCOMPLETOS",
        mascota,
      };
    }

    // Solicitudes activas
    const solicitudes = await listarSolicitudesActivasPorUsuario(usuarioId);
    if (solicitudes.length > 0) {
      logger.info("iniciarAdopcionMascota:solicitud_activa", {
        usuarioId,
        totalSolicitudes: solicitudes.length,
      });
      return { ok: false, reason: "SOLICITUD_ACTIVA" };
    }

    // Cita activa
    const citas = await listarCitas();
    const citaActiva = citas.find(
      (c) => c.usuario_id === usuarioId && c.estado === "programada"
    );

    if (citaActiva) {
      logger.info("iniciarAdopcionMascota:cita_activa", {
        usuarioId,
        citaId: citaActiva.id,
      });
      return { ok: false, reason: "CITA_ACTIVA" };
    }

    // Todo OK
    logger.info("iniciarAdopcionMascota:success", {
      usuarioId,
      mascotaId: mascota.id,
    });

    return {
      ok: true,
      mascotaId: mascota.id,
      mascotaNombre: mascota.nombre,
    };
  } catch (err) {
    logger.error("iniciarAdopcionMascota:unexpected_error", {
      error: err instanceof Error ? err.message : err,
    });
    return { ok: false, reason: "ERROR" };
  }
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function cancelarSolicitudAdopcion(
    solicitudId: string
): Promise<void> {
    const supabase = await createClient();

    logger.info("cancelarSolicitudAdopcion:start", {
        solicitudId,
    });

    /* ---------- Obtener solicitud ---------- */
    const { data: solicitud, error } = await supabase
        .from("solicitudes_adopcion")
        .select("id, mascota_id")
        .eq("id", solicitudId)
        .single();

    if (error || !solicitud) {
        logger.error("cancelarSolicitudAdopcion:not_found", {
            solicitudId,
            message: error?.message,
        });
        throw new Error("SOLICITUD_NO_ENCONTRADA");
    }

    /* ---------- Cancelar citas asociadas ---------- */
    const { error: citasError } = await supabase
        .from("citas_adopcion")
        .update({ estado: "cancelada" })
        .eq("solicitud_id", solicitud.id);

    if (citasError) {
        logger.error("cancelarSolicitudAdopcion:citas_error", {
            solicitudId,
            message: citasError.message,
        });
        throw new Error("ERROR_CANCELAR_CITAS");
    }

    /* ---------- Cancelar solicitud ---------- */
    const { error: cancelError } = await supabase
        .from("solicitudes_adopcion")
        .update({ estado: "rechazada" })
        .eq("id", solicitud.id);

    if (cancelError) {
        logger.error("cancelarSolicitudAdopcion:update_error", {
            solicitudId,
            message: cancelError.message,
        });
        throw new Error("ERROR_CANCELAR_SOLICITUD");
    }

    /* ---------- Liberar mascota ---------- */
    if (solicitud.mascota_id) {
        const { error: mascotaError } = await supabase
            .from("mascotas")
            .update({
                estado: "disponible",
                disponible_adopcion: true,
            })
            .eq("id", solicitud.mascota_id);

        if (mascotaError) {
            logger.error("cancelarSolicitudAdopcion:mascota_update_error", {
                solicitudId,
                mascotaId: solicitud.mascota_id,
                message: mascotaError.message,
            });
        }
    }

    logger.info("cancelarSolicitudAdopcion:success", {
        solicitudId,
    });
}

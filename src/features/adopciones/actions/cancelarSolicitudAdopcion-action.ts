"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function cancelarSolicitudAdopcion(solicitudId: string) {
    const supabase = await createClient();

    logger.info("cancelarSolicitudAdopcion:start", {
        solicitudId,
    });

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

    return true;
}

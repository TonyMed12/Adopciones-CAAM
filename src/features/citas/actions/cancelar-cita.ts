"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";


type CancelarCitaInput = {
    citaId: string;
    solicitudId: string;
};

export async function cancelarCitaAdopcion(
    input: CancelarCitaInput
): Promise<void> {
    const supabase = await createClient();

    logger.info("cancelarCitaAdopcion:start", input);

    /* ---------- Auth ---------- */
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        logger.error("cancelarCitaAdopcion:auth_error", {
            message: authError?.message,
        });
        throw new Error("NO_AUTH");
    }

    /* ---------- Cancelar cita ---------- */
    const { error: citaError } = await supabase
        .from("citas_adopcion")
        .update({ estado: "cancelada" })
        .eq("id", input.citaId);

    if (citaError) {
        logger.error("cancelarCitaAdopcion:cita_error", {
            citaId: input.citaId,
            message: citaError.message,
        });
        throw new Error("ERROR_CANCELAR_CITA");
    }

    /* ---------- Regresar solicitud a pendiente ---------- */
    const { error: solicitudError } = await supabase
        .from("solicitudes_adopcion")
        .update({ estado: "pendiente" })
        .eq("id", input.solicitudId);

    if (solicitudError) {
        logger.error("cancelarCitaAdopcion:solicitud_error", {
            solicitudId: input.solicitudId,
            message: solicitudError.message,
        });
        throw new Error("ERROR_ACTUALIZAR_SOLICITUD");
    }

    logger.info("cancelarCitaAdopcion:success", {
        citaId: input.citaId,
        solicitudId: input.solicitudId,
    });
}

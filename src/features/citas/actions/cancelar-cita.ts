"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

type CancelarCitaInput = {
    citaId: string;
    solicitudId: string;
};

async function enviarCorreoCancelacionDesdeServer(input: {
    email: string;
    nombre: string;
    mascota: string;
    motivo: string;
}) {
    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ??
        process.env.NEXT_PUBLIC_SITE_URL;

    if (!baseUrl) {
        logger.error("cancelarCita:base_url_missing");
        return;
    }

    try {
        const res = await fetch(`${baseUrl}/api/email/cita-cancelada`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });

        if (!res.ok) {
            logger.error("cancelarCita:correo_error", {
                status: res.status,
            });
        }
    } catch (error) {
        logger.error("cancelarCita:correo_exception", { error });
    }
}

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

    /* ---------- Obtener cita ---------- */
    const { data: cita, error: citaFetchError } = await supabase
        .from("citas_adopcion")
        .select("id, usuario_id, mascota_id")
        .eq("id", input.citaId)
        .single();

    if (citaFetchError || !cita) {
        logger.error("cancelarCitaAdopcion:cita_not_found", {
            citaId: input.citaId,
            message: citaFetchError?.message,
        });
        throw new Error("CITA_NO_ENCONTRADA");
    }

    /* ---------- Cancelar cita ---------- */
    const { error: citaError } = await supabase
        .from("citas_adopcion")
        .update({ estado: "cancelada" })
        .eq("id", cita.id);

    if (citaError) {
        logger.error("cancelarCitaAdopcion:cita_error", {
            citaId: cita.id,
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

    /* ---------- Datos para correo ---------- */
    const { data: perfil } = await supabase
        .from("perfiles")
        .select("email, nombres")
        .eq("id", cita.usuario_id)
        .single();

    const { data: mascota } = cita.mascota_id
        ? await supabase
            .from("mascotas")
            .select("nombre")
            .eq("id", cita.mascota_id)
            .single()
        : { data: null };

    /* ---------- Enviar correo (no bloqueante) ---------- */
    if (perfil && mascota) {
        await enviarCorreoCancelacionDesdeServer({
            email: perfil.email,
            nombre: perfil.nombres,
            mascota: mascota.nombre,
            motivo: "Cancelada por el adoptante",
        });
    }

    logger.info("cancelarCitaAdopcion:success", {
        citaId: input.citaId,
        solicitudId: input.solicitudId,
    });
}

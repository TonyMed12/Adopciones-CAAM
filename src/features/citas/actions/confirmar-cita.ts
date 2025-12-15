"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

type ConfirmarCitaInput = {
    solicitudId: string;
    usuarioId: string;
    mascotaId: string | null;
    fecha: string; 
    hora: string;  
};

async function enviarCorreoCitaDesdeServer(input: {
    email: string;
    nombre: string;
    nombreMascota: string;
    fechaTexto: string;
    horaTexto: string;
    lugar: string;
    folio: string;
}) {
    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ??
        process.env.NEXT_PUBLIC_SITE_URL;

    if (!baseUrl) {
        logger.error("enviarCorreoCitaDesdeServer:base_url_missing");
        throw new Error("BASE_URL_NO_DEFINIDA");
    }

    try {
        const res = await fetch(`${baseUrl}/api/email/cita`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });

        if (!res.ok) {
            logger.error("enviarCorreoCitaDesdeServer:fetch_error", {
                status: res.status,
            });
        }
    } catch (error) {
        logger.error("enviarCorreoCitaDesdeServer:exception", {
            error,
        });
    }
}

export async function confirmarCitaAdopcion(
    input: ConfirmarCitaInput
): Promise<void> {
    const supabase = await createClient();

    logger.info("confirmarCitaAdopcion:start", input);

    /* ---------- Auth ---------- */
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        logger.error("confirmarCitaAdopcion:auth_error", {
            message: authError?.message,
        });
        throw new Error("NO_AUTH");
    }

    /* ---------- Validar cita existente ---------- */
    const { data: citaExistente, error: checkError } = await supabase
        .from("citas_adopcion")
        .select("id")
        .eq("fecha_cita", input.fecha)
        .eq("hora_cita", `${input.hora}:00`)
        .eq("estado", "programada")
        .maybeSingle();

    if (checkError) {
        logger.error("confirmarCitaAdopcion:check_error", {
            message: checkError.message,
        });
        throw new Error("ERROR_VALIDAR_CITA");
    }

    if (citaExistente) {
        logger.info("confirmarCitaAdopcion:cita_ya_existe", {
            fecha: input.fecha,
            hora: input.hora,
        });
        throw new Error("CITA_OCUPADA");
    }

    /* ---------- Crear cita ---------- */
    const { data: nuevaCita, error: insertError } = await supabase
        .from("citas_adopcion")
        .insert({
            usuario_id: input.usuarioId,
            solicitud_id: input.solicitudId,
            mascota_id: input.mascotaId,
            fecha_cita: input.fecha,
            hora_cita: `${input.hora}:00`,
            estado: "programada",
        })
        .select("id")
        .single();

    if (insertError || !nuevaCita) {
        logger.error("confirmarCitaAdopcion:insert_error", {
            message: insertError?.message,
        });
        throw new Error("ERROR_CREAR_CITA");
    }

    /* ---------- Actualizar solicitud ---------- */
    const { error: solicitudError } = await supabase
        .from("solicitudes_adopcion")
        .update({ estado: "en_proceso" })
        .eq("id", input.solicitudId);

    if (solicitudError) {
        logger.error("confirmarCitaAdopcion:update_solicitud_error", {
            solicitudId: input.solicitudId,
            message: solicitudError.message,
        });
        throw new Error("ERROR_ACTUALIZAR_SOLICITUD");
    }

    /* ---------- Obtener datos para correo ---------- */
    const { data: perfil } = await supabase
        .from("perfiles")
        .select("email, nombres")
        .eq("id", input.usuarioId)
        .single();

    const { data: mascota } = input.mascotaId
        ? await supabase
            .from("mascotas")
            .select("nombre")
            .eq("id", input.mascotaId)
            .single()
        : { data: null };

    /* ---------- Enviar correo (NO bloqueante) ---------- */
    if (perfil && mascota) {
        const fechaTexto = new Date(
            `${input.fecha}T00:00:00`
        ).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        await enviarCorreoCitaDesdeServer({
            email: perfil.email,
            nombre: perfil.nombres,
            nombreMascota: mascota.nombre,
            fechaTexto,
            horaTexto: input.hora,
            lugar: "Centro de Atención Animal de Morelia",
            folio: nuevaCita.id,
        });
    }

    logger.info("confirmarCitaAdopcion:success", {
        solicitudId: input.solicitudId,
        citaId: nuevaCita.id,
        fecha: input.fecha,
        hora: input.hora,
    });
}

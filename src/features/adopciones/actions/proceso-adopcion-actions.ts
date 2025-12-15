"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import type {
    ProcesoAdopcionData,
    SolicitudActiva,
} from "../types/proceso-adopcion";
import type {
    CitaAdopcion,
    EstadoCitaAdopcion,
    AsistenciaCita,
    InteraccionCita,
} from "../types/citaAdopcion";
import type { EstadoAdopcion } from "../types/adopciones";

export async function obtenerProcesoAdopcionUsuario(): Promise<ProcesoAdopcionData> {
    const supabase = await createClient();

    logger.info("obtenerProcesoAdopcionUsuario:start");

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        logger.error("obtenerProcesoAdopcionUsuario:auth_error", {
            message: authError?.message,
        });
        throw new Error("NO_AUTH");
    }

    const { data: perfil, error: perfilError } = await supabase
        .from("perfiles")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

    if (perfilError || !perfil) {
        logger.error("obtenerProcesoAdopcionUsuario:perfil_error", {
            email: user.email,
            message: perfilError?.message,
        });
        throw new Error("PERFIL_NO_ENCONTRADO");
    }

    const [solicitudRes, citasRes] = await Promise.all([
        supabase
            .from("solicitudes_adopcion")
            .select(
                `
                id,
                estado,
                mascota_id,
                mascota:mascotas (
                  nombre,
                  imagen_url
                )
              `
            )
            .eq("usuario_id", perfil.id)
            .in("estado", ["pendiente", "en_proceso"])
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),

        supabase
            .from("citas_adopcion")
            .select(
                `
                id,
                solicitud_id,
                fecha_cita,
                hora_cita,
                estado,
                asistencia,
                interaccion,
                mascota:mascotas (
                  id,
                  nombre,
                  imagen_url
                )
              `
            )
            .eq("usuario_id", perfil.id)
            .order("creada_en", { ascending: false }),
    ]);

    if (solicitudRes.error) {
        logger.error("obtenerProcesoAdopcionUsuario:solicitud_error", {
            perfilId: perfil.id,
            message: solicitudRes.error.message,
        });
    }

    if (citasRes.error) {
        logger.error("obtenerProcesoAdopcionUsuario:citas_error", {
            perfilId: perfil.id,
            message: citasRes.error.message,
        });
    }

    const solicitudRaw = solicitudRes.data;

    const solicitudActiva: SolicitudActiva | null = solicitudRaw
        ? {
            id: solicitudRaw.id,
            estado: solicitudRaw.estado,
            mascota_id: solicitudRaw.mascota_id,
            mascota: Array.isArray(solicitudRaw.mascota)
                ? solicitudRaw.mascota[0] ?? null
                : solicitudRaw.mascota ?? null,
        }
        : null;

    const citas: CitaAdopcion[] = (citasRes.data ?? [])
        .filter((c) => c.solicitud_id && c.estado)
        .map((c) => ({
            id: c.id,
            solicitud_id: c.solicitud_id!,
            fecha_cita: c.fecha_cita,
            hora_cita: c.hora_cita,
            estado: c.estado as EstadoCitaAdopcion,
            asistencia: c.asistencia as AsistenciaCita | null,
            interaccion: c.interaccion as InteraccionCita | null,
            mascota: Array.isArray(c.mascota)
                ? c.mascota[0] ?? null
                : c.mascota ?? null,
        }));

    const citaCompletada = citas.find(
        (c) =>
            c.estado === "completada" &&
            c.asistencia === "asistio" &&
            c.interaccion === "buena_aprobada"
    );

    const citaActiva =
        citaCompletada ??
        citas.find((c) =>
            ["pendiente", "programada", "confirmada"].includes(c.estado)
        ) ??
        null;

    let yaTieneAdopcion = false;
    let adopcionEstado: EstadoAdopcion | null = null;

    if (solicitudActiva?.id) {
        const { data: adopcion, error: adopcionError } = await supabase
            .from("adopciones")
            .select("estado")
            .eq("solicitud_id", solicitudActiva.id)
            .maybeSingle();

        if (adopcionError) {
            logger.error("obtenerProcesoAdopcionUsuario:adopcion_error", {
                solicitudId: solicitudActiva.id,
                message: adopcionError.message,
            });
        }

        if (adopcion) {
            const estado = adopcion.estado;

            if (
                estado === "pendiente" ||
                estado === "aprobada" ||
                estado === "rechazada"
            ) {
                yaTieneAdopcion = true;
                adopcionEstado = estado;
            }
        }
    }

    logger.info("obtenerProcesoAdopcionUsuario:success", {
        perfilId: perfil.id,
        tieneSolicitud: Boolean(solicitudActiva),
        tieneCita: Boolean(citaActiva),
        yaTieneAdopcion,
    });

    return {
        solicitudActiva,
        citaActiva,
        yaTieneAdopcion,
        adopcionEstado,
    };
}

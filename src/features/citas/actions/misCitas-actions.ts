"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

import type {
    MisCitasBackendDTO,
    SolicitudActiva,
    CitaProgramada,
} from "../types/mis-citas";

export async function obtenerMisCitasUsuario(): Promise<MisCitasBackendDTO> {
    const supabase = await createClient();

    logger.info("obtenerMisCitasUsuario:start");

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
        logger.error("obtenerMisCitasUsuario:auth_error", {
            message: authError?.message,
        });
        throw new Error("NO_AUTH");
    }

    /* ---------- Perfil ---------- */
    const { data: perfil, error: perfilError } = await supabase
        .from("perfiles")
        .select("id, nombres, email")
        .eq("email", user.email)
        .maybeSingle();

    if (perfilError || !perfil) {
        logger.error("obtenerMisCitasUsuario:perfil_error", {
            email: user.email,
            message: perfilError?.message,
        });
        throw new Error("PERFIL_NO_ENCONTRADO");
    }

    /* ---------- Solicitud activa ---------- */
    const { data: solicitud, error: solicitudError } = await supabase
        .from("solicitudes_adopcion")
        .select(
            `
            id,
            estado,
            created_at,
            mascota:mascotas (
              id,
              nombre,
              imagen_url,
              estado
            )
          `
        )
        .eq("usuario_id", perfil.id)
        .in("estado", ["pendiente", "en_proceso"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (solicitudError) {
        logger.error("obtenerMisCitasUsuario:solicitud_error", {
            perfilId: perfil.id,
            message: solicitudError.message,
        });
    }

    if (!solicitud) {
        logger.info("obtenerMisCitasUsuario:sin_solicitud", {
            perfilId: perfil.id,
        });

        return {
            perfil,
            solicitudActiva: null,
            adopcionEstado: null,
            citaProgramada: null,
        };
    }

    const solicitudActiva: SolicitudActiva = {
        id: solicitud.id,
        estado: solicitud.estado,
        created_at: solicitud.created_at,
        mascota: Array.isArray(solicitud.mascota)
            ? solicitud.mascota[0] ?? null
            : solicitud.mascota ?? null,
    };

    /* ---------- Cita programada ---------- */
    const { data: cita, error: citaError } = await supabase
        .from("citas_adopcion")
        .select(
            `
            id,
            fecha_cita,
            hora_cita,
            estado,
            mascota:mascotas (
              id,
              nombre,
              imagen_url,
              estado
            )
          `
        )
        .eq("usuario_id", perfil.id)
        .eq("solicitud_id", solicitud.id)
        .eq("estado", "programada")
        .order("fecha_cita", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (citaError) {
        logger.error("obtenerMisCitasUsuario:cita_error", {
            solicitudId: solicitud.id,
            message: citaError.message,
        });
    }

    const citaProgramada: CitaProgramada | null = cita
        ? {
            id: cita.id,
            fecha_cita: cita.fecha_cita,
            hora_cita: cita.hora_cita,
            estado: "programada",
            mascota: Array.isArray(cita.mascota)
                ? cita.mascota[0] ?? null
                : cita.mascota ?? null,
        }
        : null;

    /* ---------- Estado de adopción ---------- */
    let adopcionEstado: MisCitasBackendDTO["adopcionEstado"] = null;

    const { data: adopcion, error: adopcionError } = await supabase
        .from("adopciones")
        .select("estado")
        .eq("solicitud_id", solicitud.id)
        .maybeSingle();

    if (adopcionError) {
        logger.error("obtenerMisCitasUsuario:adopcion_error", {
            solicitudId: solicitud.id,
            message: adopcionError.message,
        });
    }

    if (
        adopcion?.estado === "pendiente" ||
        adopcion?.estado === "aprobada" ||
        adopcion?.estado === "rechazada"
    ) {
        adopcionEstado = adopcion.estado;
    }

    logger.info("obtenerMisCitasUsuario:success", {
        perfilId: perfil.id,
        tieneSolicitud: true,
        tieneCita: Boolean(citaProgramada),
        adopcionEstado,
    });

    return {
        perfil,
        solicitudActiva,
        adopcionEstado,
        citaProgramada,
    };
}

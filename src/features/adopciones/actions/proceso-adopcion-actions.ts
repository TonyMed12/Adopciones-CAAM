"use server";

import { createClient } from "@/lib/supabase/server";
import type {
    ProcesoAdopcionData,
    SolicitudActiva,
    CitaAdopcion,
} from "../types/proceso-adopcion";

export async function obtenerProcesoAdopcionUsuario(): Promise<ProcesoAdopcionData> {
    const supabase = await createClient();

    /* Usuario */
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("NO_AUTH");
    }

    /* Perfil */
    const { data: perfil, error: perfilError } = await supabase
        .from("perfiles")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

    if (perfilError || !perfil) {
        throw new Error("PERFIL_NO_ENCONTRADO");
    }

    /* Queries paralelas */
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
          nombre,
          imagen_url
        )
      `
            )
            .eq("usuario_id", perfil.id)
            .order("creada_en", { ascending: false }),
    ]);

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
        
    const citas: CitaAdopcion[] = (citasRes.data ?? []).map((c) => ({
        id: c.id,
        solicitud_id: c.solicitud_id,
        fecha_cita: c.fecha_cita,
        hora_cita: c.hora_cita,
        estado: c.estado,
        asistencia: c.asistencia,
        interaccion: c.interaccion,
        mascota: Array.isArray(c.mascota)
            ? c.mascota[0] ?? null
            : c.mascota ?? null,
    }));


    /* Cita activa */
    const citaCompletada = citas.find(
        (c) =>
            c.estado === "completada" &&
            c.asistencia === "asistio" &&
            c.interaccion === "buena_aprobada"
    );

    const citaActiva =
        citaCompletada ??
        citas.find((c) =>
            ["pendiente", "programada", "confirmada"].includes(c.estado ?? "")
        ) ??
        null;

    /* Adopción */
    let yaTieneAdopcion = false;
    let adopcionEstado: string | null = null;

    if (solicitudActiva?.id) {
        const { data: adopcion } = await supabase
            .from("adopciones")
            .select("estado")
            .eq("solicitud_id", solicitudActiva.id)
            .maybeSingle();

        if (adopcion) {
            yaTieneAdopcion = true;
            adopcionEstado = adopcion.estado;
        }
    }

    return {
        solicitudActiva,
        citaActiva,
        yaTieneAdopcion,
        adopcionEstado,
    };
}

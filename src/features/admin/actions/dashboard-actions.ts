"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function obtenerStatsDashboard() {
    const supabase = await createClient();

    logger.info("obtenerStatsDashboard:start");

    const hoy = new Date();
    const hoyStr = hoy.toISOString().split("T")[0];

    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);

    const [
        docs,
        citasAdopHoy,
        citasVetHoy,
        citasAdopSemana,
        citasVetSemana,
        usuarios,
        adoptables,
        citasAdopPend,
        citasVetPend,
    ] = await Promise.all([
        supabase
            .from("documentos")
            .select("*", { head: true, count: "exact" })
            .eq("status", "pendiente"),

        supabase
            .from("citas_adopcion")
            .select("*", { head: true, count: "exact" })
            .eq("fecha_cita", hoyStr),

        supabase
            .from("citas_veterinarias")
            .select("*", { head: true, count: "exact" })
            .gte("fecha_cita", hoyStr + "T00:00:00")
            .lte("fecha_cita", hoyStr + "T23:59:59"),

        supabase
            .from("citas_adopcion")
            .select("*", { head: true, count: "exact" })
            .gte("fecha_cita", inicioSemana.toISOString().split("T")[0])
            .lte("fecha_cita", finSemana.toISOString().split("T")[0]),

        supabase
            .from("citas_veterinarias")
            .select("*", { head: true, count: "exact" })
            .gte("fecha_cita", inicioSemana.toISOString())
            .lte("fecha_cita", finSemana.toISOString()),

        supabase
            .from("perfiles")
            .select("*", { head: true, count: "exact" })
            .eq("estado_proceso", "en_revision"),

        supabase
            .from("mascotas")
            .select("*", { head: true, count: "exact" })
            .eq("estado", "disponible"),

        supabase
            .from("citas_adopcion")
            .select("*", { head: true, count: "exact" })
            .eq("estado", "programada"),

        supabase
            .from("citas_veterinarias")
            .select("*", { head: true, count: "exact" })
            .eq("estado", "pendiente"),
    ]);

    logger.info("obtenerStatsDashboard:success", {
        documentosPendientes: docs.count ?? 0,
        citasHoy: (citasAdopHoy.count ?? 0) + (citasVetHoy.count ?? 0),
        citasSemana:
            (citasAdopSemana.count ?? 0) + (citasVetSemana.count ?? 0),
        usuariosProceso: usuarios.count ?? 0,
        mascotasAdoptables: adoptables.count ?? 0,
        citasAdopPend: citasAdopPend.count ?? 0,
        citasVetPend: citasVetPend.count ?? 0,
    });

    return {
        documentosPendientes: docs.count ?? 0,
        citasHoy: (citasAdopHoy.count ?? 0) + (citasVetHoy.count ?? 0),
        citasSemana:
            (citasAdopSemana.count ?? 0) + (citasVetSemana.count ?? 0),
        usuariosProceso: usuarios.count ?? 0,
        mascotasAdoptables: adoptables.count ?? 0,
        citasAdopPend: citasAdopPend.count ?? 0,
        citasVetPend: citasVetPend.count ?? 0,
    };
}

"use server";

import { createClient } from "@/lib/supabase/server";

export async function obtenerHorasOcupadas(fecha: string): Promise<string[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("citas_ocupadas")
        .select("hora_cita")
        .eq("fecha_cita", fecha)
        .eq("estado", "programada");

    if (error) {
        console.error("obtenerHorasOcupadas:error", error.message);
        throw new Error("ERROR_CARGANDO_HORAS");
    }

    return (data ?? [])
        .map((c) => (c.hora_cita ? c.hora_cita.slice(0, 5) : null))
        .filter(Boolean) as string[];
}

import { createClient } from "@/lib/supabase/server";

export async function validarHorarioCita(
    fecha: string,
    hora: string,
    excludeId?: string
) {
    const supabase = await createClient();

    const hoy = new Date();
    const fechaCita = new Date(`${fecha}T00:00:00`);

    const maxFecha = new Date();
    maxFecha.setMonth(maxFecha.getMonth() + 1);

    if (fechaCita > maxFecha) {
        throw new Error("No puedes programar citas con más de un mes de anticipación");
    }


    const [hh, mm] = hora.split(":").map(Number);
    const ahora = new Date();

    const citaDateTime = new Date(`${fecha}T${hora}:00`);

    const esHoy =
        fechaCita.getFullYear() === hoy.getFullYear() &&
        fechaCita.getMonth() === hoy.getMonth() &&
        fechaCita.getDate() === hoy.getDate();

    if (esHoy && citaDateTime <= ahora) {
        throw new Error("No puedes programar una cita en una hora que ya pasó");
    }

    const { data, error } = await supabase
        .from("citas_adopcion")
        .select("id")
        .eq("fecha_cita", fecha)
        .eq("hora_cita", hora)
        .eq("estado", "programada") 
        .neq("id", excludeId || "");

    if (error) throw new Error(error.message);

    if (data && data.length > 0) {
        throw new Error("Ya existe una cita en ese horario");
    }

    return true;
}

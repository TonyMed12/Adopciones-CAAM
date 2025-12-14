"use server";

import { createClient } from "@/lib/supabase/server";

export async function cancelarSolicitudAdopcion(solicitudId: string) {
    const supabase = await createClient();

    const { data: solicitud, error } = await supabase
        .from("solicitudes_adopcion")
        .select("id, mascota_id")
        .eq("id", solicitudId)
        .single();

    if (error || !solicitud) {
        throw new Error("SOLICITUD_NO_ENCONTRADA");
    }

    const { error: cancelError } = await supabase
        .from("solicitudes_adopcion")
        .update({ estado: "rechazada" })
        .eq("id", solicitud.id);

    if (cancelError) {
        throw new Error("ERROR_CANCELAR_SOLICITUD");
    }

    if (solicitud.mascota_id) {
        await supabase
            .from("mascotas")
            .update({
                estado: "disponible",
                disponible_adopcion: true,
            })
            .eq("id", solicitud.mascota_id);
    }

    return true;
}

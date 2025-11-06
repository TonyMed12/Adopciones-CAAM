"use server";
import {supabase} from "@/lib/supabase/client";

export async function obtenerSolicitudParaAdopcion(solicitudId: string) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(solicitudId)) {
        throw new Error("El parámetro solicitud_id no es un UUID válido.");
    }

    const {data, error} = await supabase
    .from("solicitudes_adopcion")
    .select("id, numero_solicitud, usuario_id, mascota_id, estado")
    .eq("id", solicitudId)
    .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Solicitud no encontrada.");

    if (data.estado !== "pendiente") {
        throw new Error("La solicitud ya no está disponible para continuar con la adopción.");
    }

    return data as {
        id: string;
        numero_solicitud: string;
        usuario_id: string;
        mascota_id: string;
        estado: string;
    };
}

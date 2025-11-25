import { createClient } from "@/lib/supabase/server";

interface ValidacionMascota {
    success: boolean;
    reason?: string;
    mascota?: {
        imagen_url: string | null;
        qr_code: string | null;
    };
}

export async function validarMascotaEliminable(id: string): Promise<ValidacionMascota> {
    const supabase = await createClient();

    const { data: mascota, error } = await supabase
        .from("mascotas")
        .select("estado, disponible_adopcion, imagen_url, qr_code")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        return { success: false, reason: "error_estado" };
    }

    if (!mascota) {
        return { success: false, reason: "no_existe" };
    }

    if (mascota.estado !== "disponible" || mascota.disponible_adopcion !== true) {
        return { success: false, reason: "no_eliminable" };
    }

    return {
        success: true,
        mascota: {
            imagen_url: mascota.imagen_url,
            qr_code: mascota.qr_code,
        },
    };
}

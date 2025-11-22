"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Elimina el archivo QR de una mascota.
 */
export async function deleteMascotaQR(qrFileName: string): Promise<boolean> {
    const supabase = await createClient();

    try {
        const { error } = await supabase.storage
            .from("mascotas-qr")
            .remove([qrFileName]);

        if (error) throw error;

        return true;
    } catch (err) {
        console.error("❌ Error eliminando QR:", err);
        return false;
    }
}

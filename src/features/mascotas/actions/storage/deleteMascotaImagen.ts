"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Elimina solo la imagen de una mascota del bucket.
 */
export async function deleteMascotaImagen(id: string): Promise<boolean> {
    const supabase = await createClient();

    try {
        const fileName = `${id}.jpg`;
        const { error } = await supabase.storage
            .from("mascotas-imagenes")
            .remove([fileName]);

        if (error) throw error;

        return true;
    } catch (err) {
        console.error("❌ Error eliminando imagen:", err);
        return false;
    }
}

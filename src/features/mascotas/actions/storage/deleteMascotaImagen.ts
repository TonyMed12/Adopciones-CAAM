"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

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

        logger.info("deleteMascotaImagen:success", {
            mascotaId: id,
        });

        return true;
    } catch (err) {
        logger.error("deleteMascotaImagen:error", {
            mascotaId: id,
            error: err instanceof Error ? err.message : err,
        });
        return false;
    }
}

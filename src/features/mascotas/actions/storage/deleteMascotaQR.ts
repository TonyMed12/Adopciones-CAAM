"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

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

        logger.info("deleteMascotaQR:success", {
            qrFileName,
        });

        return true;
    } catch (err) {
        logger.error("deleteMascotaQR:error", {
            qrFileName,
            error: err instanceof Error ? err.message : err,
        });
        return false;
    }
}

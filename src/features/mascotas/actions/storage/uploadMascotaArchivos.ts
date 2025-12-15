"use server";

import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import { logger } from "@/lib/logger";

/**
 * Sube la imagen y el QR al storage.
 */
export async function uploadMascotaArchivos(
    file: File,
    id?: string
): Promise<{
    ok: boolean;
    id?: string;
    imagen_url?: string | null;
    qr_code?: string | null;
    error?: string;
}> {
    const supabase = await createClient();

    logger.info("uploadMascotaArchivos:start", {
        hasId: !!id,
        fileType: file.type,
        fileSize: file.size,
    });

    try {
        const uuid = id || uuidv4();

        const imageName = `${uuid}.jpg`;
        const { error: imgError } = await supabase.storage
            .from("mascotas-imagenes")
            .upload(imageName, file, {
                cacheControl: "0",
                upsert: true,
                contentType: file.type,
            });

        if (imgError) throw imgError;

        const { data: imgData } = supabase.storage
            .from("mascotas-imagenes")
            .getPublicUrl(imageName);

        const baseUrl =
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : "https://caamorelia.vercel.app";

        const qrLink = `${baseUrl}/mascota/${uuid}`;
        const qrDataUrl = await QRCode.toDataURL(qrLink, { width: 300 });
        const qrBlob = await (await fetch(qrDataUrl)).blob();

        const qrName = `${uuid}-qr.png`;
        const { error: qrError } = await supabase.storage
            .from("mascotas-qr")
            .upload(qrName, qrBlob, {
                cacheControl: "3600",
                upsert: true,
                contentType: "image/png",
            });

        if (qrError) throw qrError;

        logger.info("uploadMascotaArchivos:success", {
            mascotaId: uuid,
        });

        return {
            ok: true,
            id: uuid,
            imagen_url: imgData?.publicUrl ?? null,
            qr_code: qrName,
        };
    } catch (err) {
        logger.error("uploadMascotaArchivos:error", {
            error: err instanceof Error ? err.message : err,
        });

        return { ok: false, error: (err as Error).message };
    }
}

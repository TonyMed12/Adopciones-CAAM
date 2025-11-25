"use server";

import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

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

    try {
        const uuid = id || uuidv4();

        /* Subir imagen */
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

        /* Base URL */
        const baseUrl =
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : "https://caamorelia.vercel.app";

        /* Crear QR */
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

        return {
            ok: true,
            id: uuid,
            imagen_url: imgData?.publicUrl ?? null,
            qr_code: qrName,
        };
    } catch (err) {
        return { ok: false, error: (err as Error).message };
    }
}

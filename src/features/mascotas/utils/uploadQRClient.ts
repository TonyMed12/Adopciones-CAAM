"use client";

import { createClient } from "@/lib/supabase/client";

export async function uploadQRClient(qrBlob: Blob, id: string): Promise<string> {
    const supabase = createClient();

    const qrName = `${id}-qr.png`;

    const { error } = await supabase.storage
        .from("mascotas-qr")
        .upload(qrName, qrBlob, {
            cacheControl: "3600",
            upsert: true,
            contentType: "image/png",
        });

    if (error) throw error;
    
    return qrName;
}

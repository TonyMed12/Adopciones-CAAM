"use client";

import { createClient } from "@/lib/supabase/client";

export async function uploadImageClient(file: File, id: string): Promise<string> {
    const supabase = createClient();

    const fileName = `${id}.jpg`;

    const { error } = await supabase.storage
        .from("mascotas-imagenes")
        .upload(fileName, file, {
            cacheControl: "0",
            upsert: true,
            contentType: file.type,
        });

    if (error) throw error;

    const { data } = supabase.storage
        .from("mascotas-imagenes")
        .getPublicUrl(fileName);

    return data.publicUrl;
}

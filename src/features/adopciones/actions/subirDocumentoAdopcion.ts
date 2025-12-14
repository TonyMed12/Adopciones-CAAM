"use server";

import { createClient } from "@/lib/supabase/server";

export async function subirDocumentoAdopcion(params: {
    tipo: string;
    fileName: string;
    fileBuffer: ArrayBuffer;
}): Promise<void> {
    const supabase = await createClient();

    /* Auth */
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("NO_AUTH");
    }

    /* Construir path seguro */
    const safeName = params.fileName.replace(/[^a-zA-Z0-9.]/g, "_");
    const path = `${user.id}/${params.tipo}-${Date.now()}-${safeName}`;

    /* Upload */
    const { error: uploadError } = await supabase.storage
        .from("documentos_adopcion")
        .upload(path, params.fileBuffer, {
            contentType: "application/octet-stream",
            upsert: true,
        });

    if (uploadError) {
        throw new Error("ERROR_UPLOAD");
    }

    /* URL pública */
    const { data: publicUrlData } = supabase.storage
        .from("documentos_adopcion")
        .getPublicUrl(path);

    const publicUrl = publicUrlData.publicUrl;

    /* Guardar en DB */
    const { error: dbError } = await supabase
        .from("documentos")
        .upsert(
            {
                perfil_id: user.id,
                tipo: params.tipo,
                url: publicUrl,
                status: "pendiente",
                created_at: new Date().toISOString(),
            },
            { onConflict: "perfil_id,tipo" }
        );

    if (dbError) {
        throw new Error("ERROR_DB");
    }
}

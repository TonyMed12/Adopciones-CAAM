"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function subirDocumentoAdopcion(params: {
    tipo: string;
    fileName: string;
    fileBuffer: ArrayBuffer;
}): Promise<void> {
    const supabase = await createClient();

    logger.info("subirDocumentoAdopcion:start", {
        tipo: params.tipo,
        fileName: params.fileName,
    });

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        logger.error("subirDocumentoAdopcion:auth_error", {
            message: authError?.message,
        });
        throw new Error("NO_AUTH");
    }

    const safeName = params.fileName.replace(/[^a-zA-Z0-9.]/g, "_");
    const path = `${user.id}/${params.tipo}-${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
        .from("documentos_adopcion")
        .upload(path, params.fileBuffer, {
            contentType: "application/octet-stream",
            upsert: true,
        });

    if (uploadError) {
        logger.error("subirDocumentoAdopcion:upload_error", {
            userId: user.id,
            path,
            message: uploadError.message,
        });
        throw new Error("ERROR_UPLOAD");
    }

    const { data: publicUrlData } = supabase.storage
        .from("documentos_adopcion")
        .getPublicUrl(path);

    const publicUrl = publicUrlData.publicUrl;

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
        logger.error("subirDocumentoAdopcion:db_error", {
            userId: user.id,
            tipo: params.tipo,
            message: dbError.message,
        });
        throw new Error("ERROR_DB");
    }

    logger.info("subirDocumentoAdopcion:success", {
        userId: user.id,
        tipo: params.tipo,
        path,
    });
}

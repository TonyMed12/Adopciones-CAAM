"use server";

import { createClient } from "@/lib/supabase/server";
import type {
    DocumentosUsuarioData,
    DocumentoUsuario,
    EstadoDocumentos,
} from "../types/documentos";

export async function obtenerDocumentosUsuario(): Promise<DocumentosUsuarioData> {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("NO_AUTH");
    }

    const { data, error } = await supabase
        .from("documentos")
        .select("id, tipo, status, observacion_admin, url")
        .eq("perfil_id", user.id);

    if (error) {
        throw new Error("ERROR_DOCUMENTOS");
    }

    if (!data || data.length === 0) {
        return {
            estado: "sin_documentos",
            documentos: [],
        };
    }

    const documentos: DocumentoUsuario[] = data.map((d) => ({
        id: d.id,
        tipo: d.tipo,
        estado: d.status,
        motivo_rechazo: d.observacion_admin,
        url: d.url,
    }));

    const estados = documentos.map((d) => d.estado);

    let estado: EstadoDocumentos = "en_revision";

    if (estados.every((e) => e === "aprobado")) {
        estado = "aprobado";
    } else if (estados.some((e) => e === "rechazado")) {
        estado = "rechazado";
    }

    return {
        estado,
        documentos,
    };
}

"use server";

import type { Mascota } from "@/features/mascotas/types/mascotas";
import type { IniciarAdopcionResult } from "../types/iniciar-adopcion";
import { createClient } from "@/lib/supabase/server";

import { listarSolicitudesActivasPorUsuario } from "@/features/solicitudes/actions/solicitudes-actions";
import { listarCitas } from "@/features/citas/actions/citas-actions";
import { listarDocumentosPorUsuario } from "@/features/documentos/actions/documentos-actions";
import { getUsuarioAuthId } from "@/features/perfil/actions/perfil-actions";

export async function iniciarAdopcionMascota(
    mascota: Mascota
): Promise<IniciarAdopcionResult> {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return { ok: false, reason: "NO_AUTH" };

        const usuarioId = await getUsuarioAuthId(user.id);
        if (!usuarioId) return { ok: false, reason: "NO_AUTH" };

        // Documentos
        const documentos = await listarDocumentosPorUsuario(usuarioId);
        if (documentos.length === 0) {
            return {
                ok: false,
                reason: "DOCS_INCOMPLETOS",
                mascota,
            };
        }

        // Solicitudes activas
        const solicitudes = await listarSolicitudesActivasPorUsuario(usuarioId);
        if (solicitudes.length > 0) {
            return { ok: false, reason: "SOLICITUD_ACTIVA" };
        }

        // Cita activa
        const citas = await listarCitas();
        const citaActiva = citas.find(
            (c) => c.usuario_id === usuarioId && c.estado === "programada"
        );

        if (citaActiva) {
            return { ok: false, reason: "CITA_ACTIVA" };
        }

        // Todo OK
        return {
            ok: true,
            mascotaId: mascota.id,
            mascotaNombre: mascota.nombre,
        };
    } catch (e) {
        console.error("Error al iniciar adopción:", e);
        return { ok: false, reason: "ERROR" };
    }
}

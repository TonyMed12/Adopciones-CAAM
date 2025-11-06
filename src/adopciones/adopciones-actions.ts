// adopciones-actions.ts
"use server";

import {supabase} from "@/lib/supabase/client";
import {NuevaAdopcionSchema, RevisionAdopcionSchema} from "./adopciones-schemas";
import type {Adopcion, NuevaAdopcion, RevisionAdopcion, AdopcionAdminRow} from "./adopciones";

export async function listarAdopciones(): Promise<Adopcion[]> {
    const {data, error} = await supabase.from("adopciones").select("*").order("created_at", {ascending: false});

    if (error) throw new Error(error.message);
    return data as Adopcion[];
}

export async function crearAdopcion(input: unknown): Promise<Adopcion> {
    const parsed = NuevaAdopcionSchema.parse(input);

    const {data, error} = await supabase
    .from("adopciones")
    .insert({
        solicitud_id: parsed.solicitud_id,
        tipo_vivienda: parsed.tipo_vivienda,
        espacio_disponible: parsed.espacio_disponible,
        otras_mascotas: parsed.otras_mascotas,
        detalle_otras_mascotas: parsed.detalle_otras_mascotas,
        evidencia_hogar_urls: parsed.evidencia_hogar_urls,
        compromiso_seguimiento: parsed.compromiso_seguimiento,
        compromiso_cuidado: parsed.compromiso_cuidado,
        observaciones_usuario: parsed.observaciones_usuario || null,
        estado: "pendiente",
    })
    .select()
    .single();

    if (error) throw new Error(error.message);
    return data as Adopcion;
}

export async function revisarAdopcion(input: unknown): Promise<Adopcion> {
    const parsed = RevisionAdopcionSchema.parse(input);

    const {data, error} = await supabase
    .from("adopciones")
    .update({
        admin_responsable: parsed.admin_responsable,
        estado: parsed.estado,
        observaciones_admin: parsed.observaciones_admin || null,
        contrato_url: parsed.contrato_url || null,
        seguimiento_programado: parsed.seguimiento_programado || null,
        fecha_revision: new Date().toISOString(),
    })
    .eq("id", parsed.id)
    .select()
    .single();

    if (error) throw new Error(error.message);
    return data as Adopcion;
}

export async function obtenerAdopcionPorId(id: string): Promise<Adopcion | null> {
    const {data, error} = await supabase.from("adopciones").select("*").eq("id", id).single();
    if (error) throw new Error(error.message);
    return data as Adopcion;
}

export async function listarAdopcionesAdmin(): Promise<AdopcionAdminRow[]> {
    // 1) Traer adopciones base
    const {data: adopciones, error: errAdop} = await supabase
    .from("adopciones")
    .select(
        `
      id,
      created_at,
      estado,
      solicitud_id,
      tipo_vivienda,
      espacio_disponible,
      otras_mascotas,
      evidencia_hogar_urls,
      observaciones_usuario,
      observaciones_admin
    `
    )
    .order("created_at", {ascending: false});

    if (errAdop) throw new Error(errAdop.message);
    const solIds = [...new Set((adopciones || []).map((a) => a.solicitud_id).filter(Boolean))] as string[];
    if (solIds.length === 0) return [];

    // 2) Traer solicitudes relacionadas (para nombres)
    const {data: solicitudes, error: errSol} = await supabase
    .from("solicitudes_adopcion")
    .select(
        `
    id,
    usuario_id,
    mascota_id,
    perfiles!solicitudes_adopcion_usuario_id_fkey ( id, nombres ),
    mascotas!solicitudes_adopcion_mascota_id_fkey ( id, nombre, imagen_url )
  `
    )
    .in("id", solIds);

    if (errSol) throw new Error(errSol.message);

    // 3) Crear índice de solicitudes con meta de usuario/mascota
    const byId = new Map(
        (solicitudes || []).map((s: any) => [
            s.id,
            {
                usuario_id: s.usuario_id ?? s?.perfiles?.id ?? null,
                usuarioNombre: s?.perfiles?.nombres ?? null,
                mascota_id: s.mascota_id ?? s?.mascotas?.id ?? null,
                mascotaNombre: s?.mascotas?.nombre ?? null,
                mascotaImagen: s?.mascotas?.imagen_url ?? null,
            },
        ])
    );

    // 4) Mezclar adopciones + meta relacionada
    const rows = (adopciones || []).map((a: any) => {
        const meta = (byId.get(a.solicitud_id) || {
            usuario_id: null,
            usuarioNombre: null,
            mascota_id: null,
            mascotaNombre: null,
            mascotaImagen: null,
        }) as {
            usuario_id: string | null;
            usuarioNombre: string | null;
            mascota_id: string | null;
            mascotaNombre: string | null;
            mascotaImagen: string | null;
        };

        return {
            id: a.id,
            estado: a.estado,
            created_at: a.created_at,

            usuario_id: meta.usuario_id,
            usuarioNombre: meta.usuarioNombre,

            mascota_id: meta.mascota_id,
            mascotaNombre: meta.mascotaNombre,
            mascotaImagen: meta.mascotaImagen,

            tipo_vivienda: a.tipo_vivienda,
            espacio_disponible: a.espacio_disponible,
            otras_mascotas: a.otras_mascotas,

            // ✅ el admin ve todas las fotos (URLs) subidas por el usuario
            evidencias: Array.isArray(a.evidencia_hogar_urls) ? a.evidencia_hogar_urls : [],

            observaciones_usuario: a.observaciones_usuario,
            observaciones_admin: a.observaciones_admin,
        };
    });

    return rows;
}

export async function cambiarEstadoAdopcion(params: {
    id: string;
    estado: "aprobada" | "rechazada";
    observaciones_admin?: string | null;
    contrato_url?: string | null;
    seguimiento_programado?: string | null;
    admin_responsable: string; // perfil.id del admin
}): Promise<Adopcion> {
    const parsed = RevisionAdopcionSchema.parse(params);

    // 1️⃣ Actualizar la adopción
    const {data, error} = await supabase
    .from("adopciones")
    .update({
        admin_responsable: parsed.admin_responsable,
        estado: parsed.estado,
        observaciones_admin: parsed.observaciones_admin || null,
        contrato_url: parsed.contrato_url || null,
        seguimiento_programado: parsed.seguimiento_programado || null,
        fecha_revision: new Date().toISOString(),
    })
    .eq("id", parsed.id)
    .select("id, solicitud_id, estado")
    .single();

    if (error) throw new Error(error.message);

    // 2️⃣ Si tiene solicitud asociada → actualizar su estado también
    if (data?.solicitud_id) {
        const {data: solicitud, error: errSolicitud} = await supabase
        .from("solicitudes_adopcion")
        .update({
            estado: parsed.estado, // "aprobada" o "rechazada"
        })
        .eq("id", data.solicitud_id)
        .select("mascota_id")
        .single();

        if (errSolicitud) {
            console.error("⚠️ Error actualizando solicitud:", errSolicitud.message);
        } else if (solicitud?.mascota_id) {
            // 3️⃣ Actualizar mascota según resultado
            if (parsed.estado === "aprobada") {
                const {error: errMascota} = await supabase
                .from("mascotas")
                .update({
                    estado: "adoptada",
                    disponible_adopcion: false,
                })
                .eq("id", solicitud.mascota_id);

                if (errMascota) console.error("⚠️ Error marcando mascota como adoptada:", errMascota.message);
                else console.log("✅ Mascota marcada como adoptada y no disponible");
            } else if (parsed.estado === "rechazada") {
                const {error: errMascota} = await supabase
                .from("mascotas")
                .update({
                    estado: "disponible",
                    disponible_adopcion: true,
                })
                .eq("id", solicitud.mascota_id);

                if (errMascota) console.error("⚠️ Error liberando mascota:", errMascota.message);
                else console.log("✅ Mascota liberada para adopción nuevamente");
            }
        }
    }

    return data as Adopcion;
}

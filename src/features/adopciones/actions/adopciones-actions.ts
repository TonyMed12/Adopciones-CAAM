// adopciones-actions.ts
"use server";

import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { NuevaAdopcionSchema, RevisionAdopcionSchema } from "../adopciones-schemas";
import type { Adopcion, NuevaAdopcion, RevisionAdopcion, AdopcionAdminRow } from "../types/adopciones";

export async function listarAdopciones(): Promise<Adopcion[]> {
    const { data, error } = await supabase.from("adopciones").select("*").order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as Adopcion[];
}

export async function crearAdopcion(input: unknown): Promise<Adopcion> {
    const parsed = NuevaAdopcionSchema.parse(input);

    const { data, error } = await supabase
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

    const { data, error } = await supabase
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
    const { data, error } = await supabase.from("adopciones").select("*").eq("id", id).single();
    if (error) throw new Error(error.message);
    return data as Adopcion;
}

export async function listarAdopcionesAdmin(): Promise<AdopcionAdminRow[]> {
  // 1) Traer adopciones base
  const { data: adopciones, error: errAdop } = await supabase
    .from("adopciones")
    .select(`
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
    `)
    .order("created_at", { ascending: false });

  if (errAdop) throw new Error(errAdop.message);

  const solIds = [...new Set((adopciones || []).map((a) => a.solicitud_id).filter(Boolean))] as string[];
  if (solIds.length === 0) return [];

  // 2) Traer solicitudes relacionadas (para nombres + correo)
  const { data: solicitudes, error: errSol } = await supabase
    .from("solicitudes_adopcion")
    .select(`
      id,
      usuario_id,
      mascota_id,
      perfiles!solicitudes_adopcion_usuario_id_fkey (
         id,
         nombres,
         apellido_paterno,
         apellido_materno,
        email
    ),

      mascotas!solicitudes_adopcion_mascota_id_fkey ( 
        id, 
        nombre, 
        imagen_url 
      )
    `)
    .in("id", solIds);

  if (errSol) throw new Error(errSol.message);

  // 3) Crear índice de solicitudes con meta de usuario/mascota
 const byId = new Map(
  (solicitudes || []).map((s: any) => {
    // Construimos el nombre completo ANTES del return
    const nombreCompleto = [
      s?.perfiles?.nombres,
      s?.perfiles?.apellido_paterno,
      s?.perfiles?.apellido_materno,
    ]
      .filter(Boolean)
      .join(" ");

    return [
      s.id,
      {
        usuario_id: s.usuario_id ?? s?.perfiles?.id ?? null,
        usuarioNombre: nombreCompleto || null,
        usuarioCorreo: s?.perfiles?.email || null,

        mascota_id: s.mascota_id ?? s?.mascotas?.id ?? null,
        mascotaNombre: s?.mascotas?.nombre ?? null,
        mascotaImagen: s?.mascotas?.imagen_url ?? null,
      },
    ];
  })
);



  // 4) Mezclar adopciones + meta relacionada
  const rows = (adopciones || []).map((a: any) => {
    const meta = (byId.get(a.solicitud_id) || {
      usuario_id: null,
      usuarioNombre: null,
      usuarioCorreo: null, // 👈 AGREGADO
      mascota_id: null,
      mascotaNombre: null,
      mascotaImagen: null,
    }) as {
      usuario_id: string | null;
      usuarioNombre: string | null;
      usuarioCorreo: string | null;  // 👈 AGREGADO
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
      usuarioCorreo: meta.usuarioCorreo,

      mascota_id: meta.mascota_id,
      mascotaNombre: meta.mascotaNombre,
      mascotaImagen: meta.mascotaImagen,

      tipo_vivienda: a.tipo_vivienda,
      espacio_disponible: a.espacio_disponible,
      otras_mascotas: a.otras_mascotas,

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
    admin_responsable: string;
}): Promise<Adopcion> {
    const supabase = await createClient();
    const parsed = RevisionAdopcionSchema.parse(params);

    // 1️⃣ Actualizar la adopción
    const { data, error } = await supabase
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

    // 2️⃣ Si hay solicitud asociada → actualizar estado
    if (data?.solicitud_id) {
        const { data: solicitud, error: errSolicitud } = await supabase
            .from("solicitudes_adopcion")
            .update({ estado: parsed.estado })
            .eq("id", data.solicitud_id)
            .select("id, mascota_id, usuario_id")
            .single();

        if (errSolicitud) {
            console.error("⚠️ Error actualizando solicitud:", errSolicitud.message);
            return data as Adopcion;
        }

        if (!solicitud?.mascota_id) return data as Adopcion;

        const mascotaId = solicitud.mascota_id;
        const perfilUsuarioId = solicitud.usuario_id;

        // 🔍 Obtener auth_user_id desde el perfil
        const { data: perfilUsuario } = await supabase
            .from("perfiles")
            .select("id, auth_user_id")
            .eq("id", perfilUsuarioId)
            .maybeSingle();

        const usuarioAuthId = perfilUsuario?.auth_user_id || perfilUsuarioId;

        if (parsed.estado === "aprobada") {
            // 🟢 Marcar mascota como adoptada
            const { error: errMascota } = await supabase
                .from("mascotas")
                .update({ estado: "adoptada", disponible_adopcion: false })
                .eq("id", mascotaId);

            if (errMascota)
                console.error("⚠️ Error marcando mascota como adoptada:", errMascota.message);
            else console.log("✅ Mascota marcada como adoptada y no disponible");

            // 🟢 Mover cita a tabla espejo
            const { data: cita } = await supabase
                .from("citas_adopcion")
                .select("*")
                .eq("usuario_id", usuarioAuthId)
                .eq("mascota_id", mascotaId)
                .order("creada_en", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (cita) {
                const { data: existe } = await supabase
                    .from("citas_adopcion_aprobadas")
                    .select("id")
                    .eq("id", cita.id)
                    .maybeSingle();

                if (!existe) {
                    const { error: insErr } = await supabase
                        .from("citas_adopcion_aprobadas")
                        .insert([
                            {
                                id: cita.id,
                                usuario_id: cita.usuario_id,
                                solicitud_id: cita.solicitud_id ?? solicitud.id,
                                mascota_id: cita.mascota_id,
                                fecha_cita: cita.fecha_cita,
                                hora_cita: cita.hora_cita,
                                estado: "completada",
                                creada_en: cita.creada_en,
                                actualizada_en: new Date().toISOString(),
                                asistencia: cita.asistencia ?? "asistio",
                                interaccion: cita.interaccion ?? "buena_aprobada",
                                nota: cita.nota ?? "Cita aprobada al aceptar adopción.",
                                aprobada_en: new Date().toISOString(),
                            },
                        ]);

                    if (insErr)
                        console.error("⚠️ Error moviendo cita a tabla espejo:", insErr.message);
                    else console.log("✅ Cita movida a tabla gemela (aprobadas)");
                }

                await supabase.from("citas_adopcion").delete().eq("id", cita.id);
                console.log("🗂️ Cita eliminada de tabla principal");
            } else {
                console.warn("⚠️ No se encontró ninguna cita activa para mover.");
            }
        }

        if (parsed.estado === "rechazada") {
            // 🔴 Mascota vuelve a estar disponible
            const { error: errMascota } = await supabase
                .from("mascotas")
                .update({ estado: "disponible", disponible_adopcion: true })
                .eq("id", mascotaId);

            if (errMascota)
                console.error("⚠️ Error liberando mascota:", errMascota.message);
            else console.log("✅ Mascota liberada para adopción nuevamente");

            // 🔴 Eliminar citas pendientes
            const { data: citasRelacionadas } = await supabase
                .from("citas_adopcion")
                .select("id")
                .eq("usuario_id", usuarioAuthId)
                .eq("mascota_id", mascotaId);

            if (citasRelacionadas?.length) {
                await supabase
                    .from("citas_adopcion")
                    .delete()
                    .in("id", citasRelacionadas.map((c) => c.id));
                console.log("🗑️ Citas pendientes eliminadas al rechazar adopción");
            }
        }
    }

    return data as Adopcion;
}
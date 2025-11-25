"use server";

import type { RevisionAdopcion } from "@/features/adopciones/types/adopciones";
import { createClient } from "@/lib/supabase/server";

export async function updateSolicitudEstado(
  supabaseSrv: any,
  parsed: RevisionAdopcion,
  solicitudId: string
) {
  const { data, error } = await supabaseSrv
    .from("solicitudes_adopcion")
    .update({ estado: parsed.estado })
    .eq("id", solicitudId)
    .select("id, mascota_id, usuario_id")
    .single();

  if (error) {
    console.error("⚠️ Error actualizando solicitud:", error.message);
    return null;
  }

  return data as { id: string; mascota_id: string | null; usuario_id: string };
}

export async function actualizarSolicitudEstado(
    solicitudId: string,
    nuevoEstado: "en_proceso" | "rechazada" | "pendiente"
) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("solicitudes_adopcion")
        .update({
            estado: nuevoEstado,
            updated_at: new Date().toISOString(),
        })
        .eq("id", solicitudId)
        .select("id, estado, updated_at")
        .single();

    if (error) throw new Error(error.message);

    return data;
}




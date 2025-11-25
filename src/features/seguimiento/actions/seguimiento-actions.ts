import { supabase } from "@/lib/supabase/client";
import type { Seguimiento } from "../types/seguimiento";

export async function listarSeguimientosPorMascota(
  mascotaId: string
): Promise<Seguimiento[]> {
  const { data, error } = await supabase
    .from("seguimiento_adopcion")
    .select(
      `
      id,
      adopcion_id,
      fecha_seguimiento,
      observaciones,
      recomendaciones,
      satisfaccion_adoptante,
      estado_mascota,
      problemas_reportados,
      fotos_actuales,
      completado,
      realizado_por,
      created_at,
      adopciones:adopciones (
        id,
        solicitudes_adopcion (
          mascota_id
        )
      )
    `
    )
    .eq("adopciones.solicitudes_adopcion.mascota_id", mascotaId)
    .order("fecha_seguimiento", { ascending: true });

  if (error) {
    console.error("❌ Error listando seguimientos:", error);
    throw new Error("Error obteniendo los seguimientos");
  }

  return (data ?? []) as Seguimiento[];
}

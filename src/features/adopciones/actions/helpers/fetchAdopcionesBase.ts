"use server";

import { supabase } from "@/lib/supabase/client";
import { throwIf } from "./throwIf";

export async function fetchAdopcionesBase() {
  const { data, error } = await supabase
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

  throwIf(error);
  return data ?? [];
}

"use server";

import { supabase } from "@/lib/supabase/client";
import { throwIf } from "./throwIf";

export async function fetchSolicitudesMeta(solIds: string[]) {
  const { data, error } = await supabase
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

  throwIf(error);
  return data ?? [];
}

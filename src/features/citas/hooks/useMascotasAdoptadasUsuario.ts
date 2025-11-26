"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useMascotasAdoptadasUsuario(authId: string | null) {
  return useQuery({
    enabled: !!authId,
    queryKey: ["mascotas-adoptadas", authId],
    queryFn: async () => {
      const supabase = createClient();

      const { data } = await supabase
        .from("mascotas_adoptadas")
        .select(
          "mascota_id, mascota_nombre, imagen_url, adopcion_id, estado_mascota"
        )
        .eq("adoptante_auth_id", authId)
        .eq("estado_mascota", "adoptada");

      return data ?? [];
    },
  });
}

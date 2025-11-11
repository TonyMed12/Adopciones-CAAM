"use server";
import { createClient } from "@/lib/supabase/server";

export async function obtenerMascotasAdoptadas() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("❌ Usuario no autenticado:", userError?.message);
    throw new Error("No se pudo obtener el usuario actual");
  }

  // Leer desde la VISTA
  const { data, error } = await supabase
    .from("mascotas_adoptadas")
    .select("*")
    .order("fecha_adopcion", { ascending: false });

  if (error) {
    console.error("❌ Error leyendo vista mascotas_adoptadas:", error.message);
    throw new Error("Error al obtener mascotas adoptadas");
  }

  // Filtrar solo las del usuario logueado (id = perfiles.id = auth.users.id)
  const mias = (data || []).filter((r) => r.adoptante_auth_id === user.id);

  console.table(
    mias.map((x) => ({
      mascota: x.mascota_nombre,
      adopcion_id: x.adopcion_id,
      fecha: x.fecha_adopcion,
    }))
  );

  return mias;
}

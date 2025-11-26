"use server";

import { createClient } from "@/lib/supabase/server";
import {
  obtenerAdopcionesIdsPorUsuario,
  obtenerAdopcionesConMascotaYAdoptante,
} from "@/features/adopciones/actions/adopciones-actions";

export type CitaVeterinaria = {
  id: string;
  adopcion_id: string;
  fecha_cita: string;
  motivo: string;
  estado: "pendiente" | "aprobada" | "cancelada";
  created_at: string;
};

export async function listarCitasVeterinariasAdmin() {
  const supabase = await createClient();

  const { data: citas, error } = await supabase
    .from("citas_veterinarias")
    .select(`
      id,
      adopcion_id,
      fecha_cita,
      motivo,
      estado,
      observaciones,
      completada,
      created_at
    `)
    .order("fecha_cita", { ascending: true });

  if (error) throw new Error(error.message);
  if (!citas?.length) return [];

  const adopcionIds = citas.map((c) => c.adopcion_id);
  const adopciones = await obtenerAdopcionesConMascotaYAdoptante(adopcionIds);

  return citas.map((c) => {
    const adop = adopciones.find((a) => a.id === c.adopcion_id);

    const adoptante = adop?.perfiles
      ? `${adop.perfiles.nombres} ${adop.perfiles.apellido_paterno || ""} ${
          adop.perfiles.apellido_materno || ""
        }`.trim()
      : "Desconocido";

    return {
      ...c,
      mascota_nombre: adop?.mascotas?.nombre || "Desconocida",
      mascota_imagen: adop?.mascotas?.imagen_url || null,
      adoptante_nombre: adoptante,
      adoptante_correo: adop?.perfiles?.email || "No disponible",
      estado_adopcion: adop?.estado || "sin estado",
    };
  });
}

export async function cambiarEstadoCitaVeterinaria(
  id: string,
  nuevoEstado: "pendiente" | "aprobada" | "cancelada"
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("citas_veterinarias")
    .update({ estado: nuevoEstado })
    .eq("id", id);

  if (error) throw new Error(error.message);

  return true;
}

export async function listarCitasVeterinariasUsuario(auth_id: string) {
  const supabase = await createClient();

  const adopcionIds = await obtenerAdopcionesIdsPorUsuario(auth_id);
  if (!adopcionIds.length) return [];

  const { data, error } = await supabase
    .from("citas_veterinarias")
    .select(`
      id,
      adopcion_id,
      fecha_cita,
      motivo,
      estado,
      created_at
    `)
    .in("adopcion_id", adopcionIds)
    .order("fecha_cita", { ascending: true });

  if (error) throw new Error(error.message);

  return data || [];
}

export async function crearCitaVeterinaria({
  adopcion_id,
  fecha_cita,
  motivo,
}: {
  adopcion_id: string;
  fecha_cita: string;
  motivo: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("citas_veterinarias")
    .insert({
      adopcion_id,
      fecha_cita,
      motivo,
      estado: "pendiente",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

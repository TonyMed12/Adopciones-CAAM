"use server";

import { createClient } from "@/lib/supabase/server";

// 🩺 Tipos base
export type CitaVeterinaria = {
  id: string;
  adopcion_id: string;
  fecha_cita: string;
  motivo: string;
  estado: "pendiente" | "aprobada" | "cancelada";
  created_at: string;
};

// 🐾 Listar todas las citas veterinarias (solo admin)
export async function listarCitasVeterinariasAdmin() {
  const supabase = await createClient();

  // 1️⃣ Traer todas las citas veterinarias
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

  // 2️⃣ Traer las adopciones asociadas (ya con mascota y adoptante)
  const adopcionIds = citas.map((c) => c.adopcion_id);

  const { data: adopciones, error: adopError } = await supabase
    .from("adopciones")
    .select(`
      id,
      estado,
      mascotas!mascota_id ( id, nombre, imagen_url ),
      perfiles!adoptante_id ( id, nombres, apellido_paterno, apellido_materno, email )
    `)
    .in("id", adopcionIds);

  if (adopError) throw new Error(adopError.message);

  // 3️⃣ Unir las citas con su adopción correspondiente
  const citasCompletas = citas.map((cita) => {
    const adopcion = adopciones.find((a) => a.id === cita.adopcion_id);

    const adoptante = adopcion?.perfiles
      ? `${adopcion.perfiles.nombres} ${adopcion.perfiles.apellido_paterno || ""} ${adopcion.perfiles.apellido_materno || ""}`.trim()
      : "Desconocido";

    return {
      ...cita,
      mascota_nombre: adopcion?.mascotas?.nombre || "Desconocida",
      mascota_imagen: adopcion?.mascotas?.imagen_url || null,
      adoptante_nombre: adoptante,
      adoptante_correo: adopcion?.perfiles?.email || "No disponible",
      estado_adopcion: adopcion?.estado || "sin estado",
    };
  });

  return citasCompletas;
}




// 🩺 Cambiar estado de una cita (aprobar o cancelar)
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

// 🐕 Listar citas por adoptante (vista del usuario)
export async function listarCitasVeterinariasUsuario(auth_id: string) {
  const supabase = await createClient();

  const { data: adopciones, error: adopError } = await supabase
    .from("adopciones")
    .select("id")
    .eq("adoptante_auth_id", auth_id);

  if (adopError) throw new Error(adopError.message);
  const adopcionIds = adopciones?.map((a) => a.id) || [];

  if (adopcionIds.length === 0) return [];

  const { data: citas, error } = await supabase
    .from("citas_veterinarias")
    .select("*")
    .in("adopcion_id", adopcionIds)
    .order("fecha_cita", { ascending: true });

  if (error) throw new Error(error.message);
  return citas;
}

// 🩺 Crear nueva cita veterinaria (desde el usuario)
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

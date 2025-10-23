"use server";

import { createClient } from "@/lib/supabase/server";

type NuevaCita = {
  usuario_id: string;
  mascota_id: string | null;
  fecha_cita: string; // "YYYY-MM-DD"
  hora_cita: string;  // "HH:mm"
  estado?: "programada" | "completada" | "cancelada";
};

export async function listarCitas() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("citas_adopcion")
    .select(`
      id,
      fecha_cita,
      hora_cita,
      estado,
      creada_en,
      usuario_id,
      mascota_id,
      mascotas (id, nombre)
    `)
    .order("fecha_cita", { ascending: true });

  if (error) throw new Error(error.message);

  // Mapear usuarios desde perfiles (batch, no 1x1)
  const usuarioIds = [...new Set(data.map(c => c.usuario_id).filter(Boolean))];
  let perfilesMap = new Map<string, any>();

  if (usuarioIds.length > 0) {
    const { data: perfiles, error: perfilesError } = await supabase
      .from("perfiles")
      .select("id, nombres, email")
      .in("id", usuarioIds);

    if (perfilesError) throw new Error(perfilesError.message);
    perfiles?.forEach(p => perfilesMap.set(p.id, p));
  }

  return data.map(c => ({
    ...c,
    usuario: perfilesMap.get(c.usuario_id) || null,
  }));
}

export async function listarCitasRango(desdeISO: string, hastaISO: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("citas_adopcion")
    .select(`
      id,
      fecha_cita,
      hora_cita,
      estado,
      creada_en,
      usuario_id,
      mascota_id,
      mascotas (id, nombre)
    `)
    .gte("fecha_cita", desdeISO)
    .lte("fecha_cita", hastaISO)
    .order("fecha_cita", { ascending: true });

  if (error) throw new Error(error.message);

  const usuarioIds = [...new Set(data.map(c => c.usuario_id).filter(Boolean))];
  let perfilesMap = new Map<string, any>();

  if (usuarioIds.length > 0) {
    const { data: perfiles, error: perfilesError } = await supabase
      .from("perfiles")
      .select("id, nombres, email")
      .in("id", usuarioIds);

    if (perfilesError) throw new Error(perfilesError.message);
    perfiles?.forEach(p => perfilesMap.set(p.id, p));
  }

  return data.map(c => ({
    ...c,
    usuario: perfilesMap.get(c.usuario_id) || null,
  }));
}

export async function crearCita(input: NuevaCita) {
  const supabase = await createClient();
  const payload = { estado: "programada", ...input };

  const { data, error } = await supabase
    .from("citas_adopcion")
    .insert(payload)
    .select(`
      id, fecha_cita, hora_cita, estado, usuario_id, mascota_id,
      mascotas (id, nombre)
    `)
    .single();

  if (error) throw new Error(error.message);

  // Enriquecer con usuario
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("id, nombres, email")
    .eq("id", data.usuario_id)
    .single();

  return { ...data, usuario: perfil || null };
}

export async function reprogramarCita(
  id: string,
  fecha_cita: string,
  hora_cita: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("citas_adopcion")
    .update({
      fecha_cita,
      hora_cita,
      actualizada_en: new Date().toISOString(),
    })
    .eq("id", id)
    .select(`
      id, fecha_cita, hora_cita, estado, usuario_id, mascota_id,
      mascotas (id, nombre)
    `)
    .single();

  if (error) throw new Error(error.message);

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("id, nombres, email")
    .eq("id", data.usuario_id)
    .single();

  return { ...data, usuario: perfil || null };
}

export async function actualizarEstadoCita(
  id: string,
  nuevoEstado: "programada" | "completada" | "cancelada"
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("citas_adopcion")
    .update({
      estado: nuevoEstado,
      actualizada_en: new Date().toISOString(),
    })
    .eq("id", id)
    .select(`
      id, fecha_cita, hora_cita, estado, usuario_id, mascota_id,
      mascotas (id, nombre)
    `)
    .single();

  if (error) throw new Error(error.message);

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("id, nombres, email")
    .eq("id", data.usuario_id)
    .single();

  return { ...data, usuario: perfil || null };
}

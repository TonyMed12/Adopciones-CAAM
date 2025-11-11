"use server";

import { createClient } from "@/lib/supabase/server";

type NuevaCita = {
  usuario_id: string;
  mascota_id: string | null;
  fecha_cita: string; // "YYYY-MM-DD"
  hora_cita: string;  // "HH:mm"
  estado?: "programada" | "completada" | "cancelada";
};

type Asistencia = "asistio" | "no_asistio_no_apto";
type Interaccion = "buena_aprobada" | "no_apta";

type EvaluacionCita = {
  asistencia?: Asistencia | null;
  interaccion?: Interaccion | null;
  nota?: string | null;
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
      mascotas (id, nombre),
      asistencia,
      interaccion,
      nota
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
      id,
      fecha_cita,
      hora_cita,
      estado,
      usuario_id,
      mascota_id,
      mascotas (id, nombre)
    `)
    .single();

  if (error) throw new Error(error.message);

 // Obtener también el usuario
  const { data: perfil, error: perfilError } = await supabase
    .from("perfiles")
    .select("id, nombres, email")
    .eq("id", data.usuario_id)
    .single();

  if (perfilError) throw new Error(perfilError.message);

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
      id,
      fecha_cita,
      hora_cita,
      estado,
      usuario_id,
      mascota_id,
      mascotas (id, nombre)
    `)
    .single();

  if (error) throw new Error(error.message);

  const { data: perfil, error: perfilError } = await supabase
    .from("perfiles")
    .select("id, nombres, email")
    .eq("id", data.usuario_id)
    .single();

  if (perfilError) throw new Error(perfilError.message);

  return { ...data, usuario: perfil || null };
}

export async function evaluarCita(
  id: string,
  nuevoEstado: "programada" | "completada" | "cancelada",
  evaluacion: EvaluacionCita
) {
  const supabase = await createClient();

  // Normalizamos campos opcionales a null cuando no vengan
  const payload = {
    estado: nuevoEstado,
    asistencia: evaluacion.asistencia ?? null,
    interaccion: evaluacion.interaccion ?? null,
    nota: evaluacion.nota ?? null,
    actualizada_en: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("citas_adopcion")
    .update(payload)
    .eq("id", id)
    .select(`
      id,
      fecha_cita,
      hora_cita,
      estado,
      usuario_id,
      mascota_id,
      asistencia,
      interaccion,
      nota,
      mascotas (id, nombre)
    `)
    .single();

  if (error) throw new Error(error.message);

  // Enriquecer con usuario, igual que en las demás acciones
  const { data: perfil, error: perfilError } = await supabase
    .from("perfiles")
    .select("id, nombres, email")
    .eq("id", data.usuario_id)
    .single();

  if (perfilError) throw new Error(perfilError.message);

  return { ...data, usuario: perfil || null };
}
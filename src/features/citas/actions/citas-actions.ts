"use server";

import { createClient } from "@/lib/supabase/server";
import type { NuevaCita, EvaluacionCita } from "../types/cita";
import { validarHorarioCita } from "./validations/validarHorarioCita";

export async function listarCitas() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("citas_adopcion")
    .select("*")
    .order("fecha_cita", { ascending: true });

  if (error) throw new Error(error.message);

  return data ?? [];
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

export async function reprogramarCita(id: string, fecha: string, hora: string) {
  const supabase = await createClient();

  await validarHorarioCita(fecha, hora, id);

  const { data, error } = await supabase
    .from("citas_adopcion")
    .update({
      fecha_cita: fecha,
      hora_cita: hora,
      actualizada_en: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      "id, fecha_cita, hora_cita, estado, usuario_id, mascota_id, asistencia, interaccion, nota"
    )
    .single();

  if (error) throw new Error(error.message);

  return data;
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
  _nuevoEstado: "programada" | "completada" | "cancelada",
  evaluacion: EvaluacionCita
) {
  const supabase = await createClient();

  const { data: cita, error: errCita } = await supabase
    .from("citas_adopcion")
    .select("id, solicitud_id")
    .eq("id", id)
    .single();

  if (errCita) throw new Error(errCita.message);

  const solicitudId = cita?.solicitud_id ?? null;

  const asistencia = evaluacion.asistencia;
  const interaccion = evaluacion.interaccion;

  let estadoCita: "completada" | "cancelada" = "cancelada";
  let estadoSolicitud: string | null = null;

  if (asistencia === "asistio" && interaccion === "buena_aprobada") {
    estadoCita = "completada";
    estadoSolicitud = "en_proceso";
  }

  if (asistencia === "asistio" && interaccion === "no_apta") {
    estadoCita = "cancelada";
    estadoSolicitud = "rechazada";
  }

  if (asistencia === "no_asistio_no_apto") {
    estadoCita = "cancelada";
    estadoSolicitud = "pendiente";
  }

  const payload = {
    estado: estadoCita,
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

  if (solicitudId && estadoSolicitud !== null) {
    // 1. Actualizar solicitud
    const { error: errSol } = await supabase
      .from("solicitudes_adopcion")
      .update({
        estado: estadoSolicitud,
        updated_at: new Date().toISOString(),
      })
      .eq("id", solicitudId);

    if (errSol) throw new Error(errSol.message);

    // 2. Si asistió pero NO fue apto → liberar mascota
    if (
      evaluacion.asistencia === "asistio" &&
      evaluacion.interaccion === "no_apta"
    ) {
      const { error: errMascota } = await supabase
        .from("mascotas")
        .update({
          estado: "disponible",
          disponible_adopcion: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.mascota_id);

      if (errMascota) throw new Error(errMascota.message);
    }
  }

  const { data: perfil, error: perfilError } = await supabase
    .from("perfiles")
    .select("id, nombres, email")
    .eq("id", data.usuario_id)
    .single();

  if (perfilError) throw new Error(perfilError.message);

  return { ...data, usuario: perfil || null };
}


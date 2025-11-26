"use server";

import { createClient } from "@/lib/supabase/server";
import type { NuevaCita } from "../types/cita";
import { validarHorarioCita } from "./validations/validarHorarioCita";
import { validarEvaluacionCita } from "./validations/validarEvaluacionCita";
import type { EvaluacionInput } from "./validations/validarEvaluacionCita";
import { resolverLogicaEvaluacionCita } from "./../helpers/resolverLogicaEvaluacionCita";
import { actualizarSolicitudEstado } from "@/features/solicitudes/actions/solicitudes-actions";
import { marcarMascotaDisponible } from "@/features/mascotas";
import { getPerfilById } from "@/features/perfil/actions/perfil-actions";

export async function listarCitas() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("citas_adopcion")
    .select("*")
    .order("fecha_cita", { ascending: true });

  if (error) throw new Error(error.message);

  return data ?? [];
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

export async function cancelarCita(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("citas_adopcion")
    .update({
      estado: "cancelada",
      actualizada_en: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, estado")
    .single();

  if (error) throw new Error(error.message);

  return data;
}

async function obtenerCita(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("citas_adopcion")
    .select("id, solicitud_id, mascota_id, usuario_id")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Cita no encontrada");

  return data as {
    id: string;
    solicitud_id: string | null;
    mascota_id: string | null;
    usuario_id: string | null;
  };
}

export async function evaluarCita(id: string, input: EvaluacionInput) {
  const supabase = await createClient();

  const check = validarEvaluacionCita(input);
  if (!check.ok) throw new Error(check.errores.join(" | "));

  const cita = await obtenerCita(id);
  const r = resolverLogicaEvaluacionCita(input);

  const { data: updated, error: errUpdate } = await supabase
    .from("citas_adopcion")
    .update({
      estado: r.estadoCita,
      asistencia: r.asistencia,
      interaccion: r.interaccion,
      nota: r.nota,
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
        asistencia,
        interaccion,
        nota,
        mascota:mascota_id (id, nombre)
    `)
    .single();

  if (errUpdate) throw new Error(errUpdate.message);

  if (cita.solicitud_id && r.estadoSolicitud !== null) {
    await actualizarSolicitudEstado(cita.solicitud_id, r.estadoSolicitud);
  }

  if (
    r.asistencia === "asistio" &&
    r.interaccion === "no_apta" &&
    cita.mascota_id
  ) {
    await marcarMascotaDisponible(cita.mascota_id);
  }

  const usuario = await getPerfilById(updated.usuario_id);

  return {
    ...updated,
    usuario: usuario ?? null,
  };
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


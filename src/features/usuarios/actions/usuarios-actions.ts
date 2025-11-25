"use server";

import { createClient } from "@/lib/supabase/server";
import type { PerfilConDireccion } from "../types/usuarios";

export async function listarUsuarios(): Promise<PerfilConDireccion[]> {
  const supabase = await createClient();

  const { data: perfiles, error } = await supabase
    .from("perfiles")
    .select("*")
    .eq("rol_id", 2)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!perfiles) return [];

  const usuariosConDireccion = await Promise.all(
    perfiles.map(async (perfil) => {
      const { data: direccion } = await supabase
        .from("direcciones")
        .select("*")
        .eq("usuario_id", perfil.id)
        .eq("direccion_principal", true)
        .maybeSingle();

      return {
        ...perfil,
        direccion: direccion || null,
      };
    })
  );

  return usuariosConDireccion as PerfilConDireccion[];
}

export async function contarUsuarios(): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("perfiles")
    .select("*", { count: "exact", head: true })
    .eq("rol_id", 2);

  if (error) throw new Error(error.message);

  return count ?? 0;
}

export type AdopcionUsuario = {
  id: string;
  numero_adopcion: string;
  fecha_adopcion: string;
  fecha_adopcion_raw: string;
  estado: string;
  mascota_nombre: string;
  imagen_url: string | null;
};

export async function listarAdopcionesPorUsuario(
  adoptanteId: string
): Promise<AdopcionUsuario[]> {
  const supabase = await createClient();

  if (!adoptanteId) return [];

  const { data, error } = await supabase
    .from("adopciones")
    .select(`
      id,
      numero_adopcion,
      fecha_adopcion,
      estado,
      mascota:mascotas (
        id,
        nombre,
        imagen_url
      )
    `)
    .eq("adoptante_id", adoptanteId)
    .order("fecha_adopcion", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    numero_adopcion: row.numero_adopcion,
    fecha_adopcion_raw: row.fecha_adopcion,
    fecha_adopcion: row.fecha_adopcion,
    estado: row.estado,
    mascota_nombre: row.mascota?.nombre ?? "Mascota",
    imagen_url: row.mascota?.imagen_url ?? null,
  }));
}

export async function listarSolicitudesActivasPorUsuario(usuarioId: string) {
  const supabase = await createClient();

  const { data: solicitudes, error } = await supabase
    .from("solicitudes_adopcion")
    .select(`
      id,
      estado,
      fecha_creada: created_at,
      mascota: mascotas (
        id,
        nombre,
        imagen_url
      )
    `)
    .eq("usuario_id", usuarioId)
    .in("estado", ["pendiente", "en_proceso"]);

  if (error) return [];

  return solicitudes || [];
}

// Esto no lo quiten lo ocupa las citas <----
export async function fetchUsuariosByIds(ids: string[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("perfiles")
    .select("id, nombres, apellido_paterno, apellido_materno, email")
    .in("id", ids);

  if (error) throw new Error(error.message);

  return data ?? [];
}

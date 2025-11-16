"use server";

import { createClient } from "@/lib/supabase/server";
import { DeleteUsuarioSchema } from "./usuarios-schemas";
import type { PerfilConDireccion } from "./usuarios";

// ======================================================
// LISTAR USUARIOS (ADMIN)
// ======================================================
export async function listarUsuarios(): Promise<PerfilConDireccion[]> {
  const supabase = await createClient();

  // 1. Obtener perfiles
  const { data: perfiles, error } = await supabase
    .from("perfiles")
    .select("*")
    .eq("rol_id", 2)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!perfiles) return [];

  // 2. Obtener dirección principal
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

// ======================================================
// ELIMINAR USUARIO
// ======================================================
export async function eliminarUsuario(id: string): Promise<{ success: boolean }> {
  const supabase = await createClient();

  const parsed = DeleteUsuarioSchema.parse({ id });

  const { error } = await supabase
    .from("perfiles")
    .delete()
    .eq("id", parsed.id);

  if (error) throw new Error(error.message);

  return { success: true };
}

// ======================================================
// CONTAR USUARIOS
// ======================================================
export async function contarUsuarios(): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("perfiles")
    .select("*", { count: "exact", head: true })
    .eq("rol_id", 2);

  if (error) throw new Error(error.message);

  return count ?? 0;
}

// ======================================================
// TIPOS PARA ADOPCIONES (los mantengo porque sí se usan)
// ======================================================
export type AdopcionUsuario = {
  id: string;
  numero_adopcion: string;
  fecha_adopcion: string;
  fecha_adopcion_raw: string;
  estado: string;
  mascota_nombre: string;
  imagen_url: string | null;
};

// ======================================================
// LISTAR ADOPCIONES DE USUARIO (ADMIN)
// ======================================================
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

  return (data || []).map((row: any) => ({
    id: row.id,
    numero_adopcion: row.numero_adopcion,
    fecha_adopcion_raw: row.fecha_adopcion,
    fecha_adopcion: row.fecha_adopcion,
    estado: row.estado,
    mascota_nombre: row.mascota?.nombre ?? "Mascota",
    imagen_url: row.mascota?.imagen_url ?? null,
  }));
}

// ======================================================
// LISTAR SOLICITUDES ACTIVAS DEL USUARIO
// ======================================================
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

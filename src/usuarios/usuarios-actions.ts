"use server";

import { supabase } from "@/lib/supabase/client";
import { DeleteUsuarioSchema } from "./usuarios-schemas";
import type { PerfilConDocumentos } from "./usuarios";

export async function listarUsuarios(): Promise<PerfilConDocumentos[]> {
  const { data, error } = await supabase
    .from("perfiles")
    .select(`
    *,
    documentos (
      id,
      perfil_id,
      tipo,
      url,
      status,
      created_at
    )
  `)
    .eq("rol_id", 2)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando usuarios:", error.message);
    throw new Error(error.message);
  }

  return data as unknown as PerfilConDocumentos[];
}

export async function obtenerUrlDocumento(ruta: string) {
  if (!ruta) throw new Error("Ruta de documento no especificada");

  const { data } = await supabase
    .storage
    .from("documentos_adopcion")
    .getPublicUrl(ruta);

  if (!data?.publicUrl) {
    throw new Error("No se pudo generar la URL del documento");
  }

  return data.publicUrl;

}

export async function eliminarUsuario(id: string): Promise<{ success: boolean }> {
  const parsed = DeleteUsuarioSchema.parse({ id });

  const { error } = await supabase.from("perfiles").delete().eq("id", parsed.id);

  if (error) {
    console.error("Error eliminando usuario:", error.message);
    throw new Error(error.message);
  }

  return { success: true };
}

export async function actualizarDocumentoStatus(
  documentoId: string,
  nuevoStatus: string
): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from("documentos")
    .update({ status: nuevoStatus })
    .eq("id", documentoId);

  if (error) {
    console.error("Error actualizando documento:", error.message);
    throw new Error(error.message);
  }

  return { success: true };
}

export async function contarUsuarios(): Promise<number> {
  const { count, error } = await supabase
    .from("perfiles")
    .select("*", { count: "exact", head: true })
    .eq("rol_id", 2); 

  if (error) {
    console.error("Error contando usuarios:", error.message);
    throw new Error(error.message);
  }

  return count ?? 0;
}

export type AdopcionUsuario = {
  id: string;
  numero_adopcion: string;
  fecha_adopcion: string;
  fecha_adopcion_raw: string; // por si luego quieres formatear con dayjs
  estado: string;
  mascota_nombre: string;
  imagen_url: string | null;
};

// 👇 Obtener adopciones de un usuario (adoptante_id)
export async function listarAdopcionesPorUsuario(
  adoptanteId: string
): Promise<AdopcionUsuario[]> {
  if (!adoptanteId) return [];

  const { data, error } = await supabase
    .from("adopciones")
    .select(
      `
      id,
      numero_adopcion,
      fecha_adopcion,
      estado,
      mascota:mascotas (
        id,
        nombre,
        imagen_url
      )
    `
    )
    .eq("adoptante_id", adoptanteId)
    .order("fecha_adopcion", { ascending: false });

  if (error) {
    console.error(
      "Error cargando adopciones del usuario:",
      error.message
    );
    throw new Error(error.message);
  }

  // Normalizamos la respuesta
  return (data || []).map((row: any) => ({
    id: row.id,
    numero_adopcion: row.numero_adopcion,
    fecha_adopcion_raw: row.fecha_adopcion,
    fecha_adopcion: row.fecha_adopcion, // luego lo puedes formatear en el front
    estado: row.estado,
    mascota_nombre: row.mascota?.nombre ?? "Mascota",
    imagen_url: row.mascota?.imagen_url ?? null,
  }));
}

export async function listarSolicitudesActivasPorUsuario(usuarioId: string) {
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

  if (error) {
    console.error("Error cargando solicitudes activas:", error.message);
    return [];
  }

  return solicitudes || [];
}

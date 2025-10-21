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

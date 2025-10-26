// src/adopcion/actions.ts
"use server";
import { createClient } from "@/utils/supabase/server";

export type DocTipo = "ine" | "comprobante" | "curp";
export type DocEstado = "pendiente" | "aprobado" | "rechazado";

export type Documento = {
  id: string;
  perfil_id: string;
  tipo: DocTipo;
  estado: DocEstado;
  motivo_rechazo: string | null;
  archivo_url: string | null;
  updated_at: string;
};

async function getPerfilId() {
  const supabase = createClient();
  const { data: { user }, error: sErr } = await supabase.auth.getUser();
  if (sErr || !user) throw new Error("Sin sesión");

  const { data: perfil, error: pErr } = await supabase
    .from("perfiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (pErr || !perfil) throw new Error("Perfil no encontrado");
  return perfil.id as string;
}

export async function listarDocumentosUsuario() {
  const supabase = createClient();
  const perfilId = await getPerfilId();

  const { data, error } = await supabase
    .from("documentos_adopcion")
    .select("id, perfil_id, tipo, estado, motivo_rechazo, archivo_url, updated_at")
    .eq("perfil_id", perfilId)
    .order("tipo");

  if (error) throw new Error(error.message);
  return (data ?? []) as Documento[];
}

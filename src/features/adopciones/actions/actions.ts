// src/adopcion/actions.ts
"use server";
import { createClient } from "@/utils/supabase/server";
import { logger } from "@/lib/logger";

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

  logger.info("getPerfilId:start");

  const { data: { user }, error: sErr } = await supabase.auth.getUser();
  if (sErr || !user) {
    logger.error("getPerfilId:auth_error", {
      message: sErr?.message,
    });
    throw new Error("Sin sesión");
  }

  const { data: perfil, error: pErr } = await supabase
    .from("perfiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (pErr || !perfil) {
    logger.error("getPerfilId:perfil_error", {
      userId: user.id,
      message: pErr?.message,
    });
    throw new Error("Perfil no encontrado");
  }

  logger.info("getPerfilId:success", {
    perfilId: perfil.id,
  });

  return perfil.id as string;
}

export async function listarDocumentosUsuario() {
  const supabase = createClient();

  logger.info("listarDocumentosUsuario:start");

  const perfilId = await getPerfilId();

  const { data, error } = await supabase
    .from("documentos_adopcion")
    .select("id, perfil_id, tipo, estado, motivo_rechazo, archivo_url, updated_at")
    .eq("perfil_id", perfilId)
    .order("tipo");

  if (error) {
    logger.error("listarDocumentosUsuario:supabase_error", {
      perfilId,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("listarDocumentosUsuario:success", {
    perfilId,
    returned: data?.length ?? 0,
  });

  return (data ?? []) as Documento[];
}

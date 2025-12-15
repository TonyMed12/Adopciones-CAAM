"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function listarDocumentos(filtro: string) {
  const supabase = await createClient();

  logger.info("listarDocumentos:start", {
    filtro,
  });

  let query = supabase
    .from("documentos")
    .select(`
      id,
      tipo,
      url,
      status,
      created_at,
      observacion_admin,
      perfil_id,
      perfiles:perfil_id (
        nombres,
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (filtro !== "todos") query = query.eq("status", filtro);

  const { data, error } = await query;

  if (error) {
    logger.error("listarDocumentos:supabase_error", {
      filtro,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("listarDocumentos:success", {
    returned: data?.length ?? 0,
  });

  return (data || []).map((doc: any) => ({
    ...doc,
    perfiles: Array.isArray(doc.perfiles) ? doc.perfiles[0] : doc.perfiles,
  }));
}

export async function aprobarDocumento(id: string) {
  const supabase = await createClient();

  logger.info("aprobarDocumento:start", {
    documentoId: id,
  });

  const { error: updateErr } = await supabase
    .from("documentos")
    .update({ status: "aprobado" })
    .eq("id", id);

  if (updateErr) {
    logger.error("aprobarDocumento:update_error", {
      documentoId: id,
      message: updateErr.message,
    });
    throw new Error(updateErr.message);
  }

  const { data: doc, error: docErr } = await supabase
    .from("documentos")
    .select(`
        id,
        tipo,
        perfil_id,
        perfiles:perfil_id (
          nombres,
          email
        )
    `)
    .eq("id", id)
    .single();

  if (docErr) {
    logger.error("aprobarDocumento:fetch_error", {
      documentoId: id,
      message: docErr.message,
    });
    throw new Error(docErr.message);
  }

  const perfil = doc?.perfiles;
  if (!perfil) {
    logger.info("aprobarDocumento:sin_perfil", {
      documentoId: id,
    });
    return true;
  }

  const { data: docsUsuario, error: userErr } = await supabase
    .from("documentos")
    .select(`status`)
    .eq("perfil_id", doc.perfil_id);

  if (userErr) {
    logger.error("aprobarDocumento:usuario_docs_error", {
      documentoId: id,
      message: userErr.message,
    });
    throw new Error(userErr.message);
  }

  const todosAprobados =
    docsUsuario && docsUsuario.every((d: any) => d.status === "aprobado");

  if (todosAprobados) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    await fetch(`${baseUrl}/api/email/documento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: perfil.email,
        nombre: perfil.nombres,
        tipoDocumento: "todos",
        estado: "aprobado_total",
      }),
    });
  }

  logger.info("aprobarDocumento:success", {
    documentoId: id,
    todosAprobados: !!todosAprobados,
  });

  return true;
}

export async function rechazarDocumento(id: string, motivo: string) {
  const supabase = await createClient();

  logger.info("rechazarDocumento:start", {
    documentoId: id,
  });

  const { data: doc, error: docErr } = await supabase
    .from("documentos")
    .select(`
      id,
      tipo,
      perfil_id,
      perfiles:perfil_id (
        nombres,
        email
      )
    `)
    .eq("id", id)
    .single();

  if (docErr) {
    logger.error("rechazarDocumento:fetch_error", {
      documentoId: id,
      message: docErr.message,
    });
    throw new Error(docErr.message);
  }

  const { error: updateErr } = await supabase
    .from("documentos")
    .update({
      status: "rechazado",
      observacion_admin: motivo,
    })
    .eq("id", id);

  if (updateErr) {
    logger.error("rechazarDocumento:update_error", {
      documentoId: id,
      message: updateErr.message,
    });
    throw new Error(updateErr.message);
  }

  if (!doc?.perfiles?.email) {
    logger.info("rechazarDocumento:sin_email", {
      documentoId: id,
    });
    return true;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  await fetch(`${baseUrl}/api/email/documento`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: doc.perfiles.email,
      nombre: doc.perfiles.nombres,
      tipoDocumento: doc.tipo,
      estado: "rechazado",
      motivo,
    }),
  });

  logger.info("rechazarDocumento:success", {
    documentoId: id,
  });

  return true;
}

export async function listarDocumentosPorUsuario(perfilId: string) {
  const supabase = await createClient();

  logger.info("listarDocumentosPorUsuario:start", {
    perfilId,
  });

  const { data, error } = await supabase
    .from("documentos")
    .select("id, status")
    .eq("perfil_id", perfilId)
    .eq("status", "aprobado");

  if (error) {
    logger.error("listarDocumentosPorUsuario:supabase_error", {
      perfilId,
      message: error.message,
    });
    throw new Error("No se pudieron obtener los documentos del usuario");
  }

  logger.info("listarDocumentosPorUsuario:success", {
    perfilId,
    returned: data?.length ?? 0,
  });

  return data ?? [];
}

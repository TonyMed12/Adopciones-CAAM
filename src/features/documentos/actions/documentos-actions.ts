"use server";

import { createClient } from "@/lib/supabase/server";

export async function listarDocumentos(filtro: string) {
  const supabase = await createClient();

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

  if (error) throw new Error(error.message);

  return (data || []).map((doc: any) => ({
    ...doc,
    perfiles: Array.isArray(doc.perfiles) ? doc.perfiles[0] : doc.perfiles,
  }));
}

export async function aprobarDocumento(id: string) {
  const supabase = await createClient();

  const { error: updateErr } = await supabase
    .from("documentos")
    .update({ status: "aprobado" })
    .eq("id", id);

  if (updateErr) throw new Error(updateErr.message);

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

  if (docErr) throw new Error(docErr.message);

  const perfil = doc?.perfiles;
  if (!perfil) return true;

  const { data: docsUsuario, error: userErr } = await supabase
    .from("documentos")
    .select(`status`)
    .eq("perfil_id", doc.perfil_id);

  if (userErr) throw new Error(userErr.message);

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

  return true;
}


export async function rechazarDocumento(id: string, motivo: string) {
  const supabase = await createClient();

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

  if (docErr) throw new Error(docErr.message);

  const { error: updateErr } = await supabase
    .from("documentos")
    .update({
      status: "rechazado",
      observacion_admin: motivo,
    })
    .eq("id", id);

  if (updateErr) throw new Error(updateErr.message);

  if (!doc?.perfiles?.email) return true;

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

  return true;
}

export async function listarDocumentosPorUsuario(perfilId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documentos")
    .select("id, status")
    .eq("perfil_id", perfilId)
    .eq("status", "aprobado");

  if (error) {
    console.error("Error listando documentos del usuario:", error.message);
    throw new Error("No se pudieron obtener los documentos del usuario");
  }

  return data ?? [];
}

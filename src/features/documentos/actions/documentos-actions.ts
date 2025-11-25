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

  await supabase.from("documentos").update({ status: "aprobado" }).eq("id", id);

  const { data: doc } = await supabase
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

  if (!doc?.perfiles) return;

  const { data: docsUsuario } = await supabase
    .from("documentos")
    .select(`status`)
    .eq("perfil_id", doc.perfil_id);

  const todosAprobados =
    docsUsuario && docsUsuario.every((d: any) => d.status === "aprobado");

  if (todosAprobados) {
    await fetch("/api/email/documento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: doc.perfiles.email,
        nombre: doc.perfiles.nombres,
        tipoDocumento: "todos",
        estado: "aprobado_total",
      }),
    });
  }

  return true;
}

export async function rechazarDocumento(id: string, motivo: string, doc: any) {
  const supabase = await createClient();

  await supabase
    .from("documentos")
    .update({
      status: "rechazado",
      observacion_admin: motivo,
    })
    .eq("id", id);

  await fetch("/api/email/documento", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: doc.perfiles?.email ?? "",
      nombre: doc.perfiles?.nombres ?? "",
      tipoDocumento: doc.tipo,
      estado: "rechazado",
      motivo,
    }),
  });

  return true;
}

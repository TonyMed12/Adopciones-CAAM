"use server";

import { createClient } from "@/lib/supabase/server";
import type { Perfil } from "../types/usuarios";

const PAGE_SIZE = 10;

export async function listarUsuarios({
  cursor,
  search,
}: {
  cursor?: string | null;
  search?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("perfiles")
    .select("*", { count: "exact" })
    .eq("rol_id", 2)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (search && search.trim() !== "") {
    query = query.or(
      `nombres.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  const nextCursor =
    data && data.length === PAGE_SIZE
      ? data[data.length - 1].created_at
      : null;

  return {
    items: data ?? [],
    nextCursor,
    total: count,
  };
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

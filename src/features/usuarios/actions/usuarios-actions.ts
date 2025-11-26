"use server";

import { createClient } from "@/lib/supabase/server";
import type { Perfil } from "../types/usuarios";


export async function listarUsuarios(): Promise<Perfil[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("perfiles")
    .select("*")
    .eq("rol_id", 2)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []) as Perfil[];
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

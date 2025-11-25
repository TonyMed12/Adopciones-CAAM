"use server";
import { supabase } from "@/lib/supabase/client";
import { RazaSchema } from "../schemas/razas-schemas";
import type { Raza } from "../types/razas";

function generarSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

export async function listarRazas() {
  const { data, error } = await supabase
    .from("razas")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function crearRaza(input: unknown) {
  const parsed = RazaSchema.parse(input);
  const slug = generarSlug(parsed.nombre);

  const nuevaRaza = {
    ...parsed,
    slug,
    activa: true,
  };

  const { data, error } = await supabase
    .from("razas")
    .insert(nuevaRaza)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Raza;
}

export async function eliminarRaza(id: string): Promise<{ success: boolean }> {
  const { error } = await supabase.from("razas").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

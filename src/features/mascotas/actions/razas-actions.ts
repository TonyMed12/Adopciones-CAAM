"use server";
import { supabase } from "@/lib/supabase/client";
import { RazaSchema } from "../schemas/razas-schemas";
import type { Raza } from "../types/razas";
import { logger } from "@/lib/logger";

function generarSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

export async function listarRazas() {
  logger.info("listarRazas:start");

  const { data, error } = await supabase
    .from("razas")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    logger.error("listarRazas:supabase_error", {
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("listarRazas:success", {
    returned: data?.length ?? 0,
  });

  return data;
}

export async function crearRaza(input: unknown) {
  const parsed = RazaSchema.parse(input);
  const slug = generarSlug(parsed.nombre);

  logger.info("crearRaza:start", {
    nombre: parsed.nombre,
  });

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

  if (error) {
    logger.error("crearRaza:supabase_error", {
      message: error.message,
      nombre: parsed.nombre,
    });
    throw new Error(error.message);
  }

  logger.info("crearRaza:success", {
    razaId: data.id,
  });

  return data as Raza;
}

export async function eliminarRaza(id: string): Promise<{ success: boolean }> {
  logger.info("eliminarRaza:start", {
    razaId: id,
  });

  const { error } = await supabase.from("razas").delete().eq("id", id);

  if (error) {
    logger.error("eliminarRaza:supabase_error", {
      razaId: id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("eliminarRaza:success", {
    razaId: id,
  });

  return { success: true };
}

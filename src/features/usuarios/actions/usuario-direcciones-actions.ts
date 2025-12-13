"use server";

import { createClient } from "@/lib/supabase/server";
import type { Direccion } from "../types/usuarios";
import { logger } from "@/lib/logger";

export async function obtenerDireccionPrincipal(
  usuarioId: string
): Promise<Direccion | null> {
  const supabase = await createClient();

  logger.info("obtenerDireccionPrincipal:start", {
    usuarioId,
  });

  try {
    const { data, error } = await supabase
      .from("direcciones")
      .select("*")
      .eq("usuario_id", usuarioId)
      .eq("direccion_principal", true)
      .maybeSingle();

    if (error) {
      logger.error("obtenerDireccionPrincipal:supabase_error", {
        usuarioId,
        message: error.message,
      });
      throw new Error(error.message);
    }

    if (!data) {
      logger.info("obtenerDireccionPrincipal:not_found", {
        usuarioId,
      });
      return null;
    }

    logger.info("obtenerDireccionPrincipal:success", {
      usuarioId,
      direccionId: data.id,
    });

    return data as Direccion;
  } catch (err) {
    logger.error("obtenerDireccionPrincipal:unexpected_error", {
      usuarioId,
      error: err instanceof Error ? err.message : err,
    });
    throw err;
  }
}

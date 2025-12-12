"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function obtenerMascotasAdoptadas() {
  const supabase = await createClient();

  logger.info("obtenerMascotasAdoptadas:start");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    logger.warn("obtenerMascotasAdoptadas:not_authenticated", {
      message: userError?.message,
    });
    throw new Error("No se pudo obtener el usuario actual");
  }

  logger.info("obtenerMascotasAdoptadas:user_ok", {
    userId: user.id,
  });

  try {
    const { data, error } = await supabase
      .from("mascotas_adoptadas_detalle")
      .select("*")
      .order("fecha_adopcion", { ascending: false });

    if (error) {
      logger.error("obtenerMascotasAdoptadas:supabase_error", {
        message: error.message,
        userId: user.id,
      });
      throw new Error("Error al obtener mascotas adoptadas");
    }

    const mias = (data || []).filter(
      (r) => r.adoptante_auth_id === user.id
    );

    logger.info("obtenerMascotasAdoptadas:success", {
      userId: user.id,
      total: mias.length,
    });

    return mias;
  } catch (err) {
    logger.error("obtenerMascotasAdoptadas:unexpected_error", {
      userId: user.id,
      error: err instanceof Error ? err.message : err,
    });
    throw err;
  }
}

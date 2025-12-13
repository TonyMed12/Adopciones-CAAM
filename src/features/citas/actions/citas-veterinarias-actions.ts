"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import {
  obtenerAdopcionesIdsPorUsuario,
  obtenerAdopcionesConMascotaYAdoptante,
} from "@/features/adopciones/actions/adopciones-actions";

const PAGE_SIZE = 10;

export type CitaVeterinaria = {
  id: string;
  adopcion_id: string;
  fecha_cita: string;
  motivo: string;
  estado: "pendiente" | "aprobada" | "cancelada";
  created_at: string;
};

export async function listarCitasVeterinariasAdmin({
  cursor,
  search,
}: {
  cursor?: string | null;
  search?: string;
}) {
  const supabase = await createClient();

  logger.info("listarCitasVeterinariasAdmin:start", {
    cursor,
    search,
    pageSize: PAGE_SIZE,
  });

  try {
    let query = supabase
      .from("citas_veterinarias")
      .select(
        `
        id,
        adopcion_id,
        fecha_cita,
        motivo,
        estado,
        observaciones,
        completada,
        created_at
      `,
        { count: "exact" }
      )
      .order("fecha_cita", { ascending: false })
      .limit(PAGE_SIZE);

    if (search && search.trim() !== "") {
      query = query.or(
        `motivo.ilike.%${search}%,estado.ilike.%${search}%`
      );
    }

    if (cursor) {
      query = query.lt("fecha_cita", cursor);
    }

    const { data, error, count } = await query;

    if (error) {
      logger.error("listarCitasVeterinariasAdmin:supabase_error", {
        message: error.message,
        cursor,
        search,
      });
      throw new Error(error.message);
    }

    if (!data?.length) {
      return {
        items: [],
        nextCursor: null,
        total: count ?? 0,
      };
    }

    const adopcionIds = data.map((c) => c.adopcion_id);
    const adopciones = await obtenerAdopcionesConMascotaYAdoptante(adopcionIds);

    const items = data.map((c) => {
      const adop = adopciones.find((a) => a.id === c.adopcion_id);

      const adoptante = adop?.perfiles
        ? `${adop.perfiles.nombres} ${adop.perfiles.apellido_paterno || ""} ${
            adop.perfiles.apellido_materno || ""
          }`.trim()
        : "Desconocido";

      return {
        ...c,
        mascota_nombre: adop?.mascotas?.nombre || "Desconocido",
        mascota_imagen: adop?.mascotas?.imagen_url || null,
        adoptante_nombre: adoptante,
        adoptante_correo: adop?.perfiles?.email || "No disponible",
        estado_adopcion: adop?.estado || "sin estado",
      };
    });

    const nextCursor =
      items.length === PAGE_SIZE
        ? items[items.length - 1].fecha_cita
        : null;

    logger.info("listarCitasVeterinariasAdmin:success", {
      returned: items.length,
      nextCursor,
      total: count,
    });

    return {
      items,
      nextCursor,
      total: count ?? 0,
    };
  } catch (err) {
    logger.error("listarCitasVeterinariasAdmin:unexpected_error", {
      error: err instanceof Error ? err.message : err,
    });
    throw err;
  }
}

export async function cambiarEstadoCitaVeterinaria(
  id: string,
  nuevoEstado: "pendiente" | "aprobada" | "cancelada"
) {
  const supabase = await createClient();

  logger.info("cambiarEstadoCitaVeterinaria:start", {
    id,
    nuevoEstado,
  });

  const { error } = await supabase
    .from("citas_veterinarias")
    .update({ estado: nuevoEstado })
    .eq("id", id);

  if (error) {
    logger.error("cambiarEstadoCitaVeterinaria:error", {
      id,
      nuevoEstado,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("cambiarEstadoCitaVeterinaria:success", {
    id,
    nuevoEstado,
  });

  return true;
}

export async function listarCitasVeterinariasUsuario({
  auth_id,
  cursor,
}: {
  auth_id: string;
  cursor?: string | null;
}) {
  const supabase = await createClient();

  logger.info("listarCitasVeterinariasUsuario:start", {
    auth_id,
    cursor,
    pageSize: PAGE_SIZE,
  });

  try {
    const adopcionIds = await obtenerAdopcionesIdsPorUsuario(auth_id);

    if (!adopcionIds.length) {
      return {
        items: [],
        nextCursor: null,
        total: 0,
      };
    }

    let query = supabase
      .from("citas_veterinarias")
      .select(
        `
        id,
        adopcion_id,
        fecha_cita,
        motivo,
        estado,
        created_at
      `,
        { count: "exact" }
      )
      .in("adopcion_id", adopcionIds)
      .order("fecha_cita", { ascending: false })
      .limit(PAGE_SIZE);

    if (cursor) {
      query = query.lt("fecha_cita", cursor);
    }

    const { data, error, count } = await query;

    if (error) {
      logger.error("listarCitasVeterinariasUsuario:supabase_error", {
        auth_id,
        message: error.message,
      });
      throw new Error(error.message);
    }

    const nextCursor =
      data && data.length === PAGE_SIZE
        ? data[data.length - 1].fecha_cita
        : null;

    logger.info("listarCitasVeterinariasUsuario:success", {
      returned: data?.length ?? 0,
      nextCursor,
      total: count,
    });

    return {
      items: data ?? [],
      nextCursor,
      total: count ?? 0,
    };
  } catch (err) {
    logger.error("listarCitasVeterinariasUsuario:unexpected_error", {
      error: err instanceof Error ? err.message : err,
    });
    throw err;
  }
}

export async function crearCitaVeterinaria({
  adopcion_id,
  fecha_cita,
  motivo,
}: {
  adopcion_id: string;
  fecha_cita: string;
  motivo: string;
}) {
  const supabase = await createClient();

  logger.info("crearCitaVeterinaria:start", {
    adopcion_id,
    fecha_cita,
  });

  const { data, error } = await supabase
    .from("citas_veterinarias")
    .insert({
      adopcion_id,
      fecha_cita,
      motivo,
      estado: "pendiente",
    })
    .select()
    .single();

  if (error) {
    logger.error("crearCitaVeterinaria:error", {
      adopcion_id,
      message: error.message,
    });
    throw new Error(error.message);
  }

  logger.info("crearCitaVeterinaria:success", {
    id: data.id,
  });

  return data;
}

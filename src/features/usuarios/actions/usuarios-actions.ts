"use server";

import { createClient } from "@/lib/supabase/server";
import type { Perfil } from "../types/usuarios";
import { logger } from "@/lib/logger";

const PAGE_SIZE = 10;

export async function listarUsuarios({
  cursor,
  search,
}: {
  cursor?: string | null;
  search?: string;
}) {
  const supabase = await createClient();

  logger.info("listarUsuarios:start", {
    cursor,
    search,
    pageSize: PAGE_SIZE,
  });

  try {
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

    if (error) {
      logger.error("listarUsuarios:supabase_error", {
        message: error.message,
        cursor,
        search,
      });
      throw new Error(error.message);
    }

    const nextCursor =
      data && data.length === PAGE_SIZE
        ? data[data.length - 1].created_at
        : null;

    logger.info("listarUsuarios:success", {
      returned: data?.length ?? 0,
      nextCursor,
      total: count,
    });

    return {
      items: data ?? [],
      nextCursor,
      total: count,
    };
  } catch (err) {
    logger.error("listarUsuarios:unexpected_error", {
      error: err instanceof Error ? err.message : err,
    });
    throw err;
  }
}

export async function contarUsuarios(): Promise<number> {
  const supabase = await createClient();

  logger.info("contarUsuarios:start");

  try {
    const { count, error } = await supabase
      .from("perfiles")
      .select("*", { count: "exact", head: true })
      .eq("rol_id", 2);

    if (error) {
      logger.error("contarUsuarios:supabase_error", {
        message: error.message,
      });
      throw new Error(error.message);
    }

    logger.info("contarUsuarios:success", { count });

    return count ?? 0;
  } catch (err) {
    logger.error("contarUsuarios:unexpected_error", {
      error: err instanceof Error ? err.message : err,
    });
    throw err;
  }
}

// Esto no lo quiten lo ocupa las citas <----
export async function fetchUsuariosByIds(ids: string[]) {
  const supabase = await createClient();

  logger.info("fetchUsuariosByIds:start", {
    idsCount: ids.length,
  });

  try {
    const { data, error } = await supabase
      .from("perfiles")
      .select("id, nombres, apellido_paterno, apellido_materno, email")
      .in("id", ids);

    if (error) {
      logger.error("fetchUsuariosByIds:supabase_error", {
        message: error.message,
        ids,
      });
      throw new Error(error.message);
    }

    logger.info("fetchUsuariosByIds:success", {
      returned: data?.length ?? 0,
    });

    return data ?? [];
  } catch (err) {
    logger.error("fetchUsuariosByIds:unexpected_error", {
      error: err instanceof Error ? err.message : err,
    });
    throw err;
  }
}

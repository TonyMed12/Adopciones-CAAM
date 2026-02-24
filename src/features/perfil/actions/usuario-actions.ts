"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/require-role";

export async function obtenerNombreUsuarioActual() {
    const { perfilId } = await requireRole(2);

    const { data, error } = await supabaseAdmin
        .from("perfiles")
        .select("nombres")
        .eq("id", perfilId)
        .single();

    if (error) throw new Error(error.message);

    return data?.nombres ?? "Usuario";
}
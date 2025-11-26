"use server";

import { createClient } from "@/lib/supabase/server";
import type { Direccion } from "../types/usuarios";

export async function obtenerDireccionPrincipal(usuarioId: string): Promise<Direccion | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("direcciones")
        .select("*")
        .eq("usuario_id", usuarioId)
        .eq("direccion_principal", true)
        .maybeSingle();

    if (error) throw new Error(error.message);

    return (data ?? null) as Direccion | null;
}

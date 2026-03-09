"use server";

import { createClient } from "@/lib/supabase/server";

export async function obtenerNombreUsuarioActual() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return "Usuario";
    }

    const { data, error } = await supabase
        .from("perfiles")
        .select("nombres")
        .eq("id", user.id)
        .single();

    if (error) {
        console.error(error);
        return "Usuario";
    }

    return data?.nombres ?? "Usuario";
}
"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

async function fetchUsuarioNombre() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: perfil } = await supabase
        .from("perfiles")
        .select("nombres")
        .eq("id", user.id)
        .single();

    return perfil?.nombres ?? null;
}

export function useUsuarioNombre() {
    return useQuery({
        queryKey: ["usuario-nombre"],
        queryFn: fetchUsuarioNombre,
        staleTime: 1000 * 60 * 5,
    });
}

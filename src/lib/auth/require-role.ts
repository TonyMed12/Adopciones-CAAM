import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireBetterAuthEmail } from "./require-session";

export async function requireRole(rolEsperado: 1 | 2) {
    const email = await requireBetterAuthEmail();

    const { data: perfil, error } = await supabaseAdmin
        .from("perfiles")
        .select("id, rol_id, email")
        .eq("email", email)
        .maybeSingle();

    if (error || !perfil?.rol_id) throw new Error("FORBIDDEN");
    if (perfil.rol_id !== rolEsperado) throw new Error("FORBIDDEN");

    return { email, perfilId: perfil.id, rol_id: perfil.rol_id as 1 | 2 };
}

export async function requireAnyRole() {
    const email = await requireBetterAuthEmail();

    const { data: perfil, error } = await supabaseAdmin
        .from("perfiles")
        .select("id, rol_id, email")
        .eq("email", email)
        .maybeSingle();

    if (error || !perfil?.rol_id) throw new Error("FORBIDDEN");

    return { email, perfilId: perfil.id, rol_id: perfil.rol_id as 1 | 2 };
}
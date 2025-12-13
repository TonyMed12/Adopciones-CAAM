import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 10;

export function baseMascotasQuery(
    supabase: Awaited<ReturnType<typeof createClient>>
) {
    return supabase
        .from("mascotas")
        .select(
            "*, raza:raza_id!inner(id, nombre, especie)",
            { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);
}

export { PAGE_SIZE };

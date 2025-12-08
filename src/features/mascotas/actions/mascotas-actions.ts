"use server";
import { createClient } from "@/lib/supabase/server";
import { CreateMascotaSchema, UpdateMascotaSchema, DeleteMascotaSchema } from "../schemas/mascotas-schemas";
import type { Mascota } from "../types/mascotas";

import { deleteMascotaImagen } from "./storage/deleteMascotaImagen";
import { deleteMascotaQR } from "./storage/deleteMascotaQR";
import { validarMascotaEliminable } from "./helpers/validarMascotaEliminable";


const PAGE_SIZE = 10;

// Cuando cambie la busqueda se resetea el page
// El page depende de la pagina en la que se encuentre el usuario
export async function listarMascotas({
    cursor,
    search,
    especie,
    sexo,
}: {
    cursor?: string | null;
    search?: string;
    especie?: string;
    sexo?: string;
}) {
    const supabase = await createClient();

    let query = supabase
        .from("mascotas")
        .select("*, raza:raza_id!inner(id, nombre, especie)", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);

    if (search && search.trim() !== "") {
        query = query.ilike("nombre", `%${search}%`);
    }

    if (especie && especie !== "Todas") {
        query = query.eq("raza.especie", especie);
    }

    if (sexo && sexo !== "Todos") {
        query = query.eq("sexo", sexo.toLowerCase());
    }
    
    // Cursor
    if (cursor) {
        query = query.lt("created_at", cursor);
    }

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    const nextCursor =
        data?.length === PAGE_SIZE
            ? data[data.length - 1].created_at
            : null;

    return {
        items: data,
        nextCursor,
        total: count,
    };
}



/* ======================== CREAR ======================== */
export async function crearMascota(input: unknown): Promise<Mascota> {
    const supabase = await createClient();
    const parsed = CreateMascotaSchema.parse(input);

    const { data, error } = await supabase
        .from("mascotas")
        .insert(parsed)
        .select("*, raza:raza_id(id, nombre, especie)")
        .single();

    if (error) throw new Error(error.message);

    return data as Mascota;
}


/* ======================== ACTUALIZAR ======================== */
export async function actualizarMascota(payload: unknown) {
    const supabase = await createClient();
    const parsed = UpdateMascotaSchema.parse(payload);

    const { data, error } = await supabase
        .from("mascotas")
        .update({
            ...parsed,
            updated_at: new Date().toISOString(),
        })
        .eq("id", parsed.id)
        .select("*, raza:raza_id(id, nombre, especie)")
        .single();

    if (error) throw error;

    return data;
}

/* ======================== ELIMINAR ======================== */
export async function eliminarMascota(id: string): Promise<{ success: boolean; reason?: string }> {
    const supabase = await createClient();
    const parsed = DeleteMascotaSchema.parse({ id });

    const validacion = await validarMascotaEliminable(parsed.id);

    if (!validacion.success) {
        return validacion;
    }

    const { imagen_url, qr_code } = validacion.mascota!;

    if (imagen_url) {
        await deleteMascotaImagen(parsed.id);
    }

    if (qr_code) {
        await deleteMascotaQR(qr_code);
    }

    const { error: deleteError } = await supabase
        .from("mascotas")
        .delete()
        .eq("id", parsed.id);

    if (deleteError) {
        return { success: false, reason: "error_eliminar" };
    }

    return { success: true };
}


// OBTENER UNA POR ID
export async function obtenerMascotaPorId(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("mascotas")
        .select("*, raza:raza_id(id, nombre, especie)")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error obteniendo mascota:", error.message);
        throw new Error("No se encontró la mascota");
    }

    return data;
}

// OBTENER VARIAS POR IDS
export async function fetchMascotasByIds(ids: string[]) {
    if (ids.length === 0) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("mascotas")
        .select("id, nombre")
        .in("id", ids);

    if (error) throw new Error(error.message);

    return data ?? [];
}
export async function marcarMascotaAdoptada(
    supabaseSrv: any,
    mascotaId: string
) {
    const { error } = await supabaseSrv
        .from("mascotas")
        .update({ estado: "adoptada", disponible_adopcion: false })
        .eq("id", mascotaId);

    if (error)
        console.error("⚠️ Error marcando mascota como adoptada:", error.message);
}


export async function marcarMascotaDisponible(mascotaId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("mascotas")
        .update({
            estado: "disponible",
            disponible_adopcion: true,
            updated_at: new Date().toISOString(),
        })
        .eq("id", mascotaId);

    if (error) {
        console.error("⚠️ Error liberando mascota:", error.message);
        throw new Error("No se pudo liberar la mascota");
    }

    return true;
}
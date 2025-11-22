"use server";
import { createClient } from "@/lib/supabase/server";
import { CreateMascotaSchema, UpdateMascotaSchema, DeleteMascotaSchema } from "../schemas/mascotas-schemas";
import type { Mascota } from "../types/mascotas";


import { uploadMascotaArchivos } from "./storage/uploadMascotaArchivos";
import { deleteMascotaImagen } from "./storage/deleteMascotaImagen";
import { deleteMascotaQR } from "./storage/deleteMascotaQR";

export async function listarMascotas() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("mascotas")
        .select("*, raza:raza_id(id, nombre, especie)")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data;
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

    const { data: mascota, error } = await supabase
        .from("mascotas")
        .select("estado, disponible_adopcion, imagen_url, qr_code")
        .eq("id", parsed.id)
        .maybeSingle();

    if (error) return { success: false, reason: "error_estado" };
    if (!mascota) return { success: false, reason: "no_existe" };

    if (mascota.estado !== "disponible" || mascota.disponible_adopcion !== true)
        return { success: false, reason: "no_eliminable" };

    if (mascota.imagen_url) {
        const fileName = mascota.imagen_url.split("/").pop()?.split("?")[0];
        if (fileName) await deleteMascotaImagen(parsed.id);
    }

    if (mascota.qr_code) {
        await deleteMascotaQR(mascota.qr_code);
    }

    const { error: deleteError } = await supabase
        .from("mascotas")
        .delete()
        .eq("id", parsed.id);

    if (deleteError) return { success: false, reason: "error_eliminar" };
    return { success: true };
}


// OBTENER POR ID
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

"use server";
import {supabase} from "@/lib/supabase/client";
import {CreateMascotaSchema, UpdateMascotaSchema, DeleteMascotaSchema} from "./mascotas-schemas";
import type {Mascota} from "./mascotas";
import {no} from "zod/locales";

export async function listarMascotas(): Promise<Mascota[]> {
    const {data, error} = await supabase
    .from("mascotas")
    .select(
        `
      id,
      nombre,
      sexo,
      tamano,
      edad,
      personalidad,
      descripcion_fisica,
      imagen_url,
      disponible_adopcion,
      raza:raza_id (
        id,
        nombre,
        especie
      )
    `
    )
    .order("created_at", {ascending: false});

    if (error) throw new Error(error.message);
    return data as unknown as Mascota[];
}

export async function crearMascota(input: unknown): Promise<Mascota> {
    const parsed = CreateMascotaSchema.parse(input);

    const normalized = {
        ...parsed,
        sexo: parsed.sexo.toLowerCase(),
    };

    const {data, error} = await supabase
    .from("mascotas")
    .insert(normalized)
    .select("*, raza:raza_id(id, nombre, especie)")
    .single();
    if (error) throw new Error(error.message);
    return data as Mascota;
}

export async function actualizarMascota(input: unknown): Promise<Mascota> {
    const parsed = UpdateMascotaSchema.parse(input);
    const {id, ...updates} = parsed;
    const {data, error} = await supabase.from("mascotas").update(updates).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data as Mascota;
}

export async function eliminarMascota(id: string): Promise<{success: boolean}> {
    const parsed = DeleteMascotaSchema.parse({id}); // 👈 validamos aquí
    const {error} = await supabase.from("mascotas").delete().eq("id", parsed.id);
    if (error) throw new Error(error.message);
    return {success: true};
}

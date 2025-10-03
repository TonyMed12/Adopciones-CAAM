import { createClient } from "@/lib/supabase/server";
import { type CreateMascotaPayload } from "../dto/create-mascota.dto";
import { type MascotaEntity } from "../entities/mascota.entity";
export type { CreateMascotaPayload } from "../dto/create-mascota.dto";

export async function createMascota(mascotaData: CreateMascotaPayload): Promise<MascotaEntity> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("mascotas")
        .insert(mascotaData)
        .select(`
            *,
            raza:razas (
                id,
                nombre,
                tamano,
                especie
            )
        `)
        .single();

    if (error) {
        console.error("Error al crear la mascota:", error.message);
        throw new Error("No se pudo registrar la nueva mascota.");
    }

    return data as MascotaEntity;
}

export async function getMascotas(): Promise<MascotaEntity[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("mascotas")
        .select(`
            *,
            raza:razas (
                id,
                nombre,
                tamano,
                especie
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error al obtener las mascotas:", error.message);
        throw new Error("No se pudieron cargar las mascotas.");
    }

    return data as MascotaEntity[];
}
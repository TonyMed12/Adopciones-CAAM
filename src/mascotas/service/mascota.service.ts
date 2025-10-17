"use server"
import {createClient} from "@/lib/supabase/server";
import {type CreateMascotaPayload} from "../dto/create-mascota.dto";
import {type MascotaEntity} from "../entities/mascota.entity";

export async function getRazas(especie: string) {
    const supabase = await createClient();

    const {data, error} = await supabase
    .from("razas") 
    .select("id, nombre")
    .eq("especie", especie) 
    .order("nombre"); 

    if (error) {
        console.error("Error al obtener las razas:", error.message);
        throw new Error("No se pudieron cargar las razas.");
    }

    return data;
}

export async function createMascota(mascotaData: CreateMascotaPayload) {
    const supabase = await createClient();

    const {data, error} = await supabase
    .from("mascotas")
    .insert(mascotaData)
    .select("*, razas(nombre, tamano)")
    .single(); 

    if (error) {
        console.error("Error al crear la mascota:", error.message);
        throw new Error("No se pudo registrar la nueva mascota.");
    }
    return data as MascotaEntity;
}

export async function getMascotas() {
    const supabase = await createClient();

    const {data, error} = await supabase
    .from("mascotas")
    .select("*, razas(nombre, tamano)")
    .order("created_at", {ascending: false});

    if (error) {
        console.error("Error al obtener las mascotas:", error.message);
        throw new Error("No se pudieron cargar las mascotas.");
    }

    return data as MascotaEntity[];
}

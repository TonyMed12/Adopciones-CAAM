import {
    listarMascotas,
    obtenerMascotaPorId,
    crearMascota,
    actualizarMascota,
    eliminarMascota,
} from "../actions/mascotas-actions";
import type { Mascota } from "../types/mascotas";

export const fetchMascotas = async (): Promise<Mascota[]> => {
    return await listarMascotas();
};

export const fetchMascotaById = async (id: string): Promise<Mascota | null> => {
    return await obtenerMascotaPorId(id);
};

export const createMascotaMutation = async (payload: unknown, imagen?: File) => {
    return await crearMascota(payload, imagen);
};

export const updateMascotaMutation = async (payload: unknown, imagen?: File) => {
    return await actualizarMascota(payload, imagen);
};

export const deleteMascotaMutation = async (id: string) => {
    return await eliminarMascota(id);
};
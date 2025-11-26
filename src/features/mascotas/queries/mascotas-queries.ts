import {
    listarMascotas,
    obtenerMascotaPorId,
    crearMascota,
    actualizarMascota,
    eliminarMascota,
} from "../actions/mascotas-actions";
import { obtenerMascotasAdoptadas } from "@/features/usuarios/actions/usuario-mascotas-actions";
import type { Mascota } from "../types/mascotas";
import type { CreateMascotaPayload, UpdateMascotaPayload } from "../data/types";

export const fetchMascotas = async (): Promise<Mascota[]> => {
    return await listarMascotas();
};

export const fetchMascotaById = async (id: string): Promise<Mascota | null> => {
    return await obtenerMascotaPorId(id);
};

export const createMascotaMutation = async (
    payload: CreateMascotaPayload
): Promise<Mascota> => {
    return await crearMascota(payload);
};

export const updateMascotaMutation = async (
    payload: UpdateMascotaPayload
): Promise<Mascota> => {
    return await actualizarMascota(payload);
};

export const deleteMascotaMutation = async (id: string) => {
    return await eliminarMascota(id);
};

export async function fetchMascotasAdoptadas() {
    return await obtenerMascotasAdoptadas();
}
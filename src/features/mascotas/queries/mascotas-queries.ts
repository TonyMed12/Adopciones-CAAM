import {
    obtenerMascotaPorId,
    crearMascota,
    actualizarMascota,
    eliminarMascota,
} from "../actions/mascotas-actions";
import { obtenerMascotasAdoptadas } from "@/features/usuarios/actions/usuario-mascotas-actions";
import type { Mascota } from "../types/mascotas";
import type { CreateMascotaPayload, UpdateMascotaPayload } from "../data/types";


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

export const mascotasPublicasKeys = {
    all: ["mascotas-publicas"] as const,

    infinite: (params: {
        search?: string;
        especie?: string;
        sexo?: string;
    }) =>
        [
            ...mascotasPublicasKeys.all,
            "infinite",
            params.search ?? "",
            params.especie ?? "Todas",
            params.sexo ?? "Todos",
        ] as const,
};
import {
    listarCitas,
    listarCitasRango,
    reprogramarCita,
    actualizarEstadoCita,
    evaluarCita,
    cancelarCita,
} from "../actions/citas-actions";

import type { Cita } from "../types/cita";
import type { RawCita } from "../types/cita";
import { mapCita } from "../mappers/cita.mapper";
import { fetchUsuariosByIds } from "@/features/usuarios/actions/usuarios-actions";
import { fetchMascotasByIds } from "@/features/mascotas/actions/mascotas-actions";


export const fetchCitas = async (): Promise<Cita[]> => {
    const raw: RawCita[] = await listarCitas();

    const usuarioIds = raw
        .map(c => c.usuario_id)
        .filter((id): id is string => id !== null);

    const mascotaIds = raw
        .map(c => c.mascota_id)
        .filter((id): id is string => id !== null);

    const [usuarios, mascotas] = await Promise.all([
        fetchUsuariosByIds(usuarioIds),
        fetchMascotasByIds(mascotaIds),
    ]);

    const usuarioMap = new Map(usuarios.map(u => [u.id, u]));
    const mascotaMap = new Map(mascotas.map(m => [m.id, m]));

    return raw.map(c => {
        const usuario = c.usuario_id
            ? usuarioMap.get(c.usuario_id) ?? null
            : null;

        const mascotaItem = c.mascota_id
            ? mascotaMap.get(c.mascota_id) ?? null
            : null;

        const mascotasArray = mascotaItem ? [mascotaItem] : [];

        return mapCita({
            ...c,
            usuario,
            mascotas: mascotasArray,
        });
    });
};




export const reprogramarCitaMutation = async (
    params: { id: string; fecha: string; hora: string }
) => {
    return await reprogramarCita(params.id, params.fecha, params.hora);
};

export const cancelarCitaMutation = async (id: string) => {
    return await cancelarCita(id);
};

export const fetchCitasRango = async (
    desdeISO: string,
    hastaISO: string
): Promise<RawCita[]> => {
    return await listarCitasRango(desdeISO, hastaISO);
};

export const evaluarCitaMutation = async (params: {
    id: string;
    nuevoEstado: "programada" | "completada" | "cancelada";
    asistencia: Cita["asistencia"];
    interaccion: Cita["interaccion"];
    nota: string | null;
}): Promise<RawCita> => {
    return await evaluarCita(params.id, params.nuevoEstado, {
        asistencia: params.asistencia,
        interaccion: params.interaccion,
        nota: params.nota,
    });
};

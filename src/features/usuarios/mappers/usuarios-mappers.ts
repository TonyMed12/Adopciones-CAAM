// src/features/usuarios/mappers/usuarios-mappers.ts

import type {
    Perfil,
    PerfilConDireccion,
    Direccion,
} from "../types/usuarios";
import type { AdopcionUsuario } from "../types/usuarios";

export interface MascotaRaw {
    id: string;
    nombre: string;
    imagen_url: string | null;
}

export interface AdopcionRaw {
    id: string;
    numero_adopcion: string;
    fecha_adopcion: string;
    estado: string;
    mascota: MascotaRaw | null;
}

export function mapPerfilConDireccion(
    perfil: Perfil,
    direccion: Direccion | null
): PerfilConDireccion {
    return {
        ...perfil,
        direccion,
    };
}

export function mapAdopcionUsuario(raw: AdopcionRaw): AdopcionUsuario {
    return {
        id: raw.id,
        numero_adopcion: raw.numero_adopcion,
        fecha_adopcion_raw: raw.fecha_adopcion,
        fecha_adopcion: raw.fecha_adopcion,
        estado: raw.estado,
        mascota_nombre: raw.mascota?.nombre ?? "Mascota",
        imagen_url: raw.mascota?.imagen_url ?? null,
    };
}

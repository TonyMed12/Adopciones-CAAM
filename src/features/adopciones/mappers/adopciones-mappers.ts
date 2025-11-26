import type { AdopcionUsuario } from "../types/adopciones";

interface MascotaRaw {
    id: string;
    nombre: string;
    imagen_url: string | null;
}

interface AdopcionRaw {
    id: string;
    numero_adopcion: string;
    fecha_adopcion: string;
    estado: string;
    mascota: MascotaRaw | null | MascotaRaw[];
}

export function mapAdopcionUsuario(raw: AdopcionRaw): AdopcionUsuario {
    return {
        id: raw.id,
        numero_adopcion: raw.numero_adopcion,
        fecha_adopcion_raw: raw.fecha_adopcion,
        fecha_adopcion: raw.fecha_adopcion,
        estado: raw.estado,

        mascota_nombre:
            raw.mascota && !Array.isArray(raw.mascota)
                ? raw.mascota.nombre
                : "Mascota",

        imagen_url:
            raw.mascota && !Array.isArray(raw.mascota)
                ? raw.mascota.imagen_url ?? null
                : null,
    };
}

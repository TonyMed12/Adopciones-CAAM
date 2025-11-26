import type { SolicitudUsuario } from "../types/solicitudes";
import type { SolicitudUsuarioRaw } from "../types/solicitudes";

export function mapSolicitudUsuario(raw: SolicitudUsuarioRaw): SolicitudUsuario {
    return {
        id: raw.id,
        estado: raw.estado,
        fecha_creada: raw.fecha_creada,
        mascota:
            raw.mascota === null || Array.isArray(raw.mascota)
                ? null
                : {
                    id: raw.mascota.id,
                    nombre: raw.mascota.nombre,
                    imagen_url: raw.mascota.imagen_url ?? null,
                },
    };
}

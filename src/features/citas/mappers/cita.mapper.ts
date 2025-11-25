import type { RawCita, Cita } from "../types/cita";

export function mapCita(raw: RawCita): Cita {
    return {
        id: raw.id,
        fecha_cita: raw.fecha_cita,
        hora_cita: raw.hora_cita,
        estado: raw.estado,
        creada_en: raw.creada_en ?? null,

        usuario: raw.usuario
            ? {
                id: raw.usuario.id,
                nombres: raw.usuario.nombres,
                apellido_paterno: raw.usuario.apellido_paterno ?? null,
                apellido_materno: raw.usuario.apellido_materno ?? null,
                email: raw.usuario.email,
            }
            : null,

        mascota:
            raw.mascotas && raw.mascotas.length > 0
                ? {
                    id: raw.mascotas[0].id,
                    nombre: raw.mascotas[0].nombre,
                }
                : null,

        asistencia: raw.asistencia ?? null,
        interaccion: raw.interaccion ?? null,
        nota: raw.nota ?? null,
    };
}

export function mapCitas(raw: RawCita[]): Cita[] {
    return raw.map(mapCita);
}

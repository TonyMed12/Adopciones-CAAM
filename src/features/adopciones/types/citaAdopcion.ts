import type { MascotaBasica } from "@/features/mascotas/types/mascotas";

export type EstadoCitaAdopcion =
    | "programada"
    | "completada"
    | "cancelada";

export type AsistenciaCita =
    | "asistio"
    | "no_asistio_no_apto"
    | null;

export type InteraccionCita =
    | "buena_aprobada"
    | "no_apta"
    | null;

export interface CitaAdopcion {
    id: string;

    solicitud_id: string;

    fecha_cita: string;
    hora_cita: string;

    estado: EstadoCitaAdopcion;

    asistencia: AsistenciaCita;
    interaccion: InteraccionCita;

    mascota: MascotaBasica | null;
}

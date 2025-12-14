export type EstadoSolicitud = "pendiente" | "en_proceso";

export type MascotaBasica = {
    nombre: string;
    imagen_url: string | null;
};

export type SolicitudActiva = {
    id: string;
    estado: EstadoSolicitud;
    mascota_id: string;
    mascota: MascotaBasica;
};

export type CitaAdopcion = {
    id: string;
    solicitud_id: string | null;
    fecha_cita: string;
    hora_cita: string;
    estado: string | null;
    asistencia: string | null;
    interaccion: string | null;
    mascota: MascotaBasica | null;
};

export type ProcesoAdopcionData = {
    solicitudActiva: SolicitudActiva | null;
    citaActiva: CitaAdopcion | null;
    yaTieneAdopcion: boolean;
    adopcionEstado: string | null;
};

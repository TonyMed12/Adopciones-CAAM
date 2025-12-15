export type MascotaLite = {
    id: string;
    nombre: string;
    imagen_url: string | null;
    estado: string;
};

export type SolicitudActiva = {
    id: string;
    estado: "pendiente" | "en_proceso";
    created_at: string;
    mascota: MascotaLite | null;
};

export type CitaProgramada = {
    id: string;
    fecha_cita: string;
    hora_cita: string;
    estado: "programada";
    mascota: MascotaLite | null;
};

export type MisCitasBackendDTO = {
    perfil: {
        id: string;
        nombres: string;
        email: string;
    };
    solicitudActiva: SolicitudActiva | null;
    adopcionEstado: "pendiente" | "aprobada" | "rechazada" | null;
    citaProgramada: CitaProgramada | null;
};

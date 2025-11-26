export interface SolicitudUsuario {
    id: string;
    estado: string;
    fecha_creada: string;
    mascota: {
        id: string;
        nombre: string;
        imagen_url: string | null;
    } | null;
}

export interface MascotaRaw {
    id: string;
    nombre: string;
    imagen_url: string | null;
}

export interface SolicitudUsuarioRaw {
    id: string;
    estado: string;
    fecha_creada: string;
    mascota: MascotaRaw | null | MascotaRaw[]; // Supabase puede devolver []
}

export interface SolicitudCompleta {
    id: string;
    numero_solicitud: string;
    estado: string;
    created_at: string;
    motivo_adopcion: string;
    mascota: {
        id: string;
        nombre: string;
        imagen_url: string | null;
    } | null;
}

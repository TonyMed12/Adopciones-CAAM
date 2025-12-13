export interface DocumentoActividadRow {
    created_at: string;
    tipo: string;
    perfiles: {
        nombres: string | null;
    } | null;
}

export interface CitaAdopcionActividadRow {
    estado: string;
    creada_en: string;
    perfiles: {
        nombres: string | null;
    } | null;
    mascotas: {
        nombre: string | null;
    } | null;
}

export interface CitaVeterinariaActividadRow {
    estado: string;
    created_at: string;
    adopciones: {
        adoptante: { nombres: string | null } | null;
        mascota: { nombre: string | null } | null;
    } | null;
}

export interface MascotaAdoptadaActividadRow {
    nombre: string;
    updated_at: string;
}


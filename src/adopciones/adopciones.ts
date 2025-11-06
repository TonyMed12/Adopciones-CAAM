// adopciones.ts
export type EstadoAdopcion = "pendiente" | "aprobada" | "rechazada";

export interface Adopcion {
    id: string;
    solicitud_id: string;
    numero_adopcion: string;
    fecha_adopcion: string;
    admin_responsable: string | null;
    contrato_url: string | null;
    seguimiento_programado: string | null;

    tipo_vivienda: string | null;
    espacio_disponible: string | null;
    otras_mascotas: boolean | null;
    detalle_otras_mascotas: string | null;
    evidencia_hogar_urls: string[] | null;
    compromiso_seguimiento: boolean | null;
    compromiso_cuidado: boolean | null;
    observaciones_usuario: string | null;
    observaciones_admin: string | null;

    estado: EstadoAdopcion;
    fecha_revision: string | null;
    created_at: string | null;
}

export type NuevaAdopcion = {
    solicitud_id: string;
    tipo_vivienda: string;
    espacio_disponible: string;
    otras_mascotas: boolean;
    detalle_otras_mascotas?: string | null;
    evidencia_hogar_urls: string[];
    compromiso_seguimiento: boolean;
    compromiso_cuidado: boolean;
    observaciones_usuario?: string | null;
};

export type RevisionAdopcion = {
    id: string;
    admin_responsable: string;
    estado: "aprobada" | "rechazada";
    observaciones_admin?: string | null;
    contrato_url?: string | null;
    seguimiento_programado?: string | null;
};

export type AdopcionAdminRow = {
    id: string;
    estado: EstadoAdopcion;
    created_at: string | null;

    usuario_id: string | null;
    usuarioNombre: string | null;

    mascota_id: string | null;
    mascotaNombre: string | null;
    mascotaImagen: string | null;

    tipo_vivienda: string | null;
    espacio_disponible: string | null;
    otras_mascotas: boolean | null;

    evidencias: string[];
    observaciones_usuario: string | null;
    observaciones_admin: string | null;
};

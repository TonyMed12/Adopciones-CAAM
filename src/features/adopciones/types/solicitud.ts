export type SolicitudAdopcionUI = {
    id: string;
    mascota_id: string | null;
    mascota?: {
        nombre?: string | null;
        imagen_url?: string | null;
    } | null;
};

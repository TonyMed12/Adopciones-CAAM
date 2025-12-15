export type MascotaBasica = {
    id: string;
    nombre: string;
    imagen_url: string | null;
    estado: string;
};

export type SolicitudActiva = {
    id: string;
    estado: string;
    created_at: string;
    mascota: MascotaBasica | null;
};

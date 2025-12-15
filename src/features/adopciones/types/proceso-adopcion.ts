export type EstadoSolicitud = "pendiente" | "en_proceso";
import type { CitaAdopcion } from "./citaAdopcion";
import type { EstadoAdopcion } from "./adopciones";

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

export type ProcesoAdopcionData = {
    solicitudActiva: SolicitudActiva | null;
    citaActiva: CitaAdopcion | null;
    yaTieneAdopcion: boolean;
    adopcionEstado: EstadoAdopcion | null;
};

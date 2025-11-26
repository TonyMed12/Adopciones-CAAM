export interface DashboardStats {
    documentosPendientes: number;
    citasHoy: number;
    citasSemana: number;
    usuariosProceso: number;
    mascotasAdoptables: number;

    citasAdopPend: number;
    citasVetPend: number;
}

export interface DashboardPendiente {
    id: number;
    descripcion: string;
    link: string;
}

export type ActividadTipo = "documento" | "cita" | "mascota";

export interface ActividadItemType {
    tipo: ActividadTipo;
    mensaje: string;
    fecha: string; 
}

export interface DashboardStatsQuery {
    data: DashboardStats | undefined;
    isLoading: boolean;
    isFetching: boolean;
    error: unknown;
}

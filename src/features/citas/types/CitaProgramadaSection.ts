import type { EstadoDocumentos } from "@/features/adopciones/types/documentos";

export type CitaProgramadaUI = {
    estado: "programada" | "completada" | "cancelada" | null;
    fecha_cita: string;
    hora_cita: string;
    mascota: {
        nombre: string;
    } | null;
    asistencia: "asistio" | "no_asistio_no_apto" | null;
    interaccion: "buena_aprobada" | "no_apta" | null;
};

export interface CitaProgramadaSectionProps {
    citaActiva: CitaProgramadaUI;
    estado: EstadoDocumentos;
    onVerCita: () => void;
}
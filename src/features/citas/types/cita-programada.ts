import type { MascotaLite } from "@/features/citas/types/mis-citas";

export type CitaProgramada = {
    id: string;
    fecha_cita: string; 
    hora_cita: string;  
    mascota: MascotaLite | null;
};

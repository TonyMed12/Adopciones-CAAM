import type { Cita } from "@/features/citas/types/cita";
import type { CitaProgramadaUI } from
    "@/features/citas/types/CitaProgramadaSection";

export function mapCitaToCitaProgramadaUI(
    cita: Cita
): CitaProgramadaUI {
    return {
        estado: cita.estado ?? null,

        fecha_cita: cita.fecha_cita,
        hora_cita: cita.hora_cita,

        mascota: cita.mascota
            ? {
                nombre: cita.mascota.nombre,
            }
            : null,

        asistencia: cita.asistencia ?? null,
        interaccion: cita.interaccion ?? null,
    };
}

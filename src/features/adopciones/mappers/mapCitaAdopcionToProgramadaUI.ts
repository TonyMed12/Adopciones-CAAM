import type { CitaAdopcion } from "@/features/adopciones/types/citaAdopcion";
import type { CitaProgramadaUI } from
    "@/features/citas/types/CitaProgramadaSection";

export function mapCitaToCitaProgramadaUI(
    cita: CitaAdopcion
): CitaProgramadaUI {
    return {
        estado:
            cita.estado === "programada" ||
                cita.estado === "completada" ||
                cita.estado === "cancelada"
                ? cita.estado
                : null,

        fecha_cita: cita.fecha_cita,
        hora_cita: cita.hora_cita,

        mascota: cita.mascota
            ? { nombre: cita.mascota.nombre }
            : null,

        asistencia: cita.asistencia,
        interaccion: cita.interaccion,
    };
}

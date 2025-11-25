import type { EvaluacionInput } from "../actions/validations/validarEvaluacionCita";

export type ResultadoEvaluacion = {
    estadoCita: "completada" | "cancelada";
    estadoSolicitud: "en_proceso" | "rechazada" | "pendiente" | null;
    asistencia: string | null;
    interaccion: string | null;
    nota: string | null;
};

export function resolverLogicaEvaluacionCita(input: EvaluacionInput): ResultadoEvaluacion {
    const asistencia = input.asistencia ?? null;
    let interaccion = input.interaccion ?? null;
    const nota = input.nota ?? null;

    /** Caso especial que pediste */
    if (asistencia === "no_asistio_no_apto") {
        interaccion = "no_apta";
    }

    let estadoCita: "completada" | "cancelada" = "cancelada";
    let estadoSolicitud: ResultadoEvaluacion["estadoSolicitud"] = null;

    if (asistencia === "asistio" && interaccion === "buena_aprobada") {
        estadoCita = "completada";
        estadoSolicitud = "en_proceso";
    }

    if (asistencia === "asistio" && interaccion === "no_apta") {
        estadoCita = "cancelada";
        estadoSolicitud = "rechazada";
    }

    if (asistencia === "no_asistio_no_apto") {
        estadoSolicitud = "pendiente";
    }

    return {
        estadoCita,
        estadoSolicitud,
        asistencia,
        interaccion,
        nota,
    };
}

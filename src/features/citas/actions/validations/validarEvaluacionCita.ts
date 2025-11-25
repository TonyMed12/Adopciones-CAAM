import type { Asistencia, Interaccion } from "../../types/cita";

export type EvaluacionInput = {
    asistencia: Asistencia | null | undefined;
    interaccion: Interaccion | null | undefined;
    nota: string | null | undefined;
};


export function validarEvaluacionCita(input: EvaluacionInput) {
    const errores: string[] = [];

    const asistenciaValida: Asistencia[] = [
        "asistio",
        "no_asistio_no_apto"
    ];

    if (!input.asistencia) {
        errores.push("La asistencia es obligatoria.");
    } else if (!asistenciaValida.includes(input.asistencia)) {
        errores.push("Asistencia no válida.");
    }

    const interaccionesValidas: Interaccion[] = [
        "buena_aprobada",
        "no_apta",
    ];

    if (input.asistencia === "asistio") {
        if (!input.interaccion) {
            errores.push("La interacción es obligatoria si asistió.");
        } else if (!interaccionesValidas.includes(input.interaccion)) {
            errores.push("Interacción no válida.");
        }
    }

    if (input.asistencia === "no_asistio_no_apto") {

    }

    if (input.nota && input.nota.length > 500) {
        errores.push("La nota no puede exceder los 500 caracteres.");
    }

    return {
        ok: errores.length === 0,
        errores,
    };
}

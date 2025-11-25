"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { evaluarCita } from "../actions/citas-actions";
import { citasKeys } from "../queries/citas-queries";
import { mapCita } from "../mappers/cita.mapper";

type EvalPayload = {
    id: string;
    nuevoEstado: "programada" | "completada" | "cancelada";
    asistencia: string | null;
    interaccion: string | null;
    nota: string | null;
};

export function useEvaluarCita() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (input: EvalPayload) => {
            const data = await evaluarCita(
                input.id,
                input.nuevoEstado,
                {
                    asistencia: input.asistencia,
                    interaccion: input.interaccion,
                    nota: input.nota,
                }
            );

            return mapCita(data);
        },
        onSuccess() {
            qc.invalidateQueries({ queryKey: citasKeys.list() });
        },
    });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { evaluarCita } from "../actions/citas-actions";
import { citasKeys } from "../queries/citas-keys";
import type { Cita } from "../types/cita";

type Params = {
    id: string;
    asistencia: Cita["asistencia"];
    interaccion: Cita["interaccion"];
    nota: string | null;
};

export function useEvaluarCita() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (params: Params) => {
            return await evaluarCita(params.id, {
                asistencia: params.asistencia,
                interaccion: params.interaccion,
                nota: params.nota,
            });
        },

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: citasKeys.list() });
        },

        onError: (err) => {
            console.error("Error evaluando cita:", err);
        },
    });
}

"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reprogramarCita } from "../actions/citas-actions";
import { citasKeys } from "../queries/citas-keys";

export function useReprogramarCita() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (input: { id: string; fecha: string; hora: string }) =>
            await reprogramarCita(input.id, input.fecha, input.hora),

        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: citasKeys.list() });

            qc.refetchQueries({ queryKey: citasKeys.list() });
        },

        onError: (error) => {
            console.error("Error reprogramando cita:", error?.message);
        },

        retry: 1,
    });
}

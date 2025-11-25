"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelarCita } from "../actions/citas-actions";
import { citasKeys } from "../queries/citas-keys";

export function useCancelarCita() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return await cancelarCita(id);
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: citasKeys.list() });

            qc.refetchQueries({ queryKey: citasKeys.list() });
        },

        onError: (error) => {
            console.error("Error cancelando cita:", error?.message);
        },

        retry: 1,
    });
}

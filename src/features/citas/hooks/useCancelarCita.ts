"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarEstadoCita } from "../actions/citas-actions";
import { citasKeys } from "../queries/citas-queries";
import { mapCita } from "../mappers/cita.mapper";

export function useCancelarCita() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const data = await actualizarEstadoCita(id, "cancelada");
            return mapCita(data);
        },
        onSuccess() {
            qc.invalidateQueries({ queryKey: citasKeys.list() });
        },
    });
}

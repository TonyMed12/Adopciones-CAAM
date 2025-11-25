"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearRaza } from "../actions/razas-actions";

export function useCrearRaza() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: crearRaza,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["razas"] });
        },

        onError: (error) => {
            console.error("Error creando raza:", error.message);
        },

        retry: 1,
    });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarRaza } from "../actions/razas-actions";

export function useEliminarRaza() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: eliminarRaza,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["razas"] });
        },
    });
}

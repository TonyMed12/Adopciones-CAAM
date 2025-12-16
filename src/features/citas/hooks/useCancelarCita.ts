"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelarCita } from "../actions/citas-actions";
import { citasKeys } from "../queries/citas-keys";

export function useCancelarCita() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: cancelarCita,

    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: citasKeys.list(),
      });
    },

    onError: (error: any) => {
      console.error("Error cancelando cita:", error?.message);
    },

    retry: 1,
  });
}

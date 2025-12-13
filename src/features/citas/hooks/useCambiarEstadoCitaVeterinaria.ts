"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cambiarEstadoCitaVeterinaria } from "@/features/citas/actions/citas-veterinarias-actions";
import { CitasVeterinariasKeys } from "@/features/citas/queries/citas-veterinarias-keys";

export function useCambiarEstadoCita() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      estado,
    }: {
      id: string;
      estado: "pendiente" | "aprobada" | "cancelada";
    }) => cambiarEstadoCitaVeterinaria(id, estado),

    onMutate: async ({ id, estado }) => {
      await qc.cancelQueries({
        queryKey: CitasVeterinariasKeys.admin.all(),
      });

      const previous = qc.getQueryData(CitasVeterinariasKeys.admin.all());

      qc.setQueryData(
        CitasVeterinariasKeys.admin.all(),
        (old: any[] = []) =>
          old.map((cita) =>
            cita.id === id ? { ...cita, estado } : cita
          )
      );

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(
          CitasVeterinariasKeys.admin.all(),
          ctx.previous
        );
      }
    },

    onSettled: () => {
      qc.invalidateQueries({
        queryKey: CitasVeterinariasKeys.admin.all(),
      });
    },
  });
}

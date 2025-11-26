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

    // ⭐ OPTIMISTIC UPDATE
    onMutate: async ({ id, estado }) => {
      // 1. Cancelar posibles refetch en curso
      await qc.cancelQueries({
        queryKey: CitasVeterinariasKeys.admin.all(),
      });

      // 2. Guardar estado anterior (para rollback si falla)
      const previous = qc.getQueryData(CitasVeterinariasKeys.admin.all());

      // 3. Actualizar UI inmediatamente
      qc.setQueryData(
        CitasVeterinariasKeys.admin.all(),
        (old: any[] = []) =>
          old.map((cita) =>
            cita.id === id ? { ...cita, estado } : cita
          )
      );

      return { previous };
    },

    // ❌ Revertir si algo falla
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(
          CitasVeterinariasKeys.admin.all(),
          ctx.previous
        );
      }
    },

    // 🔄 Sincronizar datos reales al finalizar
    onSettled: () => {
      qc.invalidateQueries({
        queryKey: CitasVeterinariasKeys.admin.all(),
      });
    },
  });
}

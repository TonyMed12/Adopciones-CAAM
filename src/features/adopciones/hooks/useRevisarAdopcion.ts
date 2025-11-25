"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revisarAdopcion } from "../actions/adopciones-actions";
import { adopcionesQueries } from "../queries/adopciones-queries";
import type { Adopcion, RevisionAdopcion } from "../types/adopciones";

export function useRevisarAdopcion() {
  const queryClient = useQueryClient();

  return useMutation<Adopcion, Error, RevisionAdopcion>({
    mutationFn: (input) => revisarAdopcion(input),
    onSuccess: (data) => {
      // Refrescar listas y el detalle de esa adopción
      queryClient.invalidateQueries({
        queryKey: adopcionesQueries.lists(),
      });
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: adopcionesQueries.detail(data.id),
        });
      }
    },
  });
}

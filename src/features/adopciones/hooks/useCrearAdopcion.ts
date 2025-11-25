"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearAdopcion } from "../actions/adopciones-actions";
import { adopcionesQueries } from "../queries/adopciones-queries";
import type { Adopcion, NuevaAdopcion } from "../types/adopciones";

export function useCrearAdopcion() {
  const queryClient = useQueryClient();

  return useMutation<Adopcion, Error, NuevaAdopcion>({
    mutationFn: (input) => crearAdopcion(input),
    onSuccess: () => {
      // Invalidar listas para que se refresquen
      queryClient.invalidateQueries({
        queryKey: adopcionesQueries.lists(),
      });
    },
  });
}

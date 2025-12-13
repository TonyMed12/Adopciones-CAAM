"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { guardarDireccion } from "../actions/perfil-actions";
import type { Direccion } from "../types/perfil";

export function useGuardarDireccionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (direccion: Partial<Direccion>) => guardarDireccion(direccion),

    // ✅ optimistic
    onMutate: async (direccionNueva) => {
      await queryClient.cancelQueries({ queryKey: ["perfil-actual"] });

      const previous = queryClient.getQueryData<any>(["perfil-actual"]);

      queryClient.setQueryData(["perfil-actual"], (old: any) => {
        if (!old) return old;

        const current = old.direccion ?? null;

        return {
          ...old,
          direccion: {
            ...(current ?? {}),
            ...direccionNueva,
          },
        };
      });

      return { previous };
    },

    // ✅ rollback
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["perfil-actual"], ctx.previous);
      toast.error("No se pudo guardar la dirección");
    },

    onSuccess: (res) => {
      if (res?.success) toast.success("Dirección actualizada");
      else toast.error("No se pudo guardar la dirección");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["perfil-actual"] });
    },
  });
}

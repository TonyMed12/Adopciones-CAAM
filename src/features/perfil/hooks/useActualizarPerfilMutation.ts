"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { actualizarPerfil } from "../actions/perfil-actions";

type Payload = { id: string; data: { ocupacion: string; telefono: string } };

export function useActualizarPerfilMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: Payload) => actualizarPerfil(id, data),

    // ✅ optimistic
    onMutate: async ({ data }) => {
      await queryClient.cancelQueries({ queryKey: ["perfil-actual"] });

      const previous = queryClient.getQueryData<any>(["perfil-actual"]);

      queryClient.setQueryData(["perfil-actual"], (old: any) => {
        if (!old?.perfil) return old;
        return {
          ...old,
          perfil: {
            ...old.perfil,
            ocupacion: data.ocupacion,
            telefono: data.telefono,
          },
        };
      });

      return { previous };
    },

    // ✅ rollback
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["perfil-actual"], ctx.previous);
      toast.error("No se pudo actualizar el perfil");
    },

    onSuccess: (res) => {
      if (res?.success) toast.success("Perfil actualizado");
      else toast.error("No se pudo actualizar el perfil");
    },

    // 🔄 revalidar (por si el server tiene otro valor final)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["perfil-actual"] });
    },
  });
}

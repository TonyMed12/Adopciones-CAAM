"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aprobarDocumento } from "../actions/documentos-actions";

export function useAprobarDocumento() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => aprobarDocumento(id),

    // OPTIMISTIC UPDATE
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["documentos"] });

      // snapshot anterior
      const prev = qc.getQueryData<any[]>(["documentos"]);

      // UI INSTANTÁNEA
      qc.setQueryData<any[]>(["documentos"], (old) =>
        !old
          ? []
          : old.map((doc) =>
              doc.id === id ? { ...doc, status: "aprobado" } : doc
            )
      );

      return { prev };
    },

    // si falla → revert
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(["documentos"], ctx.prev);
      }
    },

    // después del optimistic update → revalidar contra server
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["documentos"] });
    },
  });
}

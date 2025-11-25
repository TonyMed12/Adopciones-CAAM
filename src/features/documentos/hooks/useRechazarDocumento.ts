"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rechazarDocumento } from "../actions/documentos-actions";

export function useRechazarDocumento() {
  const qc = useQueryClient();

  return useMutation<
    boolean, 
    Error,   
    { id: string; motivo: string; doc: any }, 
    { prev: any[] | undefined } 
  >({
    mutationFn: ({ id, motivo, doc }) =>
      rechazarDocumento(id, motivo, doc),

    // OPTIMISTIC UPDATE
    onMutate: async ({ id, motivo }) => {
      await qc.cancelQueries({ queryKey: ["documentos"] });

      const prev = qc.getQueryData<any[]>(["documentos"]);

      qc.setQueryData<any[]>(["documentos"], (old) =>
        !old
          ? []
          : old.map((d) =>
              d.id === id
                ? { ...d, status: "rechazado", observacion_admin: motivo }
                : d
            )
      );

      return { prev }; 
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(["documentos"], ctx.prev);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["documentos"] });
    },
  });
}

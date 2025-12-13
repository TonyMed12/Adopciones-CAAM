"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadSeguimientoFotos } from "../utils/uploadSeguimientoFotos";
import { crearSeguimientoAction } from "../actions/seguimiento-actions";

type CrearSeguimientoInput = {
  adopcionId: string;
  fechaProgramada: string;
  observaciones: string;
  recomendaciones?: string | null;
  satisfaccion_adoptante: number;
  estado_mascota: string;
  problemas_reportados: string[];
  fotos: FileList;
};

export function useCrearSeguimientoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CrearSeguimientoInput) => {
      // 1️⃣ subir fotos (cliente)
      const fotosUrls = await uploadSeguimientoFotos(
        input.fotos,
        input.adopcionId
      );

      // 2️⃣ crear seguimiento (server action)
      await crearSeguimientoAction({
        adopcionId: input.adopcionId,
        fechaProgramada: input.fechaProgramada,
        observaciones: input.observaciones,
        recomendaciones: input.recomendaciones ?? null,
        satisfaccion_adoptante: input.satisfaccion_adoptante,
        estado_mascota: input.estado_mascota,
        problemas_reportados: input.problemas_reportados,
        fotosUrls,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seguimientos"] });
      queryClient.invalidateQueries({
        queryKey: ["seguimientos-por-mascota"],
      });
    },
  });
}

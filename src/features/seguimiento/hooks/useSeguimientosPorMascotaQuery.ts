"use client";

import { useQuery } from "@tanstack/react-query";
import { listarSeguimientosPorMascota } from "../actions/seguimiento-actions";

export function useSeguimientosPorMascotaQuery(mascotaId: string) {
  return useQuery({
    queryKey: ["seguimientos-mascota", mascotaId],
    queryFn: () => listarSeguimientosPorMascota(mascotaId),
    enabled: !!mascotaId, 
    staleTime: 1000 * 60 * 5,
  });
}

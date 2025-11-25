"use client";

import { useQuery } from "@tanstack/react-query";
import { obtenerMascotaPorId } from "@/features/mascotas/actions/mascotas-actions";
import { listarSeguimientosPorMascota } from "@/features/seguimiento/actions/seguimiento-actions";

export function useSeguimientoPageQuery(mascotaId: string) {
  const mascotaQuery = useQuery({
    queryKey: ["mascota-detalle", mascotaId],
    queryFn: () => obtenerMascotaPorId(mascotaId),
    enabled: !!mascotaId,
    staleTime: 1000 * 60 * 5,
  });

  const seguimientosQuery = useQuery({
    queryKey: ["seguimientos-mascota", mascotaId],
    queryFn: () => listarSeguimientosPorMascota(mascotaId),
    enabled: !!mascotaId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    mascota: mascotaQuery.data ?? null,
    seguimientos: seguimientosQuery.data ?? [],
    isLoading: mascotaQuery.isLoading || seguimientosQuery.isLoading,
    isError: mascotaQuery.isError || seguimientosQuery.isError,
  };
}

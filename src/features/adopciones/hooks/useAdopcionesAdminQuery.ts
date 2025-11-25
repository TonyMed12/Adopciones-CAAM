// src/features/adopciones/hooks/useAdopcionesAdminQuery.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { adopcionesQueries } from "../queries/adopciones-queries";
import {
  listarAdopcionesAdmin,
  listarAdopciones,
  obtenerAdopcionPorId,
} from "../actions/adopciones-actions";
import type { Adopcion, AdopcionAdminRow } from "../types/adopciones";

export function useAdopcionesAdminQuery() {
  return useQuery<AdopcionAdminRow[], Error>({
    queryKey: adopcionesQueries.list("admin"),
    queryFn: listarAdopcionesAdmin,
    staleTime: 10000,
  });
}

export function useAdopcionesUsuarioQuery() {
  return useQuery<Adopcion[], Error>({
    queryKey: adopcionesQueries.list("usuario"),
    queryFn: listarAdopciones,
  });
}

export function useAdopcionByIdQuery(id: string | null) {
  return useQuery<Adopcion | null, Error>({
    queryKey: id ? adopcionesQueries.detail(id) : ["adopciones", "detail", "null"],
    queryFn: () => {
      if (!id) return Promise.resolve(null);
      return obtenerAdopcionPorId(id);
    },
    enabled: !!id,
  });
}

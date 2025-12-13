"use client";

import { useQuery } from "@tanstack/react-query";
import { obtenerPerfilActual } from "../actions/perfil-actions";

export function usePerfilQuery() {
  return useQuery({
    queryKey: ["perfil-actual"],
    queryFn: obtenerPerfilActual,
    staleTime: 1000 * 20,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });
}

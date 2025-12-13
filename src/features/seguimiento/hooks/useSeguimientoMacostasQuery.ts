"use client";

import { useQuery } from "@tanstack/react-query";
import { obtenerSeguimientoMascotasUsuario } from "../actions/seguimiento-actions";

export function useSeguimientoMascotasQuery() {
  return useQuery({
    queryKey: ["seguimiento-mascotas"],
    queryFn: () => obtenerSeguimientoMascotasUsuario(),
    staleTime: 1000 * 60 * 5,
  });
}
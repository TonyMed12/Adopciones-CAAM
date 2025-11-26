"use client";

import { useQuery } from "@tanstack/react-query";
import { listarCitasVeterinariasAdmin } from "@/features/citas/actions/citas-veterinarias-actions";
import { listarCitasVeterinariasUsuario } from "@/features/citas/actions/citas-veterinarias-actions";
import { CitasVeterinariasKeys } from "./citas-veterinarias-keys";

export function useCitasVeterinariasAdmin() {
  return useQuery({
    queryKey: CitasVeterinariasKeys.admin.all(),
    queryFn: () => listarCitasVeterinariasAdmin(),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

export function useCitasVeterinariasUsuario(authId: string | null) {
  return useQuery({
    enabled: !!authId,
    queryKey: CitasVeterinariasKeys.usuario.all(authId!),
    queryFn: () => listarCitasVeterinariasUsuario(authId!),
    staleTime: 10000,
  });
}
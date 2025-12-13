"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  listarCitasVeterinariasAdmin,
  listarCitasVeterinariasUsuario,
} from "@/features/citas/actions/citas-veterinarias-actions";
import { CitasVeterinariasKeys } from "./citas-veterinarias-keys";

export function useCitasVeterinariasAdmin({
  search,
}: {
  search?: string;
} = {}) {
  return useInfiniteQuery({
    queryKey: CitasVeterinariasKeys.admin.infinite(search),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      listarCitasVeterinariasAdmin({
        cursor: pageParam,
        search,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

export function useCitasVeterinariasUsuario(authId: string | null) {
  return useInfiniteQuery({
    enabled: !!authId,
    queryKey: CitasVeterinariasKeys.usuario.infinite(authId!),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      listarCitasVeterinariasUsuario({
        auth_id: authId!,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60, // 1 minuto
  });
}

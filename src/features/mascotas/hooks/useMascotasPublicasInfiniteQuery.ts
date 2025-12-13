"use client";

import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { listarMascotasPublicas } from "../actions/mascotas-actions";

import type {
    ListarMascotasPublicasParams,
    MascotasPaginadasResult,
} from "../types/mascotas";

type UseMascotasPublicasInfiniteQueryProps = Omit<
    ListarMascotasPublicasParams,
    "cursor"
>;

export function useMascotasPublicasInfiniteQuery({
    search,
    especie,
    sexo,
}: UseMascotasPublicasInfiniteQueryProps) {
    return useInfiniteQuery<
        MascotasPaginadasResult,
        Error,
        InfiniteData<MascotasPaginadasResult>,
        readonly unknown[],
        string | null
    >({
        queryKey: ["mascotas-publicas", search, especie, sexo],

        queryFn: ({ pageParam }) =>
            listarMascotasPublicas({
                cursor: pageParam ?? null,
                search,
                especie,
                sexo,
            }),

        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,

        staleTime: 10000,
        gcTime: 1000 * 60 * 5,
        retry: 1,
    });
}

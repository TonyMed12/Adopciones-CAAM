import { useInfiniteQuery } from "@tanstack/react-query";
import { listarMascotas } from "../actions/mascotas-actions";

export function useMascotasInfiniteQuery({
    q,
    especie,
    sexo,
}: {
    q: string;
    especie: string;
    sexo: string;
}) {
    return useInfiniteQuery({
        queryKey: ["mascotas", q, especie, sexo],

        queryFn: ({ pageParam }) =>
            listarMascotas({
                cursor: pageParam ?? null,
                search: q,
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

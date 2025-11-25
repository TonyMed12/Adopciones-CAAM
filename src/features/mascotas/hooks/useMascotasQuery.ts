import { useQuery } from "@tanstack/react-query";
import { fetchMascotas } from "../queries/mascotas-queries";
import type { Mascota } from "../types/mascotas";

export function useMascotasQuery() {
    return useQuery<Mascota[], Error>({
        queryKey: ["mascotas"],
        queryFn: fetchMascotas,

        staleTime: 10000,
        gcTime: 1000 * 60 * 5,
        retry: 1, 
    });
}

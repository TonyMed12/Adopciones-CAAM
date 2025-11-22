import { useQuery } from "@tanstack/react-query";
import { fetchMascotas } from "../queries/mascotas-queries";

export function useMascotasQuery() {
    return useQuery({
        queryKey: ["mascotas"],
        queryFn: fetchMascotas,
        staleTime: 10000,
    });
}

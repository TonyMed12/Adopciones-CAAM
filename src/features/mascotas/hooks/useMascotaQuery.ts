import { useQuery } from "@tanstack/react-query";
import { fetchMascotaById } from "../queries/mascotas-queries";
import type { Mascota } from "../types/mascotas";

export function useMascotaQuery(id: string) {
    return useQuery<Mascota | null, Error>({
        queryKey: ["mascota", id],
        queryFn: () => fetchMascotaById(id),
        enabled: !!id,             
        staleTime: 1000 * 30,      
        retry: 1,                   
    });
}

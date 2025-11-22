import { useQuery } from "@tanstack/react-query";
import { fetchMascotaById } from "../queries/mascotas-queries";

export function useMascotaQuery(id: string) {
    return useQuery({
        queryKey: ["mascota", id],
        queryFn: () => fetchMascotaById(id),
        enabled: !!id,
    });
}
import { useQuery } from "@tanstack/react-query";
import { listarMascotasSinCursor } from "../actions/mascotas-actions";
import type { Mascota } from "../types/mascotas";

export function useMascotasQuery() {
    return useQuery<Mascota[]>({
        queryKey: ["mascotas-seguimiento"],
        queryFn: listarMascotasSinCursor,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

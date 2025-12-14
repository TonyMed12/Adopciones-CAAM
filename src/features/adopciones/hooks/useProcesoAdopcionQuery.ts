import { useQuery } from "@tanstack/react-query";
import type { QueryObserverResult } from "@tanstack/react-query";
import { obtenerProcesoAdopcionUsuario } from "../actions/proceso-adopcion-actions";
import type { ProcesoAdopcionData } from "../types/proceso-adopcion";

export function useProcesoAdopcionQuery(): QueryObserverResult<ProcesoAdopcionData, Error> {
    return useQuery<ProcesoAdopcionData, Error>({
        queryKey: ["proceso-adopcion"],
        queryFn: async () => {
            try {
                return await obtenerProcesoAdopcionUsuario();
            } catch (err) {
                if (err instanceof Error) {
                    throw err;
                }
                throw new Error("Error al obtener el proceso de adopción");
            }
        },

        staleTime: 1000 * 60 * 2, 
        gcTime: 1000 * 60 * 5,    
        retry: 1,
        refetchOnWindowFocus: false,
    });
}

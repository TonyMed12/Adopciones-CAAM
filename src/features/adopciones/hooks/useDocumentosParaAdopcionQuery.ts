import { useQuery } from "@tanstack/react-query";
import { obtenerDocumentosUsuario } from "../actions/obtenerDocumentosParaAdopcion-action.ts";
import type { DocumentosUsuarioData } from "../types/documentos.js";

export function useDocumentosParaAdopcionQuery() {
    return useQuery<DocumentosUsuarioData, Error>({
        queryKey: ["documentos-adopcion"],
        queryFn: async () => {
            try {
                return await obtenerDocumentosUsuario();
            } catch (err) {
                if (err instanceof Error) {
                    throw err;
                }
                throw new Error("Error al obtener documentos para adopción");
            }
        },

        staleTime: 1000 * 60 * 2, 
        gcTime: 1000 * 60 * 5,    
        retry: 1,
        refetchOnWindowFocus: false,
    });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subirDocumentoAdopcion } from "../actions/subirDocumentoAdopcion";

export function useSubirDocumentoAdopcionMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: {
            tipo: string;
            file: File;
        }) => {
            const buffer = await params.file.arrayBuffer();

            await subirDocumentoAdopcion({
                tipo: params.tipo,
                fileName: params.file.name,
                fileBuffer: buffer,
            });
        },

        onSuccess: () => {
            // Refresca documentos y proceso de adopción
            queryClient.invalidateQueries({
                queryKey: ["documentos-adopcion"],
            });
            queryClient.invalidateQueries({
                queryKey: ["proceso-adopcion"],
            });
        },
    });
}

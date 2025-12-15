import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelarSolicitudAdopcion } from "../actions/cancelarSolicitudAdopcion-action";

export function useCancelarSolicitudAdopcionMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string) =>
            cancelarSolicitudAdopcion(solicitudId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["proceso-adopcion"],
            });
        },
    });
}

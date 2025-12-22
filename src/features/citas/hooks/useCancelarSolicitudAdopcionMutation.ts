import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelarSolicitudAdopcion } from "../actions/cancelarSolicitudAdopcion-action";
import { misCitasKeys } from "../queries/mis-citas-keys";

export function useCancelarSolicitudAdopcionMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelarSolicitudAdopcion,

        onSuccess: async () => {
            queryClient.removeQueries({
                queryKey: misCitasKeys.all,
            });

            await queryClient.refetchQueries({
                queryKey: misCitasKeys.all,
            });
        },
    });
}

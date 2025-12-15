import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelarCitaAdopcion } from "../actions/cancelar-cita";
import { misCitasKeys } from "../queries/mis-citas-keys";

export function useCancelarCitaMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelarCitaAdopcion,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: misCitasKeys.all,
            });
        },
    });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmarCitaAdopcion } from "../actions/confirmar-cita";

type ConfirmarCitaInput = {
    solicitudId: string;
    usuarioId: string;
    mascotaId: string | null;
    fecha: string;
    hora: string;
};

export function useConfirmarCitaMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: ConfirmarCitaInput) =>
            confirmarCitaAdopcion(input),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["mis-citas"],
            });
        },
    });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearSolicitudAdopcion } from "../actions/solicitudes-actions";

export function useCrearSolicitudAdopcion() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (mascotaId: string) =>
            crearSolicitudAdopcion(mascotaId),

        onSuccess: () => {
            // Refrescar feed y solicitudes del usuario
            queryClient.invalidateQueries({ queryKey: ["mascotas-publicas"] });
            queryClient.invalidateQueries({ queryKey: ["solicitudes-usuario"] });
        },
    });

    return {
        crearSolicitud: mutation.mutate,
        crearSolicitudAsync: mutation.mutateAsync,

        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,

        error: mutation.error,
        data: mutation.data,
    };
}

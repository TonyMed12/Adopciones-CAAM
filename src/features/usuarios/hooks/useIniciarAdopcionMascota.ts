"use client";

import { useMutation } from "@tanstack/react-query";
import type { Mascota } from "@/features/mascotas/types/mascotas";
import type { IniciarAdopcionResult } from "../types/iniciar-adopcion";
import { iniciarAdopcionMascota } from "../actions/iniciarAdopcionMascota";

export function useIniciarAdopcionMascota() {
    const mutation = useMutation<
        IniciarAdopcionResult,
        Error,
        Mascota
    >({
        mutationFn: (mascota) => iniciarAdopcionMascota(mascota),
    });

    return {
        iniciarAdopcion: mutation.mutate,
        iniciarAdopcionAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        data: mutation.data,
        error: mutation.error,
        reset: mutation.reset,
    };
}

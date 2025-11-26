"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerActividadReciente } from "../actions/actividad-actions";
import type { ActividadItemType } from "../types/dashboard";

export function useActividadReciente(filtro: "todo" | "documento" | "cita" | "mascota") {
    const queryClient = useQueryClient();

    return useQuery<ActividadItemType[]>({
        queryKey: ["dashboard", "actividad", filtro],
        queryFn: () => obtenerActividadReciente(filtro),
        staleTime: 1000 * 20,
    });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { obtenerActividadReciente } from "../actions/actividad-actions";
import type { ActividadItemType } from "../types/dashboard";

export function useActividadReciente(filtro: "todo" | "documento" | "cita" | "mascota") {
    return useQuery<ActividadItemType[]>({
        queryKey: ["dashboard", "actividad", filtro],
        queryFn: () => obtenerActividadReciente(filtro),
        staleTime: 1000 * 20,
    });
}

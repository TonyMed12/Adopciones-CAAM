"use client";

import { useQuery } from "@tanstack/react-query";
import { citasKeys } from "../queries/citas-keys";
import { fetchCitas } from "../queries/citas-queries";
import type { Cita } from "../types/cita";

export function useCitas() {
    return useQuery<Cita[]>({
        queryKey: citasKeys.list(),
        queryFn: fetchCitas,
        staleTime: 10000,
        refetchOnWindowFocus: false,
    });
}

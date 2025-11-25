"use client";

import { useQuery } from "@tanstack/react-query";
import { listarRazas } from "../actions/razas-actions";
import type { Raza } from "../types/razas";

export function useRazasQuery() {
    return useQuery<Raza[], Error>({
        queryKey: ["razas"],
        queryFn: listarRazas,
        staleTime: 1000 * 60 * 30, 
        retry: 1, 
    });
}

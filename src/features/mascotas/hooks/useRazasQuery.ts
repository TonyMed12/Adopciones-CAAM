"use client";

import { useQuery } from "@tanstack/react-query";
import { listarRazas } from "../actions/razas-actions";

export function useRazasQuery() {
    return useQuery({
        queryKey: ["razas"],
        queryFn: listarRazas,
        staleTime: 1000 * 60 * 30,
    });
}

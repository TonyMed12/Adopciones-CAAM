"use client";

import { useQuery } from "@tanstack/react-query";
import { obtenerStatsDashboard } from "../actions/dashboard-actions";

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard", "stats"],
        queryFn: () => obtenerStatsDashboard(),
        staleTime: 10000,
    });
}

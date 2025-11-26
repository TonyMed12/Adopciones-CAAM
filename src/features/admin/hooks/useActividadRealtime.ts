"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function useActividadRealtime(filtro: string) {
    const queryClient = useQueryClient();

    useEffect(() => {
        const supabase = createClient();

        const channel = supabase
            .channel("dashboard-actividad")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "documentos" },
                () => {
                    queryClient.invalidateQueries({ queryKey: ["dashboard", "actividad", filtro] });
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "citas_adopcion" },
                () => {
                    queryClient.invalidateQueries({ queryKey: ["dashboard", "actividad", filtro] });
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "citas_veterinarias" },
                () => {
                    queryClient.invalidateQueries({ queryKey: ["dashboard", "actividad", filtro] });
                }
            )
            .on(
                "postgres_changes",
                { event: "update", schema: "public", table: "mascotas" },
                () => {
                    queryClient.invalidateQueries({ queryKey: ["dashboard", "actividad", filtro] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [filtro, queryClient]);
}

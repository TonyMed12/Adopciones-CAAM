"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function useDashboardRealtime() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const supabase = createClient();

        const channel = supabase
            .channel("dashboard-stats-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "documentos" },
                () => {
                    queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "citas_adopcion" },
                () => {
                    queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "citas_veterinarias" },
                () => {
                    queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "perfiles" },
                () => {
                    queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "mascotas" },
                () => {
                    queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);
}

"use client";

import React from "react";
import { StatCard } from "./StatCard";
import {
    ClipboardList,
    CalendarDays,
    Calendar,
    Users,
    PawPrint,
} from "lucide-react";
import type { DashboardStats } from "../../types/dashboard";
import { useRouter } from "next/navigation";

export function StatsGrid({ stats }: { stats: DashboardStats }) {
    const router = useRouter();

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatCard
                label="Documentos pendientes"
                value={stats.documentosPendientes}
                icon={<ClipboardList className="h-6 w-6" />}
                onClick={() => router.push("/dashboards/administrador/documentos")}
            />

            <StatCard
                label="Citas hoy"
                value={stats.citasHoy}
                icon={<CalendarDays className="h-6 w-6" />}
                onClick={() => router.push("/dashboards/administrador/gestion_citas")}
            />

            <StatCard
                label="Citas esta semana"
                value={stats.citasSemana}
                icon={<Calendar className="h-6 w-6" />}
                onClick={() => router.push("/dashboards/administrador/gestion_citas")}
            />

            <StatCard
                label="Usuarios en revisión"
                value={stats.usuariosProceso}
                icon={<Users className="h-6 w-6" />}
                onClick={() => router.push("/dashboards/administrador/usuarios")}
            />

            <StatCard
                label="Mascotas adoptables"
                value={stats.mascotasAdoptables}
                icon={<PawPrint className="h-6 w-6" />}
                onClick={() => router.push("/dashboards/administrador/mascotas")}
            />
        </div>
    );
}

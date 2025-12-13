"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHead from "@/components/layout/PageHead";

import { Loader2 } from "lucide-react";

import { useDashboardStats } from "@/features/admin/hooks/useDashboardStats";
import { useDashboardRealtime } from "@/features/admin/hooks/useDashboardRealtime";
import { useActividadReciente } from "@/features/admin/hooks/useActividadReciente";
import { useActividadRealtime } from "@/features/admin/hooks/useActividadRealtime";

import { mapPendientes } from "@/features/admin/mappers/dashboard-mappers";
import { useUsuarioNombre } from "@/features/admin/hooks/useUsuarioNombre";

import { StatsGrid } from "@/features/admin/components/client/StatsGrid";
import { PendientesList } from "@/features/admin/components/client/PendientesList";
import { ActividadFilters } from "@/features/admin/components/client/ActivityFilters";
import { ActividadList } from "@/features/admin/components/client/ActivityList";
import { DashboardSkeleton } from "@/features/admin/components/client/DashboardSkeleton";

export default function AdminDashboard() {
  const router = useRouter();

  const [filtro, setFiltro] = useState<
    "todo" | "documento" | "cita" | "mascota"
  >("todo");

  const { data: stats, isLoading: loadingStats } = useDashboardStats();
  useDashboardRealtime();

  const { data: nombreUsuario, isLoading: loadingUsuario } = useUsuarioNombre();

  const pendientes = stats ? mapPendientes(stats) : [];

  const { data: actividad, isLoading: loadingAct } =
    useActividadReciente(filtro);

  useActividadRealtime(filtro);

  const isLoadingPage =
    loadingUsuario || loadingStats || loadingAct;

  if (isLoadingPage) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <PageHead
        title="Panel de gestión"
        subtitle={
          loadingUsuario ? (
            <div className="h-5 w-40 bg-slate-200 animate-pulse rounded"></div>
          ) : nombreUsuario ? (
            <>
              Bienvenido a tu panel de gestión,{" "}
              <span className="font-bold text-[#BC5F36]">{nombreUsuario}</span>.
              Revisa los pendientes del día.
            </>
          ) : (
            "Bienvenido a tu panel de gestión. Revisa los pendientes del día."
          )
        }

      />

      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        <button
          onClick={() => router.push("/dashboards/administrador/documentos")}
          className="px-4 py-2 rounded-lg bg-[#BC5F36] text-white text-sm hover:bg-[#a34f2e]"
        >
          Validar documentos
        </button>
        <button
          onClick={() => router.push("/dashboards/administrador/gestion_citas")}
          className="px-4 py-2 rounded-lg bg-orange-100 text-[#BC5F36] text-sm hover:bg-orange-200"
        >
          Ver citas
        </button>
        <button
          onClick={() => router.push("/dashboards/administrador/usuarios")}
          className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm hover:bg-slate-200"
        >
          Usuarios
        </button>
      </div>

      {loadingStats || !stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
          <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
          <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
          <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
          <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
        </div>
      ) : (
        <StatsGrid stats={stats} />
      )}

      <section className="rounded-2xl border border-[#eadacb] bg-[#fffaf7] p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Tareas pendientes
        </h2>

        <PendientesList
          pendientes={pendientes}
          loading={loadingStats}
          onNavigate={(link) => router.push(link)}
        />
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#2b1b12]">
            Actividad reciente
          </h2>

          <div className="w-full sm:w-auto overflow-x-auto">
            <ActividadFilters filtro={filtro} setFiltro={setFiltro} />
          </div>
        </div>

        {loadingAct ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="animate-spin h-4 w-4" />
            Cargando actividad...
          </div>
        ) : actividad && actividad.length > 0 ? (
          <ActividadList actividad={actividad} />
        ) : (
          <p className="text-sm text-slate-500">Sin actividad reciente 🐾</p>
        )}
      </section>
    </div>
  );
}

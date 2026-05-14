"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHead from "@/components/layout/PageHead";

import {
  Loader2,
  LayoutDashboard,
  FileText,
  CalendarDays,
  Users,
  ClipboardList,
  Activity,
  ArrowRight,
} from "lucide-react";

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

  const isLoadingPage = loadingUsuario || loadingStats || loadingAct;

  if (isLoadingPage) {
    return <DashboardSkeleton />;
  }

  /* ============ Quick actions ============ */
  const quickActions: Array<{
    label: string;
    href: string;
    Icon: React.ComponentType<{ className?: string }>;
    primary?: boolean;
  }> = [
    {
      label: "Validar documentos",
      href: "/dashboards/administrador/documentos",
      Icon: FileText,
      primary: true,
    },
    {
      label: "Ver citas",
      href: "/dashboards/administrador/gestion_citas",
      Icon: CalendarDays,
    },
    {
      label: "Usuarios",
      href: "/dashboards/administrador/usuarios",
      Icon: Users,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ============ Header ============ */}
      <PageHead
        title="Panel de gestión"
        eyebrow={
          <>
            <LayoutDashboard size={12} />
            <span>Dashboard administrativo</span>
          </>
        }
        icon={<LayoutDashboard size={20} />}
        subtitle={
          loadingUsuario ? (
            <div className="h-5 w-40 bg-slate-200 animate-pulse rounded" />
          ) : nombreUsuario ? (
            <>
              Bienvenido,{" "}
              <span className="font-bold text-[#BC5F36]">{nombreUsuario}</span>.
              Aquí tienes un vistazo de los pendientes y actividad reciente.
            </>
          ) : (
            "Bienvenido a tu panel. Aquí están los pendientes del día."
          )
        }
      />

      {/* ============ Quick actions ============ */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {quickActions.map((a) => (
          <button
            key={a.href}
            onClick={() => router.push(a.href)}
            className={`
              inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold
              transition-all duration-200 active:scale-[0.98]
              ${
                a.primary
                  ? "bg-[#BC5F36] text-white shadow-md hover:bg-[#a34f2e] hover:shadow-lg"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-[#f3d6bb] hover:text-[#BC5F36] hover:bg-[#fffaf4]"
              }
            `}
          >
            <a.Icon className="h-4 w-4" />
            {a.label}
          </button>
        ))}
      </div>

      {/* ============ KPIs ============ */}
      {loadingStats || !stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <StatsGrid stats={stats} />
      )}

      {/* ============ Pendientes + Actividad (grid 2 col) ============ */}
      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Tareas pendientes */}
        <section
          className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6"
          style={{ boxShadow: "0 4px 16px -8px rgba(2,6,23,.08)" }}
        >
          <header className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
                <ClipboardList className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight truncate">
                  Tareas pendientes
                </h2>
                <p className="text-xs text-slate-500 truncate">
                  Pendientes que requieren tu atención.
                </p>
              </div>
            </div>

            {pendientes.length > 0 && (
              <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 rounded-full bg-[#BC5F36] text-white text-[11px] font-bold px-2 shrink-0">
                {pendientes.length}
              </span>
            )}
          </header>

          <PendientesList
            pendientes={pendientes}
            loading={loadingStats}
            onNavigate={(link) => router.push(link)}
          />
        </section>

        {/* Actividad reciente */}
        <section
          className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6"
          style={{ boxShadow: "0 4px 16px -8px rgba(2,6,23,.08)" }}
        >
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-200 shrink-0">
                <Activity className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight truncate">
                  Actividad reciente
                </h2>
                <p className="text-xs text-slate-500 truncate">
                  Últimos movimientos del sistema.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto -mx-1 px-1 sm:overflow-visible">
              <ActividadFilters filtro={filtro} setFiltro={setFiltro} />
            </div>
          </header>

          {loadingAct ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="animate-spin h-4 w-4" />
              Cargando actividad...
            </div>
          ) : actividad && actividad.length > 0 ? (
            <div className="max-h-[480px] overflow-y-auto custom-scroll -mx-2 px-2">
              <ActividadList actividad={actividad} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-100 mb-3">
                <Activity className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Sin actividad reciente
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Cuando ocurran movimientos aparecerán aquí.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

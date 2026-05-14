"use client";

import { Clock, CheckCircle2, XCircle } from "lucide-react";

export function CitasVeterinariasKPIs({
  totales,
}: {
  totales: { pendientes: number; aprobadas: number; canceladas: number };
}) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      <KPICard
        label="Pendientes"
        value={totales.pendientes}
        Icon={Clock}
        tone="amber"
        alert={totales.pendientes > 0}
      />
      <KPICard
        label="Aprobadas"
        value={totales.aprobadas}
        Icon={CheckCircle2}
        tone="emerald"
      />
      <KPICard
        label="Canceladas"
        value={totales.canceladas}
        Icon={XCircle}
        tone="rose"
      />
    </div>
  );
}

function KPICard({
  label,
  value,
  Icon,
  tone,
  alert,
}: {
  label: string;
  value: number;
  Icon: React.ComponentType<{ className?: string }>;
  tone: "amber" | "emerald" | "rose";
  alert?: boolean;
}) {
  const tones = {
    amber: {
      iconBg: "bg-amber-100 text-amber-700 ring-amber-200",
      dot: "bg-amber-500",
      glow: "bg-amber-100/60",
      border: "border-amber-200/60",
    },
    emerald: {
      iconBg: "bg-emerald-100 text-emerald-700 ring-emerald-200",
      dot: "bg-emerald-500",
      glow: "bg-emerald-100/60",
      border: "border-emerald-200/60",
    },
    rose: {
      iconBg: "bg-rose-100 text-rose-700 ring-rose-200",
      dot: "bg-rose-500",
      glow: "bg-rose-100/60",
      border: "border-rose-200/60",
    },
  }[tone];

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border bg-white p-4 sm:p-5
        transition-all duration-300
        ${alert ? tones.border : "border-slate-200/80"}
      `}
      style={{ boxShadow: "0 4px 16px -8px rgba(2,6,23,.06)" }}
    >
      <div
        className={`pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl ${
          alert ? tones.glow : "bg-slate-100/70"
        }`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1 leading-none tracking-tight tabular-nums">
            {value}
          </h3>

          {alert && (
            <p className="mt-2 inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-amber-700">
              <span
                className={`h-1.5 w-1.5 rounded-full ${tones.dot} animate-pulse`}
              />
              Requiere atención
            </p>
          )}
        </div>

        <div
          className={`grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-2xl shrink-0 ring-1 ${tones.iconBg}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

"use client";

import { Clock, CheckCircle2, XCircle } from "lucide-react";

type EstadoMeta = {
  label: string;
  chip: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const ESTADOS: Record<string, EstadoMeta> = {
  pendiente: {
    label: "Pendiente",
    chip: "bg-amber-50 text-amber-700 ring-amber-200",
    Icon: Clock,
  },
  aprobada: {
    label: "Aprobada",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Icon: CheckCircle2,
  },
  cancelada: {
    label: "Cancelada",
    chip: "bg-rose-50 text-rose-700 ring-rose-200",
    Icon: XCircle,
  },
};

export function CitasVeterinariasEstadoBadge({ estado }: { estado: string }) {
  const meta =
    ESTADOS[estado] ?? {
      label: estado.charAt(0).toUpperCase() + estado.slice(1),
      chip: "bg-slate-100 text-slate-600 ring-slate-200",
      Icon: Clock,
    };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full px-2.5 py-1
        text-[10px] font-bold uppercase tracking-wider ring-1 whitespace-nowrap
        ${meta.chip}
      `}
    >
      <meta.Icon className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

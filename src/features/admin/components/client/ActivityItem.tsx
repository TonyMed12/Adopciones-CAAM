"use client";

import React from "react";
import { FileText, CalendarDays, PawPrint, Activity } from "lucide-react";

function formatTimeAgo(fechaStr: string) {
  const fecha = new Date(fechaStr);
  const diffMs = Date.now() - fecha.getTime();
  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 1) return "justo ahora";
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `hace ${dias} día${dias > 1 ? "s" : ""}`;
}

const TIPO_META: Record<
  string,
  {
    Icon: React.ComponentType<{ className?: string }>;
    chip: string;
    label: string;
  }
> = {
  documento: {
    Icon: FileText,
    chip: "bg-sky-50 text-sky-700 ring-sky-200",
    label: "Documento",
  },
  cita: {
    Icon: CalendarDays,
    chip: "bg-violet-50 text-violet-700 ring-violet-200",
    label: "Cita",
  },
  mascota: {
    Icon: PawPrint,
    chip: "bg-amber-50 text-amber-800 ring-amber-200",
    label: "Mascota",
  },
};

export function ActivityItem({
  tipo,
  mensaje,
  fecha,
}: {
  tipo: string;
  mensaje: string;
  fecha: string;
}) {
  const meta = TIPO_META[tipo] || {
    Icon: Activity,
    chip: "bg-slate-100 text-slate-700 ring-slate-200",
    label: tipo,
  };

  return (
    <li className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50">
      <span
        className={`
          grid h-9 w-9 place-items-center rounded-xl ring-1 shrink-0
          ${meta.chip}
        `}
      >
        <meta.Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`
              inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1
              ${meta.chip}
            `}
          >
            {meta.label}
          </span>
          <span className="text-[11px] text-slate-400">
            {formatTimeAgo(fecha)}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-slate-700 leading-relaxed">
          {mensaje}
        </p>
      </div>
    </li>
  );
}

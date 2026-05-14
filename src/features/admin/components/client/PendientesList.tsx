"use client";

import React from "react";
import {
  ClipboardList,
  Loader2,
  ArrowRight,
  CheckCircle2,
  FileText,
  CalendarDays,
  PawPrint,
} from "lucide-react";

function getIconForLink(link: string) {
  if (link.includes("documentos")) return FileText;
  if (link.includes("citas")) return CalendarDays;
  if (link.includes("mascotas")) return PawPrint;
  return ClipboardList;
}

export function PendientesList({
  pendientes,
  loading,
  onNavigate,
}: {
  pendientes: { id: number; descripcion: string; link: string }[];
  loading: boolean;
  onNavigate: (link: string) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <Loader2 className="animate-spin h-4 w-4" /> Cargando tareas...
      </div>
    );
  }

  if (pendientes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 mb-3">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700">
          Todo al día
        </p>
        <p className="text-xs text-slate-500 mt-1">
          No hay tareas pendientes por ahora.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-2 sm:gap-2.5">
      {pendientes.map((p) => {
        const Icon = getIconForLink(p.link);

        return (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onNavigate(p.link)}
              className="
                group w-full flex items-center justify-between gap-3
                rounded-xl border border-slate-200/80 bg-white px-3 sm:px-4 py-3
                transition-all duration-200
                hover:border-[#f3d6bb] hover:bg-[#fffaf4] hover:shadow-sm
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BC5F36]/40
              "
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm text-slate-700 truncate text-left">
                  {p.descripcion}
                </span>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#BC5F36] shrink-0 whitespace-nowrap">
                <span className="hidden sm:inline">Revisar</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition" />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

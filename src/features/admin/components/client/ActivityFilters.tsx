"use client";

import React from "react";
import { LayoutGrid, FileText, CalendarDays, PawPrint } from "lucide-react";

const FILTROS = [
  { id: "todo", label: "Todo", Icon: LayoutGrid },
  { id: "documento", label: "Documentos", Icon: FileText },
  { id: "cita", label: "Citas", Icon: CalendarDays },
  { id: "mascota", label: "Mascotas", Icon: PawPrint },
] as const;

export function ActividadFilters({
  filtro,
  setFiltro,
}: {
  filtro: "todo" | "documento" | "cita" | "mascota";
  setFiltro: (f: "todo" | "documento" | "cita" | "mascota") => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-1">
      {FILTROS.map((f) => {
        const isActive = filtro === f.id;
        return (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`
              relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl
              px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200
              ${
                isActive
                  ? "bg-white text-[#BC5F36] shadow-sm ring-1 ring-[#f3d6bb]"
                  : "text-slate-600 hover:text-[#BC5F36] hover:bg-white/60"
              }
            `}
          >
            <f.Icon className="h-3.5 w-3.5" />
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

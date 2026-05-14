"use client";

import { Files, Clock, CheckCircle2, XCircle } from "lucide-react";

interface DocumentosFiltersProps {
  filtro: string;
  onChange: (f: string) => void;
}

const FILTROS = [
  {
    id: "todos",
    label: "Todos",
    Icon: Files,
    chip: "data-[active=true]:bg-slate-100 data-[active=true]:text-slate-800 data-[active=true]:ring-slate-300",
  },
  {
    id: "pendiente",
    label: "Pendientes",
    Icon: Clock,
    chip: "data-[active=true]:bg-amber-100 data-[active=true]:text-amber-800 data-[active=true]:ring-amber-300",
  },
  {
    id: "aprobado",
    label: "Aprobados",
    Icon: CheckCircle2,
    chip: "data-[active=true]:bg-emerald-100 data-[active=true]:text-emerald-800 data-[active=true]:ring-emerald-300",
  },
  {
    id: "rechazado",
    label: "Rechazados",
    Icon: XCircle,
    chip: "data-[active=true]:bg-rose-100 data-[active=true]:text-rose-800 data-[active=true]:ring-rose-300",
  },
] as const;

export default function DocumentosFilters({
  filtro,
  onChange,
}: DocumentosFiltersProps) {
  return (
    <div className="w-full overflow-x-auto custom-scroll -mx-1 px-1 mt-4">
      <div className="inline-flex items-center gap-2 min-w-max">
        {FILTROS.map((f) => {
          const isActive = filtro === f.id;

          return (
            <button
              key={f.id}
              onClick={() => onChange(f.id)}
              data-active={isActive}
              className={`
                inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl
                px-3.5 py-2 text-sm font-semibold transition-all duration-200
                border border-slate-200 bg-white text-slate-600
                hover:border-[#f3d6bb] hover:text-[#BC5F36] hover:bg-[#fffaf4]
                data-[active=true]:ring-1 data-[active=true]:shadow-sm
                data-[active=true]:border-transparent
                ${f.chip}
              `}
            >
              <f.Icon className="h-4 w-4" />
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

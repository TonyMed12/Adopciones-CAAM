"use client";
import { Search, Plus } from "lucide-react";

export default function Filtros({
  vista,
  onChangeVista,
  query,
  onChangeQuery,
  onNueva,
}: {
  vista: "hoy" | "semana" | "mes";
  onChangeVista: (v: "hoy" | "semana" | "mes") => void;
  query: string;
  onChangeQuery: (q: string) => void;
  onNueva: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#eadacb] bg-white p-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl bg-[#fff7ef] p-1 text-sm font-semibold">
          {(["hoy", "semana", "mes"] as const).map((v) => (
            <button
              key={v}
              onClick={() => onChangeVista(v)}
              className={`rounded-lg px-3 py-1.5 transition ${
                vista === v ? "bg-[#BC5F36] text-white" : "text-[#6b4d3e] hover:bg-[#f8eee2]"
              }`}
            >
              {v === "hoy" ? "Hoy" : v === "semana" ? "Esta semana" : "Todo"}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" size={16} />
          <input
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            placeholder="Buscar por mascota, motivo, vet..."
            className="w-full rounded-2xl border border-[#eadacb] bg-white py-2.5 pl-10 pr-3 text-[15px] outline-none placeholder:text-[#a88f80] focus:border-[#d9c6b7]"
          />
        </div>
        <button
          onClick={onNueva}
          className="ml-auto inline-flex items-center gap-2 rounded-2xl bg-[#BC5F36] px-4 py-2 text-sm font-bold text-white shadow hover:shadow-md transition-shadow"
        >
          <Plus size={16} /> Nueva cita
        </button>
      </div>
    </div>
  );
}

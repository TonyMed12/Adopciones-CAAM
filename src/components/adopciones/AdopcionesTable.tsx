"use client";

import { useMemo } from "react";
import type { AdopcionForm } from "@/data/adopciones/mocks";
import { Search, X, ChevronDown } from "lucide-react";

export type FiltroEstado = "todas" | AdopcionForm["estado"];

type Props = {
  items: AdopcionForm[];
  query: string;
  onQueryChange: (q: string) => void;
  filtroEstado: FiltroEstado;
  onFiltroEstadoChange: (v: FiltroEstado) => void;

  onAprobar?: (id: string) => void;
  onRechazar?: (id: string) => void;
};

function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#2b1b12] ${props.className || ""}`}
    />
  );
}

function EstadoBadge({ estado }: { estado: AdopcionForm["estado"] }) {
  const map: Record<AdopcionForm["estado"], string> = {
    borrador: "bg-gray-100 text-gray-700 border-gray-200",
    en_revision: "bg-yellow-50 text-yellow-700 border-yellow-200",
    aprobado: "bg-green-50 text-green-700 border-green-200",
    rechazado: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2 py-1 rounded-md text-xs border ${map[estado]}`}>
      {estado.replace("_", " ")}
    </span>
  );
}

export default function AdopcionesTable({
  items,
  query,
  onQueryChange,
  filtroEstado,
  onFiltroEstadoChange,
  onAprobar,
  onRechazar,
}: Props) {
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return items.filter((f) => {
      const matchQ =
        !q ||
        f.usuarioNombre.toLowerCase().includes(q) ||
        f.mascotaNombre.toLowerCase().includes(q) ||
        f.telefono.toLowerCase().includes(q) ||
        f.direccion.toLowerCase().includes(q);
      const matchEstado = filtroEstado === "todas" || f.estado === filtroEstado;
      return matchQ && matchEstado;
    });
  }, [items, query, filtroEstado]);

  const clearQuery = () => onQueryChange("");

  return (
    <div className="bg-white rounded-2xl border border-[#EADACB] shadow-sm">
      {/* Toolbar */}
      <div className="p-3 flex flex-wrap items-center gap-3">
        {/* Search pill */}
        <div className="relative">
          <div className="flex items-center gap-2 rounded-full border border-[#EADACB] bg-white pl-3 pr-2 py-2 shadow-[0_1px_0_rgba(0,0,0,0.03)] focus-within:ring-2 focus-within:ring-[#F1C9B6]/60">
            <Search className="h-4 w-4 text-[#8b6f5d]" />
            <input
              placeholder="Buscar por usuario, mascota, teléfono o dirección"
              className="w-[280px] md:w-[420px] bg-transparent text-sm text-[#2B1B12] placeholder:text-[#8b6f5d] focus:outline-none"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                className="rounded-full p-1 hover:bg-gray-50 text-[#8b6f5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#BC5F36]"
                aria-label="Limpiar búsqueda"
                title="Limpiar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Estado select (custom pill) */}
        <div className="relative">
          <div className="flex items-center gap-2 rounded-full border border-[#EADACB] bg-white pl-3 pr-2 py-2 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <span className="text-xs text-[#6b4f40]">Estado</span>
            <div className="relative">
              <select
                value={filtroEstado}
                onChange={(e) => onFiltroEstadoChange(e.target.value as any)}
                className="appearance-none text-sm bg-transparent pr-7 pl-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F1C9B6]/60 text-[#2B1B12] cursor-pointer"
              >
                <option value="todas">Todas</option>
                <option value="en_revision">En revisión</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">Rechazado</option>
                <option value="borrador">Borrador</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-1.5 top-1.5 h-4 w-4 text-[#8b6f5d]" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-[1]">
            <tr className="bg-[#FFF4E7] border-y border-[#EADACB]">
              <Th className="text-left">Usuario</Th>
              <Th className="text-left">Mascota</Th>
              <Th className="text-left">Experiencia</Th>
              <Th className="text-left">Dirección</Th>
              <Th className="text-left">Teléfono</Th>
              <Th className="text-left">Estado</Th>
              <Th className="text-right">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, idx) => (
              <tr
                key={f.id}
                className={`border-b border-[#F3E8DC] ${
                  idx % 2 === 0 ? "bg-white" : "bg-[#FFFDF9]"
                }`} // sin hover en la fila
              >
                <td className="px-3 py-3 text-[#2B1B12] font-medium">{f.usuarioNombre}</td>
                <td className="px-3 py-3">{f.mascotaNombre}</td>
                <td className="px-3 py-3">{f.experiencia}</td>
                <td className="px-3 py-3">{f.direccion}</td>
                <td className="px-3 py-3">{f.telefono}</td>
                <td className="px-3 py-3">
                  <EstadoBadge estado={f.estado} />
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={() => onAprobar?.(f.id)}
                      className="px-2 py-1.5 border rounded-md text-xs hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-green-300"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => onRechazar?.(f.id)}
                      className="px-2 py-1.5 border rounded-md text-xs hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-red-300"
                    >
                      Rechazar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-[#6b4f40]">
                    <Search className="h-4 w-4" />
                    <span className="text-sm">Sin resultados con los filtros actuales</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

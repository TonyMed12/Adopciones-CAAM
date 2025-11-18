"use client";

import { useMemo, useState } from "react";
import type { AdopcionAdminRow } from "@/adopciones/adopciones";
import { Search, X } from "lucide-react";
import AdopcionCardFull from "@/components/adopciones/AdopcionCardFull";

export type FiltroEstado = "todas" | AdopcionAdminRow["estado"];

type Props = {
  items: AdopcionAdminRow[];
  query: string;
  onQueryChange: (q: string) => void;
  filtroEstado: FiltroEstado;
  onFiltroEstadoChange: (v: FiltroEstado) => void;

  onAprobar?: (id: string) => void;
  onRechazar?: (id: string) => void;
};

/* -------------------------------------------------- */
/*  Helpers */
/* -------------------------------------------------- */

function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#2b1b12] ${
        props.className || ""
      }`}
    />
  );
}

function EstadoBadge({ estado }: { estado: AdopcionAdminRow["estado"] }) {
  const map: Record<AdopcionAdminRow["estado"], string> = {
    pendiente: "bg-yellow-50 text-yellow-700 border-yellow-200",
    aprobada: "bg-green-50 text-green-700 border-green-200",
    rechazada: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs border ${map[estado]}`}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  );
}

/* -------------------------------------------------- */
/*  COMPONENTE PRINCIPAL */
/* -------------------------------------------------- */

export default function AdopcionesTable({
  items,
  query,
  onQueryChange,
  filtroEstado,
  onFiltroEstadoChange,
  onAprobar,
  onRechazar,
}: Props) {
  const [selected, setSelected] = useState<AdopcionAdminRow | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    return items.filter((f) => {
      const matchQ =
        !q ||
        f.usuarioNombre?.toLowerCase().includes(q) ||
        f.mascotaNombre?.toLowerCase().includes(q) ||
        f.tipo_vivienda?.toLowerCase().includes(q) ||
        f.espacio_disponible?.toLowerCase().includes(q);

      const matchEstado =
        filtroEstado === "todas" || f.estado === filtroEstado;

      return matchQ && matchEstado;
    });
  }, [items, query, filtroEstado]);

  const clearQuery = () => onQueryChange("");

  return (
    <>
      {/* -------------------------------------------------- */}
      {/* 🔍 TOOLBAR (Aplica móvil + desktop) */}
      {/* -------------------------------------------------- */}

      <div className="bg-white rounded-2xl border border-[#EADACB] shadow-sm p-3 mb-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search pill */}
          <div className="relative flex-1 min-w-[180px]">
            <div className="flex items-center gap-2 rounded-full border border-[#EADACB] bg-white pl-3 pr-2 py-2 w-full">
              <Search className="h-4 w-4 text-[#8b6f5d]" />

              <input
                placeholder="Buscar por usuario, mascota, vivienda o espacio"
                className="flex-1 bg-transparent text-sm text-[#2B1B12] placeholder:text-[#8b6f5d] focus:outline-none"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
              />

              {query && (
                <button
                  type="button"
                  onClick={clearQuery}
                  className="rounded-full p-1 hover:bg-gray-50 text-[#8b6f5d]"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* 📱 MOBILE VERSION — CARDS */}
      {/* -------------------------------------------------- */}

      <div className="lg:hidden space-y-4">
        {filtered.map((f) => (
          <div
            key={f.id}
            className="bg-white border border-[#EADACB] rounded-2xl p-4 shadow-sm space-y-3 cursor-pointer"
            onClick={() => setSelected(f)}
          >
            {/* Encabezado */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#8B4513]">
                {f.mascotaNombre ?? "Mascota"}
              </h3>
              <EstadoBadge estado={f.estado} />
            </div>

            {/* Info principal */}
            <div className="flex items-center gap-3">
              {f.mascotaImagen && (
                <img
                  src={f.mascotaImagen}
                  alt={f.mascotaNombre ?? "Mascota"}
                  className="w-14 h-14 rounded-xl object-cover border"
                />
              )}

              <div className="flex-1">
                <p className="text-sm text-[#2B1B12] font-semibold">
                  {f.usuarioNombre}
                </p>

                <p className="text-xs text-[#6b4f40] mt-1">
                  Vivienda:{" "}
                  <span className="font-medium text-[#2B1B12]">
                    {f.tipo_vivienda ?? "—"}
                  </span>
                </p>

                <p className="text-xs text-[#6b4f40]">
                  Espacio:{" "}
                  <span className="font-medium text-[#2B1B12]">
                    {f.espacio_disponible ?? "—"}
                  </span>
                </p>
              </div>
            </div>

            {/* Acciones */}
            {f.estado === "pendiente" && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAprobar?.(f.id);
                  }}
                  className="flex-1 bg-[#BC5F36] text-white rounded-lg py-2 text-sm font-semibold"
                >
                  Aprobar
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRechazar?.(f.id);
                  }}
                  className="flex-1 border border-red-300 text-red-600 rounded-lg py-2 text-sm font-semibold bg-red-50"
                >
                  Rechazar
                </button>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-[#6b4f40] py-6">
            Sin resultados con los filtros actuales
          </p>
        )}
      </div>

      {/* -------------------------------------------------- */}
      {/* 🖥 DESKTOP TABLE */}
      {/* -------------------------------------------------- */}

      <div className="hidden lg:block bg-white rounded-2xl border border-[#EADACB] shadow-sm overflow-x-auto mt-4">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-[1]">
            <tr className="bg-[#FFF4E7] border-y border-[#EADACB]">
              <Th className="text-left">Adoptante</Th>
              <Th className="text-left">Mascota</Th>
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
                }`}
              >
                {/* Adoptante */}
                <td
                  className="px-3 py-3 text-[#2B1B12] font-medium cursor-pointer"
                  onClick={() => setSelected(f)}
                >
                  {f.usuarioNombre ?? "—"}
                </td>

                {/* Mascota */}
                <td
                  className="px-3 py-3 cursor-pointer"
                  onClick={() => setSelected(f)}
                >
                  <div className="flex items-center gap-2">
                    {f.mascotaImagen && (
                      <img
                        src={f.mascotaImagen}
                        alt={f.mascotaNombre ?? "Mascota"}
                        className="h-8 w-8 rounded-full object-cover border"
                      />
                    )}
                    <span>{f.mascotaNombre ?? "—"}</span>
                  </div>
                </td>

                {/* Estado */}
                <td className="px-3 py-3">
                  <EstadoBadge estado={f.estado} />
                </td>

                {/* Acciones */}
                <td className="px-3 py-3 text-right">
                  {f.estado === "pendiente" ? (
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={() => onAprobar?.(f.id)}
                        className="px-2 py-1.5 border rounded-md text-xs hover:bg-green-50"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => onRechazar?.(f.id)}
                        className="px-2 py-1.5 border rounded-md text-xs hover:bg-red-50"
                      >
                        Rechazar
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500 italic">
                      {f.estado === "aprobada" ? "Aprobada" : "Rechazada"}
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-10 text-center text-[#6b4f40]"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border">
                    <span className="text-sm">
                      Sin resultados con los filtros actuales
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DETALLES */}
      <AdopcionCardFull
        adopcion={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onAprobar={(id) => {
          onAprobar?.(id);
          setSelected(null);
        }}
        onRechazar={(id) => {
          onRechazar?.(id);
          setSelected(null);
        }}
      />
    </>
  );
}

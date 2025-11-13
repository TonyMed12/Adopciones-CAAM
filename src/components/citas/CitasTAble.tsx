"use client";

import { useMemo } from "react";
import { Clock, CalendarClock, XCircle, CheckCircle, Search, X, ChevronDown } from "lucide-react";

export type Cita = {
  id: string;
  fecha_cita: string;
  hora_cita: string;
  estado: "programada" | "completada" | "cancelada";
  usuario?: { nombres?: string; email?: string } | null;
  mascotas?: { id: string; nombre: string } | null;

  // Evaluación post-cita
  asistencia?: "asistio" | "no_asistio_no_apto" | null;
  interaccion?: "buena_aprobada" | "no_apta" | null;
  nota?: string | null;
};

type Props = {
  items: Cita[];
  query: string;
  onQueryChange: (q: string) => void;

  filtroEstado: "todas" | "programada" | "completada" | "cancelada";
  onFiltroEstadoChange: (v: "todas" | "programada" | "completada" | "cancelada") => void;

  onReprogramar: (cita: Cita) => void;
  onCancelar: (id: string) => void;
  onEvaluar: (cita: Cita) => void;
};

function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#2b1b12] ${props.className || ""}`}
    />
  );
}

const badgeAsistencia = (a: Cita["asistencia"]) => {
  if (a === "asistio")
    return <span className="text-xs font-semibold rounded-full px-2 py-1 bg-green-100 text-green-700">asistió</span>;
  if (a === "no_asistio_no_apto")
    return <span className="text-xs font-semibold rounded-full px-2 py-1 bg-red-100 text-red-700">no asistió / no apto</span>;
  return <span className="text-xs font-semibold rounded-full px-2 py-1 bg-gray-100 text-gray-600">pendiente</span>;
};

const badgeInteraccion = (i: Cita["interaccion"]) => {
  if (i === "buena_aprobada")
    return <span className="text-xs font-semibold rounded-full px-2 py-1 bg-green-50 text-green-700 border border-green-200">aprobada</span>;
  if (i === "no_apta")
    return <span className="text-xs font-semibold rounded-full px-2 py-1 bg-red-50 text-red-700 border border-red-200">no apta</span>;
  return <span className="text-xs font-semibold rounded-full px-2 py-1 bg-gray-50 text-gray-600 border border-gray-200">—</span>;
};

export default function CitasTable({
  items,
  query,
  onQueryChange,
  filtroEstado,
  onFiltroEstadoChange,
  onReprogramar,
  onCancelar,
  onEvaluar,
}: Props) {
  const filtradas = useMemo(() => {
    const q = query.toLowerCase().trim();
    return items.filter((cita) => {
      const matchBusqueda =
        !q ||
        cita.mascotas?.nombre?.toLowerCase().includes(q) ||
        cita.usuario?.nombres?.toLowerCase().includes(q) ||
        cita.usuario?.email?.toLowerCase().includes(q);
      const matchEstado = filtroEstado === "todas" || cita.estado === filtroEstado;
      return matchBusqueda && matchEstado;
    });
  }, [items, query, filtroEstado]);

  const clearQuery = () => onQueryChange("");

  return (
    <div className="bg-white rounded-2xl border border-[#EADACB] shadow-sm">
      {/* Toolbar (igual visual que Adopciones) */}
      <div className="p-3 flex flex-wrap items-center gap-3">
        {/* Buscador pill */}
        <div className="relative flex-1 min-w-[180px]">
          <div className="flex items-center gap-2 rounded-full border border-[#EADACB] bg-white pl-3 pr-2 py-2 shadow-[0_1px_0_rgba(0,0,0,0.03)] focus-within:ring-2 focus-within:ring-[#F1C9B6]/60">
            <Search className="h-4 w-4 text-[#8b6f5d]" />
            <input
              placeholder="Buscar por usuario, mascota o correo"
              className="w-[260px] md:w-[380px] bg-transparent text-sm text-[#2B1B12] placeholder:text-[#8b6f5d] focus:outline-none"
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

        {/* Filtro de estado (pill con caret) */}
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
                <option value="programada">Programadas</option>
                <option value="completada">Completadas</option>
                <option value="cancelada">Canceladas</option>
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
              <Th className="text-left">Fecha</Th>
              <Th className="text-left">Hora</Th>
              <Th className="text-left">Estado</Th>
              <Th className="text-left">Asistencia</Th>
              <Th className="text-left">Interacción</Th>
              <Th className="text-right">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((cita, idx) => (
              <tr
                key={cita.id}
                className={`border-b border-[#F3E8DC] ${idx % 2 === 0 ? "bg-white" : "bg-[#FFFDF9]"}`}
              >
                <td className="px-3 py-3 text-[#2B1B12] font-medium">
                  {cita.usuario?.nombres || "—"}
                  <div className="text-xs text-[#8b6f5d]">{cita.usuario?.email}</div>
                </td>
                <td className="px-3 py-3 text-[#2B1B12]">{cita.mascotas?.nombre || "—"}</td>
                <td className="px-3 py-3 text-[#2B1B12]">
                  {new Date(cita.fecha_cita).toLocaleDateString("es-MX")}
                </td>
                <td className="px-3 py-3 text-[#2B1B12]">
                  <Clock className="inline-block mr-1 h-3 w-3 text-[#BC5F36]" />
                  {(cita.hora_cita || "").slice(0, 5)}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`text-xs font-semibold rounded-full px-2 py-1 ${cita.estado === "programada"
                      ? "bg-yellow-100 text-yellow-700"
                      : cita.estado === "completada"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {cita.estado}
                  </span>
                </td>

                <td className="px-3 py-3">{badgeAsistencia(cita.asistencia ?? null)}</td>
                <td className="px-3 py-3">{badgeInteraccion(cita.interaccion ?? null)}</td>

                <td className="px-3 py-3 text-right">
                  <div className="flex flex-wrap gap-2 justify-end">
                    {/* Mostrar acciones solo si la cita sigue programada y no tiene evaluación */}
                    {cita.estado === "programada" && !cita.asistencia && !cita.interaccion && (
                      <>
                        <button
                          onClick={() => onReprogramar(cita)}
                          className="flex items-center gap-1 rounded-md border border-[#EADACB] px-2 py-1 text-xs font-medium text-[#2B1B12] hover:bg-[#FFF4E7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#BC5F36]"
                        >
                          <CalendarClock size={14} />
                          Reprogramar
                        </button>

                        <button
                          onClick={() => onEvaluar(cita)}
                          className="flex items-center gap-1 rounded-md border border-emerald-200 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-emerald-300"
                        >
                          <CheckCircle size={14} />
                          Evaluar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filtradas.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-[#6b4f40]">
                    <Search className="h-4 w-4" />
                    <span className="text-sm">No se encontraron citas con los filtros actuales</span>
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

"use client";

import { Clock, CalendarClock, CheckCircle, XCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

export type Cita = {
  id: string;
  fecha_cita: string;
  hora_cita: string;
  estado: "programada" | "completada" | "cancelada";

  usuario?: { nombres?: string; email?: string } | null;
  mascotas?: { id: string; nombre: string } | null;

  asistencia?: "asistio" | "no_asistio_no_apto" | null;
  interaccion?: "buena_aprobada" | "no_apta" | null;
  nota?: string | null;
};

type Props = {
  items: Cita[];

  onReprogramar: (c: Cita) => void;
  onCancelar: (id: string) => void;
  onEvaluar: (c: Cita) => void;
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
  onReprogramar,
  onCancelar,
  onEvaluar,
}: Props) {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white rounded-2xl border border-[#EADACB] shadow-sm overflow-hidden">

      {/* ===========================
           MOBILE VIEW - CARDS
      ============================ */}
      {isMobile && (
        <div className="p-3 space-y-3 md:hidden">
          {items.map((cita) => (
            <div
              key={cita.id}
              className="rounded-2xl border border-[#EADACB] bg-white p-4 shadow-sm
              flex flex-col gap-2 max-w-full overflow-hidden"
            >
              {/* Usuario */}
              <p className="font-semibold text-[#2B1B12] text-base break-words max-w-full">
                {cita.usuario?.nombres || "Usuario"}
              </p>
              <p className="text-sm text-[#6b4f40] break-all max-w-full">
                {cita.usuario?.email}
              </p>

              {/* Mascota */}
              <p className="mt-1 text-sm font-medium text-[#2B1B12] break-normal">
                Mascota: {cita.mascotas?.nombre ?? "—"}
              </p>

              {/* Fecha/Hora */}
              <p className="text-sm text-[#6b4f40] whitespace-nowrap">
                {new Date(cita.fecha_cita).toLocaleDateString("es-MX")} — {cita.hora_cita.slice(0, 5)}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-2 max-w-full break-words">
                {/* Estado */}
                <span
                  className={`px-2 py-1 rounded-md text-xs font-semibold ${cita.estado === "programada"
                    ? "bg-yellow-100 text-yellow-700"
                    : cita.estado === "completada"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {cita.estado}
                </span>

                {/* Asistencia */}
                {badgeAsistencia(cita.asistencia)}

                {/* Interacción */}
                {badgeInteraccion(cita.interaccion)}
              </div>

              {/* Acciones */}
              <div className="mt-4 flex flex-wrap gap-2">
                {cita.estado === "programada" && !cita.asistencia && !cita.interaccion && (
                  <>
                    <button
                      className="text-sm font-semibold text-[#BC5F36]"
                      onClick={() => onReprogramar(cita)}
                    >
                      Reprogramar
                    </button>

                    <button
                      className="text-sm font-semibold text-green-600"
                      onClick={() => onEvaluar(cita)}
                    >
                      Evaluar
                    </button>

                    <button
                      className="text-sm font-semibold text-red-600"
                      onClick={() => onCancelar(cita.id)}
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-[#6b4f40]">
              No hay citas para mostrar
            </div>
          )}
        </div>
      )}

      {/* ===========================
           DESKTOP VIEW - TABLE
      ============================ */}
      {!isMobile && (
        <div className="overflow-x-auto hidden md:block">
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
              {items.map((cita, idx) => (
                <tr
                  key={cita.id}
                  className={`border-b border-[#F3E8DC] ${idx % 2 === 0 ? "bg-white" : "bg-[#FFFDF9]"
                    }`}
                >
                  {/* Usuario */}
                  <td className="px-3 py-3 text-[#2B1B12] font-medium">
                    {cita.usuario?.nombres || "—"}
                    <div className="text-xs text-[#8b6f5d]">{cita.usuario?.email}</div>
                  </td>

                  {/* Mascota */}
                  <td className="px-3 py-3 text-[#2B1B12]">
                    {cita.mascotas?.nombre || "—"}
                  </td>

                  {/* Fecha */}
                  <td className="px-3 py-3 text-[#2B1B12]">
                    {new Date(cita.fecha_cita).toLocaleDateString("es-MX")}
                  </td>

                  {/* Hora */}
                  <td className="px-3 py-3 text-[#2B1B12]">
                    <Clock className="inline-block mr-1 h-3 w-3 text-[#BC5F36]" />
                    {(cita.hora_cita || "").slice(0, 5)}
                  </td>

                  {/* Estado */}
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

                  <td className="px-3 py-3">{badgeAsistencia(cita.asistencia)}</td>
                  <td className="px-3 py-3">{badgeInteraccion(cita.interaccion)}</td>

                  {/* Acciones */}
                  <td className="px-3 py-3 text-right">
                    <div className="flex flex-wrap gap-2 justify-end">
                      {cita.estado === "programada" && !cita.asistencia && !cita.interaccion && (
                        <>
                          <button
                            onClick={() => onReprogramar(cita)}
                            className="flex items-center gap-1 rounded-md border border-[#EADACB] px-2 py-1 text-xs font-medium text-[#2B1B12] hover:bg-[#FFF4E7]"
                          >
                            <CalendarClock size={14} />
                            Reprogramar
                          </button>

                          <button
                            onClick={() => onEvaluar(cita)}
                            className="flex items-center gap-1 rounded-md border border-emerald-200 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                          >
                            <CheckCircle size={14} />
                            Evaluar
                          </button>

                          <button
                            onClick={() => onCancelar(cita.id)}
                            className="flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                          >
                            <XCircle size={14} />
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-center">
                    <div className="text-[#6b4f40]">No hay citas para mostrar</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

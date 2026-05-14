"use client";

import { Button } from "@/components/ui/Button";
import { CitasVeterinariasEstadoBadge } from "./CitasVeterinariasEstadoBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  PawPrint,
  CalendarSearch,
} from "lucide-react";

function getInitials(name: string = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "?"
  );
}

export function CitasVeterinariasTablaAdmin({
  citas,
  onAprobar,
  onCancelar,
}: {
  citas: any[];
  onAprobar: (c: any) => void;
  onCancelar: (c: any) => void;
}) {
  return (
    <section
      className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white overflow-hidden"
      style={{ boxShadow: "0 4px 16px -8px rgba(2,6,23,.06)" }}
    >
      <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb]">
            <Calendar className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-800">
              Listado de citas
            </h2>
            <p className="text-xs text-slate-500">
              {citas.length} {citas.length === 1 ? "registro" : "registros"} en
              esta vista
            </p>
          </div>
        </div>
      </header>

      {citas.length === 0 ? (
        <div className="py-12 px-6 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-100 mb-3">
            <CalendarSearch className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            No hay citas
          </p>
          <p className="text-xs text-slate-500 mt-1">
            No se encontraron citas con los filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/60">
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="px-5 py-3 text-left w-[22%]">Adoptante</th>
                <th className="px-5 py-3 text-left w-[18%]">Mascota</th>
                <th className="px-5 py-3 text-left w-[22%]">Fecha y hora</th>
                <th className="px-5 py-3 text-left w-[20%]">Motivo</th>
                <th className="px-5 py-3 text-left w-[10%]">Estado</th>
                <th className="px-5 py-3 text-right w-[8%]">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {citas.map((item) => {
                const fecha = new Date(item.fecha_cita);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Adoptante */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#FFF1E6] to-[#FFEAD2] text-[#BC5F36] font-extrabold text-[11px] ring-1 ring-[#f3d6bb] shrink-0">
                          {getInitials(item.adoptante_nombre)}
                        </div>
                        <span className="font-semibold text-slate-800 truncate">
                          {item.adoptante_nombre}
                        </span>
                      </div>
                    </td>

                    {/* Mascota */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.mascota_imagen ? (
                          <img
                            src={item.mascota_imagen}
                            alt={item.mascota_nombre}
                            className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                        ) : (
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
                            <PawPrint className="h-4 w-4" />
                          </span>
                        )}
                        <span className="font-semibold capitalize text-slate-800 truncate">
                          {item.mascota_nombre}
                        </span>
                      </div>
                    </td>

                    {/* Fecha */}
                    <td className="px-5 py-4 text-slate-700">
                      <p className="text-sm font-semibold capitalize">
                        {format(fecha, "EEEE d 'de' MMMM", { locale: es })}
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums">
                        {format(fecha, "h:mm a", { locale: es })}
                      </p>
                    </td>

                    {/* Motivo */}
                    <td className="px-5 py-4 text-sm text-slate-700">
                      <p className="line-clamp-2 leading-snug">{item.motivo}</p>
                    </td>

                    {/* Estado */}
                    <td className="px-5 py-4">
                      <CitasVeterinariasEstadoBadge estado={item.estado} />
                    </td>

                    {/* Acciones */}
                    <td className="px-5 py-4 text-right">
                      {item.estado === "pendiente" ? (
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <Button
                            size="sm"
                            onClick={() => onAprobar(item)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white !rounded-lg"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onCancelar(item)}
                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 !rounded-lg"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

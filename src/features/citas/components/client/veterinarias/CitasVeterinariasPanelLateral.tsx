"use client";

import CalendarioVeterinarias from "@/features/citas/components/client/CalendarioVeterinarias";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CitasVeterinariasEstadoBadge } from "./CitasVeterinariasEstadoBadge";
import { CalendarDays, Sparkles, PawPrint, Clock } from "lucide-react";

export function CitasVeterinariasPanelLateral({
  citas,
  proximas,
}: {
  citas: any[];
  proximas: any[];
}) {
  return (
    <div className="flex flex-col gap-4 self-start">
      {/* ============ CALENDARIO ============ */}
      <section
        className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5"
        style={{ boxShadow: "0 4px 16px -8px rgba(2,6,23,.06)" }}
      >
        <header className="flex items-center gap-2.5 mb-4">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb]">
            <CalendarDays className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-800">
              Calendario
            </h2>
            <p className="text-[11px] text-slate-500">
              Vista rápida por semana
            </p>
          </div>
        </header>

        <CalendarioVeterinarias citas={citas} vistaCompacta />

        {/* Leyenda */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 pt-3 border-t border-slate-100">
          <LegendDot color="bg-amber-400" label="Pendiente" />
          <LegendDot color="bg-emerald-400" label="Aprobada" />
          <LegendDot color="bg-rose-400" label="Cancelada" />
        </div>
      </section>

      {/* ============ PRÓXIMAS CITAS ============ */}
      <section
        className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5"
        style={{ boxShadow: "0 4px 16px -8px rgba(2,6,23,.06)" }}
      >
        <header className="flex items-center gap-2.5 mb-4">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb]">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-800">
              Próximas citas
            </h2>
            <p className="text-[11px] text-slate-500">
              {proximas.length === 0
                ? "Sin agendar"
                : `${proximas.length} ${
                    proximas.length === 1 ? "próxima" : "próximas"
                  }`}
            </p>
          </div>
        </header>

        {proximas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 py-8 px-4 text-center">
            <CalendarDays className="mx-auto h-7 w-7 text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">
              No hay citas próximas
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Aún no se han agendado citas futuras.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {proximas.map((c) => {
              const fecha = new Date(c.fecha_cita);
              return (
                <li
                  key={c.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3 hover:bg-white hover:border-slate-200 transition"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
                    <PawPrint className="h-4 w-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-slate-800 capitalize truncate">
                      {c.mascota_nombre}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 capitalize">
                      <Clock className="h-3 w-3 shrink-0" />
                      {format(fecha, "EEE d MMM · h:mm a", { locale: es })}
                    </p>
                    <div className="mt-1.5">
                      <CitasVeterinariasEstadoBadge estado={c.estado} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-600">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

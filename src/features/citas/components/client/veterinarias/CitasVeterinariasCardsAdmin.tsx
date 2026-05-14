"use client";

import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CitasVeterinariasEstadoBadge } from "./CitasVeterinariasEstadoBadge";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  PawPrint,
  CalendarSearch,
  User,
  FileText,
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

export function CitasVeterinariasCardsAdmin({
  citas,
  onAprobar,
  onCancelar,
}: {
  citas: any[];
  onAprobar: (c: any) => void;
  onCancelar: (c: any) => void;
}) {
  if (citas.length === 0) {
    return (
      <div className="lg:hidden rounded-2xl border border-dashed border-slate-200 bg-white py-12 px-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-100 mb-3">
          <CalendarSearch className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700">No hay citas</p>
        <p className="text-xs text-slate-500 mt-1">
          No se encontraron citas con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="lg:hidden space-y-3">
      {citas.map((c) => {
        const fecha = new Date(c.fecha_cita);
        return (
          <article
            key={c.id}
            className="
              rounded-2xl bg-white border border-slate-200/80 p-4
              shadow-[0_4px_16px_-8px_rgba(2,6,23,.06)]
              transition hover:shadow-[0_12px_24px_-12px_rgba(2,6,23,.14)]
            "
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                {c.mascota_imagen ? (
                  <img
                    src={c.mascota_imagen}
                    alt={c.mascota_nombre}
                    className="h-11 w-11 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                ) : (
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
                    <PawPrint className="h-5 w-5" />
                  </span>
                )}

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Mascota
                  </p>
                  <h3 className="text-sm font-extrabold text-slate-800 capitalize truncate">
                    {c.mascota_nombre}
                  </h3>
                </div>
              </div>

              <CitasVeterinariasEstadoBadge estado={c.estado} />
            </div>

            {/* Body */}
            <div className="grid gap-2.5 mb-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#FFF1E6] to-[#FFEAD2] text-[#BC5F36] font-extrabold text-[10px] ring-1 ring-[#f3d6bb] shrink-0">
                  {getInitials(c.adoptante_nombre)}
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Adoptante
                  </p>
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {c.adoptante_nombre}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-50 text-slate-600 ring-1 ring-slate-200 shrink-0">
                  <Calendar className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Fecha
                  </p>
                  <p className="text-sm font-semibold text-slate-800 capitalize">
                    {format(fecha, "EEEE d 'de' MMMM", { locale: es })}
                  </p>
                  <p className="text-xs text-slate-500 tabular-nums">
                    {format(fecha, "h:mm a", { locale: es })}
                  </p>
                </div>
              </div>

              {c.motivo && (
                <div className="flex items-start gap-2.5">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-50 text-slate-600 ring-1 ring-slate-200 shrink-0">
                    <FileText className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Motivo
                    </p>
                    <p className="text-sm text-slate-700 leading-snug">
                      {c.motivo}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Acciones */}
            {c.estado === "pendiente" && (
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <Button
                  size="sm"
                  onClick={() => onAprobar(c)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white !rounded-xl"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  Aprobar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onCancelar(c)}
                  className="flex-1 text-rose-600 hover:bg-rose-50 hover:text-rose-700 !rounded-xl"
                >
                  <XCircle className="h-4 w-4 mr-1.5" />
                  Cancelar
                </Button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

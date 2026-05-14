"use client";

import {
  CalendarCheck,
  Info,
  Clock,
  PawPrint,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { CitaProgramadaSectionProps } from "@/features/citas/types/CitaProgramadaSection.ts";

function formateaFechaBonita(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const fecha = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(fecha);
}

export default function CitaProgramadaSection({
  citaActiva,
  onVerCita,
}: CitaProgramadaSectionProps) {
  if (citaActiva.estado !== "programada") {
    return null;
  }

  const datos = [
    {
      label: "Mascota",
      value: citaActiva.mascota?.nombre ?? "Sin nombre",
      Icon: PawPrint,
    },
    {
      label: "Fecha",
      value: formateaFechaBonita(citaActiva.fecha_cita),
      Icon: CalendarCheck,
    },
    {
      label: "Hora",
      value: citaActiva.hora_cita,
      Icon: Clock,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#c7ddff] bg-gradient-to-br from-[#eef4ff] via-white to-[#d6e7ff] p-5 sm:p-6 lg:p-7 shadow-md">
      {/* Glow decorativo */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-[#3b82f6]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-[#dbeafe]/60 blur-3xl" />

      <div className="relative flex flex-col lg:flex-row gap-5 items-stretch">
        {/* === Columna principal === */}
        <div className="flex-1 min-w-0">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1d4ed8] ring-1 ring-[#c7ddff]">
            <CalendarCheck className="h-3 w-3" />
            Cita programada
          </div>

          <h3 className="mt-3 flex items-center gap-2 text-base sm:text-lg md:text-xl font-extrabold text-[#1e3a8a] tracking-tight">
            <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-2xl bg-[#1d4ed8] text-white shadow-md shrink-0">
              <CalendarCheck className="h-5 w-5" />
            </span>
            ¡Tu cita ya está agendada!
          </h3>

          <p className="mt-2 text-sm sm:text-base text-[#1e40af] leading-relaxed">
            Acude a tu cita en la fecha y hora indicadas. Después de la visita,
            el CAAM evaluará la interacción para continuar con tu proceso.
          </p>

          {/* Datos */}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {datos.map((d) => (
              <div
                key={d.label}
                className="rounded-2xl bg-white border border-[#d4e3ff] px-4 py-3 shadow-sm transition hover:shadow-md hover:-translate-y-[1px]"
              >
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
                  <d.Icon className="h-3 w-3" />
                  {d.label}
                </div>
                <p className="mt-1 text-sm sm:text-base font-extrabold text-[#1e3a8a] tracking-tight capitalize">
                  {d.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* === Columna lateral === */}
        <div className="w-full lg:w-60 rounded-2xl bg-white/80 backdrop-blur border border-[#d4e3ff] p-4 text-xs sm:text-sm text-[#1e3a8a] shadow-sm shrink-0">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#2563eb] mb-2 flex items-center gap-1">
            <Info className="h-3 w-3" />
            ¿Qué sigue?
          </p>

          <ol className="space-y-2">
            {[
              "Asiste a tu cita en el CAAM.",
              "El equipo evaluará la interacción.",
              "Si es aprobada, podrás continuar.",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="grid h-4 w-4 shrink-0 mt-0.5 place-items-center rounded-full bg-[#dbeafe] text-[#1d4ed8] text-[9px] font-extrabold">
                  {i + 1}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="relative mt-5 sm:mt-6 flex justify-end">
        <Button
          variant="ghost"
          onClick={onVerCita}
          className="cursor-pointer bg-white text-[#1d4ed8] border border-[#bfdbfe] hover:bg-[#eff6ff] hover:text-[#1d4ed8] shadow-sm"
        >
          Ver detalles de mi cita
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}

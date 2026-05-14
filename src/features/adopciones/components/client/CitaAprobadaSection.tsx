"use client";

import { CheckCircle2, FileText, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface CitaAprobadaSectionProps {
  mascota: {
    nombre: string;
    imagen_url: string | null;
  };
  onIrFormulario: () => void;
}

export default function CitaAprobadaSection({
  mascota,
  onIrFormulario,
}: CitaAprobadaSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-100 p-5 sm:p-7 shadow-md animate-fade-in">
      {/* Glow decorativo */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-blue-200/40 blur-3xl" />

      {/* === Header === */}
      <div className="relative flex items-start gap-3 sm:gap-4">
        <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg ring-4 ring-blue-200 shrink-0">
          <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider ring-1 ring-blue-200">
            <Sparkles className="h-3 w-3" />
            Cita aprobada
          </span>
          <h3 className="mt-2 text-lg sm:text-xl md:text-2xl font-extrabold text-blue-900 tracking-tight leading-tight">
            ¡Tu visita fue exitosa!
          </h3>
          <p className="mt-1 text-sm sm:text-base text-blue-700 leading-relaxed">
            El CAAM confirmó que la interacción con tu mascota fue positiva.
            Ahora puedes continuar con el formulario final.
          </p>
        </div>
      </div>

      {/* === Body === */}
      <div className="relative mt-5 sm:mt-6 grid gap-4 sm:gap-5 sm:grid-cols-[140px_1fr] lg:grid-cols-[160px_1fr] items-center">
        <div className="rounded-2xl overflow-hidden border border-blue-200 shadow-sm bg-white">
          <img
            src={mascota.imagen_url || "/img/placeholder-mascota.jpg"}
            alt={mascota.nombre}
            className="w-full h-32 sm:h-36 lg:h-40 object-cover"
          />
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-blue-200 p-3 sm:p-4 shadow-sm">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-700/80">
              Mascota
            </p>
            <p className="mt-0.5 text-base sm:text-lg font-extrabold text-blue-900 capitalize">
              {mascota.nombre}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur border border-blue-200 p-3 sm:p-4 shadow-sm">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-700/80">
              Convivencia
            </p>
            <p className="mt-0.5 text-sm sm:text-base font-extrabold text-blue-900 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Aprobada
            </p>
          </div>
        </div>
      </div>

      {/* === Footer === */}
      <div className="relative mt-5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3">
        <p className="text-xs sm:text-sm text-blue-800/90 leading-relaxed">
          Solo falta llenar el formulario de adopción para completar tu
          proceso.
        </p>
        <Button
          onClick={onIrFormulario}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 shadow-md shrink-0"
          size="lg"
        >
          <FileText className="h-5 w-5 mr-2" />
          Llenar formulario
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}

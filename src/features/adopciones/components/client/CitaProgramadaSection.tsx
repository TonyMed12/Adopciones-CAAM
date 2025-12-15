"use client";

import { CalendarCheck, Info } from "lucide-react";
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

    return (
        <div className="mt-6 mb-4 rounded-2xl border border-[#c7ddff] bg-gradient-to-br from-[#eef4ff] via-[#e3f0ff] to-[#d6e7ff] p-6 shadow-md">
            <div className="flex flex-col md:flex-row gap-5 items-start">
                {/* Columna izquierda */}
                <div className="flex-1">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold text-[#1d4ed8] border border-[#c7ddff]">
                        <CalendarCheck className="h-3 w-3" />
                        Cita programada
                    </div>

                    <h3 className="mt-3 text-base md:text-lg font-extrabold text-[#1e3a8a] flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1d4ed8]/10">
                            <CalendarCheck className="h-4 w-4 text-[#1d4ed8]" />
                        </span>
                        ¡Ya tienes una cita programada!
                    </h3>

                    <p className="mt-2 text-sm text-[#1e40af] leading-relaxed">
                        Acude a tu cita en la fecha y hora indicadas. Después de la visita,
                        el CAAM evaluará la interacción para continuar con el proceso.
                    </p>

                    {/* Datos */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-white/70 border border-[#d4e3ff] px-4 py-3 text-xs text-[#1e3a8a]">
                            <p className="font-semibold text-[11px] uppercase tracking-wide text-[#2563eb]/90">
                                Mascota
                            </p>
                            <p className="mt-1 text-sm font-bold">
                                {citaActiva.mascota?.nombre ?? "Sin nombre"}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white/70 border border-[#d4e3ff] px-4 py-3 text-xs text-[#1e3a8a]">
                            <p className="font-semibold text-[11px] uppercase tracking-wide text-[#2563eb]/90">
                                Fecha
                            </p>
                            <p className="mt-1 text-sm font-bold">
                                {formateaFechaBonita(citaActiva.fecha_cita)}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white/70 border border-[#d4e3ff] px-4 py-3 text-xs text-[#1e3a8a]">
                            <p className="font-semibold text-[11px] uppercase tracking-wide text-[#2563eb]/90">
                                Hora
                            </p>
                            <p className="mt-1 text-sm font-bold">
                                {citaActiva.hora_cita}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Columna derecha */}
                <div className="w-full md:w-56 rounded-2xl bg-white/80 border border-[#d4e3ff] px-4 py-4 text-xs text-[#1e3a8a] shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2563eb] mb-2 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        ¿Qué sigue?
                    </p>

                    <ol className="space-y-2">
                        <li>• Asiste a tu cita en el CAAM.</li>
                        <li>• El equipo evaluará la interacción.</li>
                        <li>• Si es aprobada, podrás continuar el proceso.</li>
                    </ol>
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <Button
                    onClick={onVerCita}
                    className="bg-white/90 text-[#1d4ed8] border border-[#bfdbfe] hover:bg-[#eff6ff] text-sm font-semibold px-4 py-2 rounded-xl"
                >
                    Ver detalles de mi cita
                </Button>
            </div>
        </div>
    );
}

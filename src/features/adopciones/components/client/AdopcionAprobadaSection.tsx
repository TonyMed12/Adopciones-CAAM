"use client";

import { CheckCircle2, Info, XCircle } from "lucide-react";
import dynamic from "next/dynamic";

import type { EstadoDocumentos } from "@/features/adopciones/types/documentos";
import type { CitaAdopcion } from "@/features/adopciones/types/citaAdopcion";
import type { CitaProgramadaUI } from "@/features/citas/types/CitaProgramadaSection";

import CitaProgramadaSection from "@/features/adopciones/components/client/CitaProgramadaSection";
import CitaAprobadaSection from "@/features/adopciones/components/client/CitaAprobadaSection";
import SolicitudPendienteSection from "@/features/adopciones/components/client/SolicitudPendienteSection";
import type { SolicitudAdopcionUI } from "@/features/adopciones/types/solicitud";

const StepperAdopcion = dynamic(
    () =>
        import(
            "@/features/adopciones/components/client/StepperAdopcion"
        ),
    { ssr: false }
);

export interface AdopcionAprobadaSectionProps {
    estado: EstadoDocumentos;
    solicitudActiva: SolicitudAdopcionUI | null;
    citaActiva: CitaAdopcion | null;
    citaProgramadaUI: CitaProgramadaUI | null;
    adopcionEstado: "pendiente" | "aprobada" | "rechazada" | null;

    onVerCita: () => void;
    onIrFormulario: (solicitudId: string) => void;
    onCancelarSolicitud: () => void;
}

export default function AdopcionAprobadaSection({
    estado,
    solicitudActiva,
    citaActiva,
    citaProgramadaUI,
    adopcionEstado,
    onVerCita,
    onIrFormulario,
    onCancelarSolicitud,
}: AdopcionAprobadaSectionProps) {
    if (estado !== "aprobado") return null;

    return (
        <section className="rounded-2xl border border-[#eadacb] bg-white p-5 shadow-sm text-[#2b1b12]">
            {/* Banner documentos aprobados */}
            <div className="flex items-center gap-3 rounded-2xl border border-green-200 border-b-2 border-b-green-300 bg-green-50 p-3 mb-4 shadow-sm">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-green-100 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-green-800">
                        Documentos validados
                    </span>
                    <span className="text-xs text-green-700 mt-0.5">
                        Todo está en orden. Puedes continuar con tu proceso de adopción.
                    </span>
                </div>
            </div>

            {/* Stepper */}
            <div className="relative z-10">
                <StepperAdopcion
                    activeStep={
                        adopcionEstado === "aprobada" || adopcionEstado === "rechazada"
                            ? 5
                            : adopcionEstado === "pendiente"
                                ? 4
                                : citaActiva
                                    ? 3
                                    : solicitudActiva
                                        ? 2
                                        : 1
                    }
                    solicitudId={solicitudActiva?.id ?? null}
                    blockedSteps={{
                        3: !(
                            citaActiva &&
                            citaActiva.estado === "completada" &&
                            citaActiva.asistencia === "asistio" &&
                            citaActiva.interaccion === "buena_aprobada"
                        ),
                        4: true,
                        5: true,
                    }}
                    onStepClick={() => { }}
                />
            </div>

            {/* Contenido según estado */}
            {citaActiva ? (
                adopcionEstado === "pendiente" ? (
                    <div className="mt-6 mb-6 rounded-2xl border border-[#f2d4b7] bg-gradient-to-br from-[#fff7f1] via-white to-[#ffe9d6] p-6 shadow">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-[#BC5F36] text-white flex items-center justify-center">
                                <Info className="h-6 w-6" />
                            </div>

                            <div>
                                <h3 className="text-lg font-extrabold text-[#8b4513]">
                                    Tu formulario está en revisión
                                </h3>
                                <p className="text-sm text-[#7a5c49] mt-1">
                                    Ya completaste el formulario de adopción. El equipo del CAAM lo
                                    está revisando.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : adopcionEstado === "aprobada" ? (
                    <div className="rounded-xl border border-green-300 bg-green-50 p-5 mb-4 mt-5">
                        <h3 className="text-sm font-extrabold text-green-800 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            ¡Adopción aprobada!
                        </h3>
                        <p className="mt-2 text-sm text-green-700">
                            Felicidades, el proceso de adopción ha sido aprobado.
                        </p>
                    </div>
                ) : adopcionEstado === "rechazada" ? (
                    <div className="rounded-xl border border-red-300 bg-red-50 p-5 mb-4 mt-5">
                        <h3 className="text-sm font-extrabold text-red-800 flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            Adopción no aprobada
                        </h3>
                        <p className="mt-2 text-sm text-red-700">
                            En esta ocasión la solicitud no fue aprobada.
                        </p>
                    </div>
                ) : citaProgramadaUI?.estado === "programada" ? (
                    <CitaProgramadaSection
                        citaActiva={citaProgramadaUI}
                        estado={estado}
                        onVerCita={onVerCita}
                    />
                ) : citaActiva.estado === "completada" &&
                    citaActiva.asistencia === "asistio" &&
                    citaActiva.interaccion === "buena_aprobada" ? (
                    <CitaAprobadaSection
                        mascota={{
                            nombre: solicitudActiva?.mascota?.nombre ?? "Mascota",
                            imagen_url: solicitudActiva?.mascota?.imagen_url ?? null,
                        }}
                        onIrFormulario={() => {
                            if (!solicitudActiva) return;
                            onIrFormulario(solicitudActiva.id);
                        }}
                    />

                ) : null
            ) : solicitudActiva ? (
                <SolicitudPendienteSection
                    solicitudActiva={solicitudActiva}
                    citaActiva={citaActiva}
                    estado={estado}
                    onCancelar={onCancelarSolicitud}
                />
            ) : null}
        </section>
    );
}

"use client";

import { CheckCircle2, Info, XCircle, PawPrint, FileSearch, PartyPopper } from "lucide-react";
import dynamic from "next/dynamic";

import type { EstadoDocumentos } from "@/features/adopciones/types/documentos";
import type { CitaAdopcion } from "@/features/adopciones/types/citaAdopcion";
import type { CitaProgramadaUI } from "@/features/citas/types/CitaProgramadaSection";
import type { SolicitudAdopcionUI } from "@/features/adopciones/types/solicitud";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

import CitaProgramadaSection from "@/features/adopciones/components/client/CitaProgramadaSection";
import CitaAprobadaSection from "@/features/adopciones/components/client/CitaAprobadaSection";
import SolicitudPendienteSection from "@/features/adopciones/components/client/SolicitudPendienteSection";

const StepperAdopcion = dynamic(
    () => import("@/features/adopciones/components/client/StepperAdopcion"),
    { ssr: false }
);

export interface AdopcionAprobadaSectionProps {
    estado: EstadoDocumentos;
    solicitudActiva: SolicitudAdopcionUI | null;
    citaActiva: CitaAdopcion | null;
    citaProgramadaUI: CitaProgramadaUI | null;
    adopcionEstado: "pendiente" | "aprobada" | "rechazada" | null;

    onVerCita: () => void;
    onVerMascotas: () => void;
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
    onVerMascotas,
    onIrFormulario,
    onCancelarSolicitud,
}: AdopcionAprobadaSectionProps) {
    if (estado !== "aprobado") return null;

    const activeStep =
        adopcionEstado === "aprobada" || adopcionEstado === "rechazada"
            ? 5
            : adopcionEstado === "pendiente"
                ? 4
                : citaActiva
                    ? 3
                    : solicitudActiva
                        ? 2
                        : 1;

    return (
        <section className="rounded-3xl border border-[#eadacb] bg-white p-5 sm:p-7 shadow-sm text-[#2b1b12]">
            {/* ============ Banner de documentos aprobados ============ */}
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 mb-6 shadow-sm">
                <div className="h-11 w-11 grid place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-200 shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                </div>

                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-base font-extrabold text-emerald-900">
                            Documentos validados
                        </span>
                        <Badge tone="success" size="sm" dot>
                            Aprobado
                        </Badge>
                    </div>
                    <span className="text-xs sm:text-sm text-emerald-800/90 mt-0.5 leading-relaxed">
                        Todo está en orden. Puedes continuar con tu proceso de adopción.
                    </span>
                </div>
            </div>

            {/* ============ Stepper visual del flujo ============ */}
            <div className="relative z-10 mb-6">
                <StepperAdopcion
                    activeStep={activeStep}
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
                    onStepClick={() => {}}
                />
            </div>

            {/* ============ Contenido del estado actual ============ */}
            <div>
                {/* CASO: sin solicitud */}
                {!solicitudActiva ? (
                    <div className="rounded-2xl border border-[#eadacb] bg-gradient-to-br from-[#FFF7EF] to-white p-5 sm:p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
                                <PawPrint className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-extrabold text-[#2b1b12] leading-tight">
                                    Elige a tu mascota
                                </h3>
                                <p className="text-sm text-[#7a5c49] leading-relaxed mt-0.5">
                                    Aún no has seleccionado una mascota.
                                </p>
                            </div>
                        </div>

                        <Button className="w-full sm:w-auto" onClick={onVerMascotas}>
                            Ver mascotas disponibles
                        </Button>
                    </div>
                ) : citaActiva ? (
                    adopcionEstado === "pendiente" ? (
                        <div className="rounded-2xl border border-[#f2d4b7] bg-gradient-to-br from-[#FFF7EF] via-white to-[#FFEAD2] p-5 sm:p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#BC5F36] text-white shadow-md shrink-0">
                                    <FileSearch className="h-6 w-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-base sm:text-lg font-extrabold text-[#2b1b12]">
                                            Tu formulario está en revisión
                                        </h3>
                                        <Badge tone="warning" size="sm" dot>
                                            En revisión
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-[#6c5241] mt-1 leading-relaxed">
                                        Ya completaste el formulario de adopción. El equipo del CAAM
                                        lo está revisando. Te avisaremos cuando esté listo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : adopcionEstado === "aprobada" ? (
                        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-5 sm:p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-md shrink-0">
                                    <PartyPopper className="h-6 w-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-base sm:text-lg font-extrabold text-emerald-900">
                                            ¡Adopción aprobada!
                                        </h3>
                                        <Badge tone="success" size="sm" dot>
                                            Aprobada
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-emerald-800/90 mt-1 leading-relaxed">
                                        Felicidades, el proceso de adopción ha sido aprobado.
                                        Lleva el seguimiento de tu nueva mascota desde "Mis mascotas".
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : adopcionEstado === "rechazada" ? (
                        <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100/60 p-5 sm:p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-600 text-white shadow-md shrink-0">
                                    <XCircle className="h-6 w-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-base sm:text-lg font-extrabold text-rose-900">
                                            Adopción no aprobada
                                        </h3>
                                        <Badge tone="danger" size="sm" dot>
                                            Rechazada
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-rose-800/90 mt-1 leading-relaxed">
                                        En esta ocasión la solicitud no fue aprobada. Puedes intentarlo
                                        de nuevo con otra mascota.
                                    </p>
                                </div>
                            </div>
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
                                nombre: solicitudActiva.mascota?.nombre ?? "Mascota",
                                imagen_url: solicitudActiva.mascota?.imagen_url ?? null,
                            }}
                            onIrFormulario={() => onIrFormulario(solicitudActiva.id)}
                        />
                    ) : null
                ) : (
                    <SolicitudPendienteSection
                        solicitudActiva={solicitudActiva}
                        citaActiva={citaActiva}
                        estado={estado}
                        onCancelar={onCancelarSolicitud}
                    />
                )}
            </div>
        </section>
    );
}

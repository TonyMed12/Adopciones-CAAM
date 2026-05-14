"use client";

import {
  CheckCircle2,
  XCircle,
  PawPrint,
  FileSearch,
  PartyPopper,
  Heart,
  ArrowRight,
} from "lucide-react";
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
    <section className="rounded-3xl border border-[#eadacb] bg-white p-4 sm:p-6 lg:p-7 shadow-[0_4px_20px_-8px_rgba(43,27,18,0.08)] text-[#2b1b12]">
      {/* ============ Banner de documentos aprobados ============ */}
      <div className="flex items-start sm:items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/40 p-3.5 sm:p-4 mb-5 sm:mb-6 shadow-sm">
        <div className="h-10 w-10 sm:h-11 sm:w-11 grid place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-200 shrink-0">
          <CheckCircle2 className="h-5 w-5" />
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-emerald-900 tracking-tight">
              Documentos validados
            </span>
            <Badge tone="success" size="sm" dot>
              Aprobado
            </Badge>
          </div>
          <span className="text-xs sm:text-sm text-emerald-800/90 mt-0.5 leading-relaxed">
            Todo está en orden. Continúa con los siguientes pasos.
          </span>
        </div>
      </div>

      {/* ============ Stepper visual del flujo ============ */}
      <div className="relative z-10 mb-6 sm:mb-8">
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
          <div className="relative overflow-hidden rounded-3xl border border-[#f3d6bb] bg-gradient-to-br from-[#FFF7EF] via-white to-[#FFEAD2] p-5 sm:p-7 shadow-sm">
            <div className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full bg-[#FDE68A]/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-[#BC5F36]/10 blur-3xl" />

            <div className="relative flex flex-col items-center text-center gap-4">
              <div className="grid h-16 w-16 sm:h-20 sm:w-20 place-items-center rounded-3xl bg-white text-[#BC5F36] shadow-lg ring-1 ring-[#f3d6bb]">
                <PawPrint className="h-7 w-7 sm:h-9 sm:w-9" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1E6] text-[#BC5F36] px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider ring-1 ring-[#f3d6bb]">
                  <Heart className="h-3 w-3 fill-current" />
                  Siguiente paso
                </span>

                <h3 className="mt-3 text-lg sm:text-xl md:text-2xl font-extrabold text-[#2b1b12] leading-tight">
                  Elige a tu mascota
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#6c5241] leading-relaxed max-w-md">
                  Aún no has seleccionado a tu compañero. Conoce las mascotas
                  disponibles y encuentra a quien conecte contigo.
                </p>
              </div>

              <Button
                size="lg"
                className="w-full sm:w-auto cursor-pointer mt-2"
                onClick={onVerMascotas}
              >
                Ver mascotas disponibles
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        ) : citaActiva ? (
          adopcionEstado === "pendiente" ? (
            <div className="relative overflow-hidden rounded-3xl border border-[#f2d4b7] bg-gradient-to-br from-[#FFF7EF] via-white to-[#FFEAD2] p-5 sm:p-7 shadow-sm">
              <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-[#FDE68A]/40 blur-3xl" />

              <div className="relative flex items-start gap-4">
                <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-[#BC5F36] text-white shadow-md shrink-0">
                  <FileSearch className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-[#2b1b12] tracking-tight">
                      Tu formulario está en revisión
                    </h3>
                    <Badge tone="warning" size="sm" dot>
                      En revisión
                    </Badge>
                  </div>
                  <p className="text-sm sm:text-base text-[#6c5241] mt-1.5 leading-relaxed">
                    Ya completaste el formulario de adopción. El equipo del
                    CAAM lo está revisando. Te avisaremos cuando esté listo.
                  </p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { l: "Enviado", done: true },
                      { l: "Revisión", done: true, current: true },
                      { l: "Decisión", done: false },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className={`
                          rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-center ring-1
                          ${
                            s.current
                              ? "bg-[#BC5F36] text-white ring-[#BC5F36] shadow"
                              : s.done
                              ? "bg-white text-[#15803d] ring-emerald-200"
                              : "bg-white/60 text-[#a88b77] ring-[#eadacb]"
                          }
                        `}
                      >
                        {s.l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : adopcionEstado === "aprobada" ? (
            <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/60 p-5 sm:p-7 shadow-sm">
              <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-emerald-300/40 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-12 h-44 w-44 rounded-full bg-emerald-200/40 blur-3xl" />

              <div className="relative flex flex-col items-center text-center gap-4">
                <div className="grid h-16 w-16 sm:h-20 sm:w-20 place-items-center rounded-3xl bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-200">
                  <PartyPopper className="h-7 w-7 sm:h-9 sm:w-9" />
                </div>

                <div>
                  <Badge tone="success" size="md" dot>
                    Adopción aprobada
                  </Badge>
                  <h3 className="mt-3 text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-900 leading-tight">
                    ¡Felicidades, es oficial!
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-emerald-800/90 leading-relaxed max-w-md">
                    El proceso de adopción ha sido aprobado. Lleva el
                    seguimiento de tu nueva mascota desde "Mis mascotas".
                  </p>
                </div>
              </div>
            </div>
          ) : adopcionEstado === "rechazada" ? (
            <div className="relative overflow-hidden rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-rose-100/60 p-5 sm:p-7 shadow-sm">
              <div className="relative flex items-start gap-4">
                <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-rose-600 text-white shadow-md shrink-0">
                  <XCircle className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-rose-900 tracking-tight">
                      Adopción no aprobada
                    </h3>
                    <Badge tone="danger" size="sm" dot>
                      Rechazada
                    </Badge>
                  </div>
                  <p className="text-sm sm:text-base text-rose-800/90 mt-1.5 leading-relaxed">
                    En esta ocasión la solicitud no fue aprobada. Puedes
                    intentarlo de nuevo con otra mascota.
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

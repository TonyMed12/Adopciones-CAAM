"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Info,
  Lock,
  PawPrint,
  CalendarCheck,
  FileText,
  Search as SearchIcon,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";

const PASOS_ADOPCION = [
  {
    id: 1,
    titulo: "Mascotas",
    desc: "Elige a tu compañero.",
    detalle:
      "Explora la lista completa de mascotas disponibles y selecciona una para iniciar tu proceso.",
    ruta: "/dashboards/usuario/mascotas",
    Icon: PawPrint,
  },
  {
    id: 2,
    titulo: "Cita",
    desc: "Agenda una visita.",
    detalle:
      "Programa una visita al CAAM para conocer personalmente a tu mascota.",
    ruta: "/dashboards/usuario/citas",
    Icon: CalendarCheck,
  },
  {
    id: 3,
    titulo: "Formulario",
    desc: "Llena tus datos.",
    detalle:
      "Completa el formulario para continuar con la evaluación del CAAM.",
    ruta: "/dashboards/usuario/citas",
    Icon: FileText,
  },
  {
    id: 4,
    titulo: "Evaluación",
    desc: "Estamos revisando.",
    detalle:
      "Revisaremos tus documentos, formulario y visita para determinar la aprobación.",
    ruta: null,
    Icon: SearchIcon,
  },
  {
    id: 5,
    titulo: "Finalizar",
    desc: "Adopción aprobada.",
    detalle: "Si todo es aprobado, podrás completar oficialmente la adopción.",
    ruta: null,
    Icon: Trophy,
  },
] as const;

type Paso = (typeof PASOS_ADOPCION)[number];

interface StepperAdopcionProps {
  activeStep: number;
  solicitudId?: string | null;
  blockedSteps?: Record<number, boolean>;
  onStepClick?: (step: number) => void;
}

export default function StepperAdopcion({
  activeStep,
  solicitudId,
  blockedSteps,
  onStepClick,
}: StepperAdopcionProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);

  const totalSteps = PASOS_ADOPCION.length;
  const progress =
    totalSteps <= 1 ? 0 : ((activeStep - 1) / (totalSteps - 1)) * 100;

  const handlePasoClick = (paso: Paso) => {
    const bloqueado =
      paso.id !== activeStep || blockedSteps?.[paso.id] === true;
    if (bloqueado) return;

    if (onStepClick) {
      onStepClick(paso.id);
      return;
    }

    if (!paso.ruta) return;

    const rutaStr: string = paso.ruta;

    if (rutaStr === "formulario" && solicitudId) {
      router.push(`/dashboards/usuario/form-adopcion/${solicitudId}`);
      return;
    }

    if (rutaStr && rutaStr !== "formulario") {
      router.push(rutaStr);
    }
  };

  /* ============================================================
     Encabezado: indicador de progreso textual
     ============================================================ */
  const completados = PASOS_ADOPCION.filter((p) => p.id < activeStep).length;
  const porcentaje = Math.round((completados / totalSteps) * 100);

  return (
    <div className="mt-4 sm:mt-6">
      {/* ============ Header compacto del progreso ============ */}
      <div className="mb-5 sm:mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#BC5F36]">
            Tu progreso
          </p>
          <p className="text-sm sm:text-base font-extrabold text-[#2b1b12] truncate">
            Paso {activeStep} de {totalSteps} ·{" "}
            <span className="text-[#7a5c49] font-semibold">
              {PASOS_ADOPCION.find((p) => p.id === activeStep)?.titulo ??
                "Pendiente"}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="text-[10px] sm:text-xs font-semibold text-[#7a5c49] uppercase tracking-wider">
            Completado
          </span>
          <span className="text-base sm:text-lg font-extrabold text-[#BC5F36] leading-none">
            {porcentaje}%
          </span>
        </div>
      </div>

      {/* ============================================================
          MOBILE: Timeline vertical (< md)
          ============================================================ */}
      <div className="md:hidden relative pl-9">
        {/* Línea base */}
        <div className="absolute left-[18px] top-2 bottom-2 w-[2px] bg-[#eadacb] rounded-full" />

        {/* Progreso */}
        <div
          className="absolute left-[18px] top-2 w-[2px] bg-gradient-to-b from-[#BC5F36] via-[#BC5F36] to-[#2563eb] rounded-full transition-all duration-700"
          style={{
            height: `calc(${progress}% - 1rem)`,
          }}
        />

        <ol className="space-y-3">
          {PASOS_ADOPCION.map((paso) => {
            const completado = paso.id < activeStep;
            const activo = paso.id === activeStep;
            const bloqueado =
              paso.id !== activeStep || blockedSteps?.[paso.id] === true;

            return (
              <li key={paso.id} className="relative">
                {/* Dot */}
                <span
                  className={`
                    absolute -left-9 top-3 grid h-9 w-9 place-items-center rounded-full
                    border-2 text-xs font-extrabold shadow-sm
                    transition-all duration-300
                    ${
                      completado
                        ? "border-[#2563eb] bg-[#2563eb] text-white"
                        : activo
                        ? "border-[#BC5F36] bg-white text-[#BC5F36] ring-4 ring-[#BC5F36]/15"
                        : "border-[#eadacb] bg-white text-[#a88b77]"
                    }
                  `}
                >
                  {completado ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : bloqueado && paso.id > activeStep ? (
                    <Lock className="h-3.5 w-3.5" />
                  ) : (
                    paso.id
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => handlePasoClick(paso)}
                  disabled={bloqueado}
                  className={`
                    w-full text-left rounded-2xl border p-3.5 transition-all duration-200
                    ${
                      completado
                        ? "border-[#c7ddff] bg-[#eef4ff] text-[#1d3a8a]"
                        : activo
                        ? "border-[#f3d6bb] bg-gradient-to-br from-[#FFF7EF] to-white text-[#2b1b12] shadow-sm"
                        : "border-[#eadacb] bg-white/70 text-[#7a5c49]"
                    }
                    ${
                      bloqueado
                        ? "opacity-90 cursor-not-allowed"
                        : "active:scale-[0.99] hover:shadow-md hover:border-[#f3d6bb]"
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-extrabold tracking-tight">
                          {paso.titulo}
                        </p>
                        <span
                          className={`
                            inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider
                            ${
                              completado
                                ? "bg-[#dbeafe] text-[#1d4ed8]"
                                : activo
                                ? "bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb]"
                                : "bg-[#f5ebe1] text-[#a88b77]"
                            }
                          `}
                        >
                          {completado
                            ? "Listo"
                            : activo
                            ? "En curso"
                            : "Pendiente"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed">{paso.desc}</p>
                    </div>

                    <paso.Icon
                      className={`
                        h-5 w-5 shrink-0
                        ${
                          completado
                            ? "text-[#2563eb]"
                            : activo
                            ? "text-[#BC5F36]"
                            : "text-[#c9b5a3]"
                        }
                      `}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ============================================================
          DESKTOP: timeline horizontal (≥ md)
          ============================================================ */}
      <div className="hidden md:block relative">
        {/* Línea base centrada con los círculos */}
        <div className="absolute top-[22px] left-[6%] right-[6%] h-[3px] bg-[#eadacb] z-0 rounded-full" />

        {/* Línea de progreso */}
        <div
          className="absolute top-[22px] left-[6%] h-[3px] bg-gradient-to-r from-[#2563eb] via-[#BC5F36] to-[#BC5F36] z-0 rounded-full transition-all duration-700 ease-out"
          style={{ width: `calc(${progress}% * 0.88)` }}
        />

        <div className="relative grid gap-4 md:grid-cols-5 z-10">
          {PASOS_ADOPCION.map((paso) => {
            const completado = paso.id < activeStep;
            const activo = paso.id === activeStep;
            const bloqueado =
              paso.id !== activeStep || blockedSteps?.[paso.id] === true;

            return (
              <button
                type="button"
                key={paso.id}
                onMouseEnter={() => setHovered(paso.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handlePasoClick(paso)}
                disabled={bloqueado}
                className={`
                  relative flex flex-col items-center text-center px-2 pt-0 pb-3
                  transition-all duration-300 group
                  ${
                    bloqueado
                      ? "cursor-not-allowed"
                      : "cursor-pointer hover:-translate-y-1"
                  }
                `}
              >
                {/* Círculo */}
                <span
                  className={`
                    relative grid h-11 w-11 place-items-center rounded-full border-2 text-sm font-extrabold shadow-sm z-10
                    transition-all duration-300
                    ${
                      completado
                        ? "border-[#2563eb] bg-[#2563eb] text-white shadow-[#2563eb]/30"
                        : activo
                        ? "border-[#BC5F36] bg-white text-[#BC5F36] ring-4 ring-[#BC5F36]/15 scale-110"
                        : bloqueado
                        ? "border-[#e5d5c5] bg-[#f9f3ec] text-[#b5a090]"
                        : "border-[#eadacb] bg-white text-[#7a5c49]"
                    }
                  `}
                >
                  {completado ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : bloqueado && paso.id > activeStep ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <paso.Icon className="h-5 w-5" />
                  )}
                </span>

                {/* Card */}
                <div
                  className={`
                    mt-4 w-full rounded-2xl border px-3 py-3 shadow-sm transition-all duration-300
                    ${
                      completado
                        ? "border-[#c7ddff] bg-[#eef4ff] text-[#1d3a8a]"
                        : activo
                        ? "border-[#f3d6bb] bg-gradient-to-br from-[#FFF7EF] to-white text-[#2b1b12] shadow-md"
                        : bloqueado
                        ? "border-[#eadacb] bg-white/70 text-[#a88b77]"
                        : "border-[#eadacb] bg-white text-[#7a5c49] group-hover:border-[#f3d6bb] group-hover:shadow-md"
                    }
                  `}
                >
                  <p className="text-sm font-extrabold tracking-tight">
                    {paso.titulo}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed line-clamp-2">
                    {paso.desc}
                  </p>

                  <p
                    className={`
                      mt-2 text-[10px] font-bold uppercase tracking-wider flex justify-center items-center gap-1
                      ${
                        completado
                          ? "text-[#2563eb]"
                          : activo
                          ? "text-[#BC5F36]"
                          : "text-[#c49b80]"
                      }
                    `}
                  >
                    <Info className="h-3 w-3" />
                    {completado
                      ? "Listo"
                      : activo
                      ? "En curso"
                      : bloqueado
                      ? "Bloqueado"
                      : "Pendiente"}
                  </p>
                </div>

                {/* Tooltip */}
                {hovered === paso.id && (
                  <div
                    className="
                      absolute left-1/2 -translate-x-1/2 top-full mt-2 w-60
                      rounded-2xl border border-[#eadacb] bg-white shadow-xl
                      p-4 text-xs text-[#7a5c49] leading-relaxed
                      animate-fade-in z-30
                    "
                  >
                    <p className="font-extrabold text-[#2b1b12] mb-1">
                      {paso.titulo}
                    </p>
                    <p>{paso.detalle}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

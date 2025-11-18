"use client";

import { useState } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { useRouter } from "next/navigation";

const PASOS_ADOPCION = [
  {
    id: 1,
    titulo: "Mascotas",
    desc: "Elige a tu compañero.",
    detalle:
      "Explora la lista completa de mascotas disponibles y selecciona una para iniciar tu proceso.",
    ruta: "/dashboards/usuario/mascotas",
  },
  {
    id: 2,
    titulo: "Cita",
    desc: "Agenda una visita.",
    detalle:
      "Programa una visita al CAAM para conocer personalmente a tu mascota.",
    ruta: "/dashboards/usuario/citas",
  },
  {
    id: 3,
    titulo: "Formulario",
    desc: "Llena tus datos.",
    detalle:
      "Completa el formulario para continuar con la evaluación del CAAM.",
    ruta: "/dashboards/usuario/citas",
  },
  {
    id: 4,
    titulo: "Evaluación",
    desc: "Estamos revisando.",
    detalle:
      "Revisaremos tus documentos, formulario y visita para determinar la aprobación.",
    ruta: null,
  },
  {
    id: 5,
    titulo: "Finalizar",
    desc: "Adopción aprobada.",
    detalle: "Si todo es aprobado, podrás completar oficialmente la adopción.",
    ruta: null,
  },
];

export default function StepperAdopcion({
  activeStep,
  solicitudId,
  blockedSteps,
  onStepClick,
}: {
  activeStep: number;
  solicitudId?: string | null;
  blockedSteps?: Record<number, boolean>;
  onStepClick?: (step: number) => void;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);

  const totalSteps = PASOS_ADOPCION.length;
  const progress =
    totalSteps <= 1 ? 0 : ((activeStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="relative mt-8">
      {/* Línea base */}
      <div className="absolute top-1/2 left-0 right-0 h-[4px] bg-[#eadacb] -translate-y-1/2 z-0 rounded-full" />

      {/* Línea de progreso */}
      <div
        className="
          absolute top-1/2 left-0 h-[4px] bg-[#2563eb] -translate-y-1/2 z-0 rounded-full
          transition-all duration-700 ease-out
        "
        style={{ width: `${progress}%` }}
      />

      {/* Pasos */}
      <div className="relative grid gap-5 md:grid-cols-5 z-10">
        {PASOS_ADOPCION.map((paso) => {
          const completado = paso.id < activeStep;
          const activo = paso.id === activeStep;

          const bloqueado =
            paso.id !== activeStep || blockedSteps?.[paso.id] === true;

          const handleClick = () => {
            if (bloqueado) return;

            if (onStepClick) {
              onStepClick(paso.id);
              return;
            }

            if (!paso.ruta) return;

            if (paso.ruta === "formulario" && solicitudId) {
              router.push(`/dashboards/usuario/form-adopcion/${solicitudId}`);
              return;
            }

            if (paso.ruta && paso.ruta !== "formulario") {
              router.push(paso.ruta);
            }
          };

          return (
            <div
              key={paso.id}
              onMouseEnter={() => setHovered(paso.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={handleClick}
              className={`
                relative rounded-2xl border p-4 shadow-sm text-center 
                transition-all duration-300
                ${
                  completado
                    ? "border-[#2563eb] bg-[#e0edff] text-[#1d3a8a]"
                    : activo
                    ? "border-[#BC5F36] bg-[#fff4e7] text-[#2b1b12] scale-[1.02]"
                    : bloqueado
                    ? "border-[#e5d5c5] bg-[#f9f3ec] text-[#b5a090] opacity-80"
                    : "border-[#eadacb] bg-white text-[#7a5c49]"
                }
                ${
                  bloqueado
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:shadow-md hover:-translate-y-[1px]"
                }
              `}
            >
              <div className="flex justify-center mb-2">
                <span
                  className={`
                    grid h-9 w-9 place-items-center rounded-full border text-sm font-bold
                    ${
                      completado
                        ? "border-[#2563eb] bg-[#2563eb] text-white"
                        : activo
                        ? "border-[#BC5F36] bg-white text-[#BC5F36]"
                        : bloqueado
                        ? "border-[#e5d5c5] bg-[#f5ebe1] text-[#b5a090]"
                        : "border-[#eadacb] bg-white text-[#7a5c49]"
                    }
                  `}
                >
                  {completado ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : bloqueado && paso.id > activeStep ? (
                    "🔒"
                  ) : (
                    paso.id
                  )}
                </span>
              </div>

              <p className="text-sm font-extrabold">{paso.titulo}</p>
              <p className="mt-1 text-xs leading-relaxed">{paso.desc}</p>

              <p
                className={`
                  mt-2 text-[11px] font-medium flex justify-center items-center gap-1
                  ${
                    completado
                      ? "text-[#2563eb]"
                      : activo
                      ? "text-[#BC5F36]"
                      : bloqueado
                      ? "text-[#c49b80]"
                      : "text-[#a88b77]"
                  }
                `}
              >
                <Info className="h-3 w-3" />
                {completado
                  ? "Paso completado"
                  : activo
                  ? "Paso actual"
                  : bloqueado
                  ? "Aún no disponible"
                  : "Pendiente"}
              </p>

              {hovered === paso.id && (
                <div
                  className="
                    absolute left-1/2 -translate-x-1/2 top-full mt-3 w-56
                    rounded-xl border border-[#eadacb] bg-white shadow-xl 
                    p-4 text-xs text-[#7a5c49] leading-relaxed
                    animate-fade-in z-20
                  "
                >
                  <p className="font-extrabold text-[#2b1b12] mb-1">
                    {paso.titulo}
                  </p>
                  <p>{paso.detalle}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

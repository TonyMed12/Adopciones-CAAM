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
    ruta: "formulario",
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
}: {
  activeStep: number;
  solicitudId?: string | null;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative mt-8">
      {/* 📌 Línea gris del timeline */}
      <div className="absolute top-1/2 left-0 right-0 h-[4px] bg-[#eadacb] -translate-y-1/2 z-0 rounded-full" />

      {/* 📌 Línea azul animada del progreso */}
      <div
        className="
          absolute top-1/2 left-0 h-[4px] bg-blue-600 -translate-y-1/2 z-0 rounded-full
          transition-all duration-700 ease-out
        "
        style={{
          width: `${((activeStep - 1) / (PASOS_ADOPCION.length - 1)) * 100}%`,
        }}
      />

      {/* 📌 Grid de pasos */}
      <div className="relative grid gap-5 md:grid-cols-5 z-10">
        {PASOS_ADOPCION.map((paso) => {
          const completado = paso.id < activeStep;
          const activo = paso.id === activeStep;
          const futuro = paso.id > activeStep;

          const clickHabilitado = activo && paso.ruta !== null;

          return (
            <div
              key={paso.id}
              onMouseEnter={() => setHovered(paso.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                if (!clickHabilitado) return;

                if (paso.ruta === "formulario" && solicitudId) {
                  router.push(
                    `/dashboards/usuario/form-adopcion/${solicitudId}`
                  );
                  return;
                }

                if (paso.ruta) router.push(paso.ruta);
              }}
              className={`
                relative rounded-2xl border p-4 shadow-sm text-center transition-all duration-300
                ${
                  completado
                    ? "border-blue-600 bg-blue-100 text-blue-900"
                    : activo
                    ? "border-[#BC5F36] bg-[#fff4e7] text-[#2b1b12] scale-[1.02]"
                    : "border-[#eadacb] bg-white text-[#7a5c49]"
                }
                ${
                  clickHabilitado
                    ? "cursor-pointer hover:shadow-md"
                    : "cursor-default"
                }
              `}
            >
              {/* ICONO / NÚMERO */}
              <div className="flex justify-center mb-2">
                <span
                  className={`
                    grid h-9 w-9 place-items-center rounded-full border text-sm font-bold
                    ${
                      completado
                        ? "border-blue-600 bg-blue-200 text-blue-800"
                        : activo
                        ? "border-[#BC5F36] text-[#BC5F36]"
                        : "border-[#eadacb] text-[#7a5c49]"
                    }
                  `}
                >
                  {completado ? (
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  ) : (
                    paso.id
                  )}
                </span>
              </div>

              {/* TÍTULO */}
              <p className="text-sm font-extrabold">{paso.titulo}</p>

              {/* DESCRIPCIÓN */}
              <p className="mt-1 text-xs leading-relaxed">{paso.desc}</p>

              {/* ESTADO DEL PASO */}
              <p
                className={`
                  mt-2 text-[11px] font-medium flex justify-center items-center gap-1
                  ${
                    completado
                      ? "text-blue-700"
                      : activo
                      ? "text-[#BC5F36]"
                      : "text-[#a88b77]"
                  }
                `}
              >
                <Info className="h-3 w-3" />
                {completado
                  ? "Paso completado"
                  : activo
                  ? "Paso actual"
                  : "Pendiente"}
              </p>

              {/* TOOLTIP */}
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
                  {paso.detalle}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

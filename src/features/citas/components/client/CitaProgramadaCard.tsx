"use client";

import { CalendarCheck, Clock, MapPin, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { CitaProgramada } from "@/features/citas/types/cita-programada";

type CitaProgramadaCardProps = {
  cita: CitaProgramada;
  onCancelar: (citaId: string) => void;
  onAbrirModal: () => void;
};

export default function CitaProgramadaCard({
  cita,
  onCancelar,
  onAbrirModal,
}: CitaProgramadaCardProps) {
  const fechaTexto = (() => {
    const [y, m, d] = cita.fecha_cita.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  })();

  return (
    <article className="overflow-hidden rounded-3xl border border-[#eadacb] bg-white shadow-sm">
      {/* Hero superior */}
      <div className="relative bg-gradient-to-br from-[#FFF7EF] via-[#FFEAD2] to-[#FFDCC0] p-5 sm:p-7">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-7">
          <img
            src={cita.mascota?.imagen_url || "/placeholder.jpg"}
            alt={cita.mascota?.nombre || "Mascota"}
            className="h-40 w-40 sm:h-44 sm:w-44 rounded-2xl object-cover ring-4 ring-white shadow-md shrink-0"
          />

          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <Badge tone="success" size="md" dot>
                Cita programada
              </Badge>
              <Badge tone="brand" size="md" icon={<CalendarCheck size={12} />}>
                Confirmada
              </Badge>
            </div>

            <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#2b1b12] tracking-tight">
              Te esperamos en el CAAM
            </h3>
            <p className="mt-2 text-sm sm:text-base text-[#6c5241] leading-relaxed">
              Vas a conocer a{" "}
              <span className="font-bold text-[#BC5F36] capitalize">
                {cita.mascota?.nombre}
              </span>
              . Recuerda llegar a tiempo y traer una identificación.
            </p>
          </div>
        </div>
      </div>

      {/* Detalles */}
      <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 p-5 sm:p-7 border-t border-[#eadacb]">
        <DetailCard
          icon={<CalendarCheck size={18} />}
          label="Fecha"
          value={fechaTexto}
        />
        <DetailCard
          icon={<Clock size={18} />}
          label="Hora"
          value={cita.hora_cita.slice(0, 5)}
        />
        <DetailCard
          icon={<MapPin size={18} />}
          label="Ubicación"
          value="Centro de Atención Animal, Morelia"
        />
      </div>

      {/* Reminder + Acciones */}
      <div className="border-t border-[#eadacb] bg-[#FFF7EF]/40 p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="grid place-items-center h-9 w-9 rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-200 shrink-0">
            <AlertCircle size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#2b1b12]">
              Importante para tu cita
            </p>
            <p className="text-sm text-[#7a5c49] leading-relaxed mt-0.5">
              Lleva identificación oficial. La cita tiene tolerancia de 15 minutos.
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => {
            onCancelar(cita.id);
            onAbrirModal();
          }}
          className="!text-rose-600 hover:!bg-rose-50 gap-1.5"
        >
          <X size={16} />
          Cancelar cita
        </Button>
      </div>
    </article>
  );
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eadacb] bg-white p-4 shadow-sm">
      <div className="grid place-items-center h-9 w-9 rounded-xl bg-[#FFF1E6] text-[#BC5F36] mb-2 ring-1 ring-[#f3d6bb]">
        {icon}
      </div>
      <p className="text-[10px] uppercase font-bold tracking-wider text-[#a78d7b]">
        {label}
      </p>
      <p className="text-sm font-bold text-[#2b1b12] capitalize leading-tight mt-0.5">
        {value}
      </p>
    </div>
  );
}

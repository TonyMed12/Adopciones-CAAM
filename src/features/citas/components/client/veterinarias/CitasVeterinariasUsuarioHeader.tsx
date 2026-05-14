"use client";

import { ClipboardList, PlusCircle, Lock, CalendarHeart, Stethoscope } from "lucide-react";
import PageHead from "@/components/layout/PageHead";

export function CitasVeterinariasUsuarioHeader({
  modo,
  setModo,
  bloqueado,
  setMensaje,
}: {
  modo: "lista" | "agendar";
  setModo: (m: "lista" | "agendar") => void;
  bloqueado: boolean;
  setMensaje: (msg: string | null) => void;
}) {
  const handleAgendar = () => {
    if (bloqueado) {
      setMensaje(
        "Ya tienes una cita pendiente. Espera la confirmación del CAAM antes de agendar otra."
      );
      return;
    }
    setMensaje(null);
    setModo("agendar");
  };

  return (
    <>
      <PageHead
        title="Citas veterinarias"
        eyebrow={
          <>
            <Stethoscope size={12} />
            <span>Atención médica</span>
          </>
        }
        icon={<CalendarHeart size={20} />}
        subtitle="Agenda nuevas citas y revisa el estado de las existentes."
      />

      {/* Segmented control */}
      <div className="flex justify-center sm:justify-start mb-6">
        <div className="inline-flex items-center gap-1 rounded-2xl bg-[#FFF6EC] p-1 ring-1 ring-[#f3d6bb]/60">
          <button
            type="button"
            onClick={() => setModo("lista")}
            data-active={modo === "lista"}
            className="
              inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all
              text-[#a88b77] hover:text-[#8B4513]
              data-[active=true]:bg-white data-[active=true]:text-[#8B4513]
              data-[active=true]:shadow-sm data-[active=true]:ring-1 data-[active=true]:ring-[#f3d6bb]
            "
          >
            <ClipboardList className="h-4 w-4" />
            <span>Mis citas</span>
          </button>

          <button
            type="button"
            onClick={handleAgendar}
            data-active={modo === "agendar"}
            className="
              relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all
              text-[#a88b77] hover:text-[#8B4513]
              data-[active=true]:bg-[#8B4513] data-[active=true]:text-white
              data-[active=true]:shadow-sm
            "
            title={bloqueado ? "Tienes una cita pendiente" : ""}
          >
            {bloqueado ? (
              <Lock className="h-4 w-4" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
            <span>Agendar cita</span>
          </button>
        </div>
      </div>
    </>
  );
}

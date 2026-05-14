"use client";

import { useRouter } from "next/navigation";
import {
  PawPrint,
  Calendar,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Clock,
} from "lucide-react";
import MascotaSeleccionadaCard from "./MascotaSeleccionadaCard";
import type { EstadoDocumentos } from "@/features/adopciones/types/documentos";
import type { CitaAdopcion } from "@/features/adopciones/types/citaAdopcion";
import type { SolicitudAdopcionUI } from "@/features/adopciones/types/solicitud";

interface SolicitudPendienteSectionProps {
  solicitudActiva: SolicitudAdopcionUI;
  citaActiva: CitaAdopcion | null;
  estado: EstadoDocumentos;
  onCancelar: () => void;
}

export default function SolicitudPendienteSection({
  solicitudActiva,
  citaActiva,
  estado,
  onCancelar,
}: SolicitudPendienteSectionProps) {
  const router = useRouter();

  const irACitas = () => router.push("/dashboards/usuario/citas");
  const puedeAgendar = estado === "aprobado" && !citaActiva;

  return (
    <div className="rounded-3xl border border-[#ffedd5] bg-gradient-to-br from-[#fffaf4] via-white to-[#FFF7EF] p-4 sm:p-6 lg:p-7 shadow-sm">
      {/* ============ Header ============ */}
      <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-[#BC5F36] text-white shadow-md shrink-0">
          <PawPrint className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-[#2b1b12] tracking-tight">
              Solicitud activa
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-amber-200">
              <Clock className="h-3 w-3" />
              Pendiente
            </span>
          </div>
          <p className="mt-1 text-sm text-[#6c5241] leading-relaxed">
            Ya tienes una solicitud iniciada. Continúa con el proceso y agenda
            tu cita para conocer a tu mascota seleccionada.
          </p>
        </div>
      </div>

      {/* ============ CTA Agendar visita (desktop primary) ============ */}
      {puedeAgendar && (
        <button
          onClick={irACitas}
          className="
            hidden lg:flex w-full items-center justify-center gap-2
            bg-[#BC5F36] text-white py-3.5 rounded-2xl
            text-base font-bold tracking-tight
            shadow-lg shadow-[#bc5f36]/30
            hover:bg-[#a64f2b] hover:shadow-xl hover:shadow-[#bc5f36]/40
            hover:-translate-y-[2px]
            active:scale-[0.99]
            transition-all duration-200
            mb-6
          "
        >
          <Calendar className="h-5 w-5" />
          Agendar visita
          <ArrowRight className="h-4 w-4" />
        </button>
      )}

      {/* ============ Grid principal ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-5 lg:gap-7 items-start">
        {/* === Mascota seleccionada === */}
        <div className="rounded-2xl bg-white border border-[#eadacb] p-4 sm:p-5 shadow-sm">
          <MascotaSeleccionadaCard
            mascota={solicitudActiva.mascota}
            onCancelar={onCancelar}
          />
        </div>

        {/* === Detalles del proceso === */}
        <div className="space-y-4 sm:space-y-5">
          {/* Qué sigue */}
          <div className="rounded-2xl bg-white border border-[#eadacb] p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb]">
                <Calendar className="h-4 w-4" />
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-[#2b1b12] tracking-tight">
                ¿Qué sigue ahora?
              </h4>
            </div>

            <ul className="text-xs sm:text-sm text-[#6c5241] space-y-2 leading-relaxed">
              {[
                "Agenda tu visita para convivir con tu mascota.",
                "El CAAM evaluará cómo interactúan.",
                "Si es aprobada, llenarás el formulario final.",
                "Luego un administrador revisará tu información.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-[#FFF1E6] text-[#BC5F36] text-[9px] font-extrabold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Estado del proceso */}
          <div className="rounded-2xl bg-white border border-[#eadacb] p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#eef4ff] text-[#1d4ed8] ring-1 ring-[#c7ddff]">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-[#2b1b12] tracking-tight">
                Estado de tu proceso
              </h4>
            </div>

            <ul className="grid gap-2 text-xs sm:text-sm">
              <ProcesoItem done label="Mascota seleccionada" />
              <ProcesoItem current label="Pendiente agendar visita" />
              <ProcesoItem label="Formulario (después de la visita)" />
              <ProcesoItem label="Aprobación final" />
            </ul>
          </div>

          {/* Consejos */}
          <div className="relative overflow-hidden rounded-2xl border border-[#ebd8c7] bg-gradient-to-br from-[#fff4e6] via-[#ffe8cf] to-[#ffd8b0] p-4 sm:p-5 shadow-md">
            <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-[#F59E0B]/20 blur-2xl" />

            <div className="relative flex items-center gap-2.5 mb-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#F59E0B] shadow-sm ring-1 ring-amber-200">
                <Lightbulb className="h-4 w-4" />
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-[#2b1b12] tracking-tight">
                Consejos para tu visita
              </h4>
            </div>

            <ul className="relative text-xs sm:text-sm text-[#6c4824] space-y-2 leading-relaxed">
              {[
                "Llega 10–15 minutos antes.",
                "Puedes traer fotos del hogar.",
                "Mantén vacunas al día si tienes mascotas.",
                "Sé tú mismo, la convivencia es lo más importante.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-[#BC5F36] shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Botón móvil */}
          {puedeAgendar && (
            <button
              onClick={irACitas}
              className="
                lg:hidden flex w-full items-center justify-center gap-2
                bg-[#BC5F36] text-white py-3 rounded-2xl
                text-sm font-bold
                shadow-lg shadow-[#bc5f36]/30
                hover:bg-[#a64f2b]
                active:scale-[0.99]
                transition-all duration-200
              "
            >
              <Calendar className="h-4 w-4" />
              Agendar visita
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============ Sub-component ============ */
function ProcesoItem({
  done,
  current,
  label,
}: {
  done?: boolean;
  current?: boolean;
  label: string;
}) {
  return (
    <li
      className={`
        flex items-center gap-2 rounded-xl px-3 py-2 ring-1 transition
        ${
          done
            ? "bg-emerald-50/60 text-emerald-800 ring-emerald-200"
            : current
            ? "bg-[#FFF1E6] text-[#BC5F36] ring-[#f3d6bb] font-semibold"
            : "bg-[#fffaf4] text-[#a88b77] ring-[#eadacb]"
        }
      `}
    >
      {done ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : current ? (
        <ArrowRight className="h-4 w-4 shrink-0" />
      ) : (
        <Clock className="h-4 w-4 shrink-0 opacity-50" />
      )}
      <span>{label}</span>
    </li>
  );
}

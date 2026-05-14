"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import {
  PawPrint,
  Calendar,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Check,
  MapPin,
} from "lucide-react";

type Mascota = {
  mascota_id: string;
  mascota_nombre: string;
  imagen_url: string | null;
  estado_mascota: string;
};

type CalendarioCell = {
  d: number;
  fechaStr: string;
  fecha: Date;
  deshabilitado: boolean;
};

type Props = {
  mascotas: Mascota[];
  mascotaSeleccionada: Mascota | null;
  setMascotaSeleccionada: (m: Mascota | null) => void;

  fechaSeleccionada: string | null;
  setFechaSeleccionada: (f: string | null) => void;

  horaSeleccionada: string | null;
  setHoraSeleccionada: (h: string | null) => void;

  motivo: string;
  setMotivo: (m: string) => void;

  horasDisponibles: string[];
  celdas: (CalendarioCell | null)[];
  cambiarMes: (dir: "prev" | "next") => void;

  hoy: Date;
  mesActual: number;
  anioActual: number;
  nombreMes: string;

  onConfirmar: () => void;
};

function StepIndicator({
  step,
  total,
  active,
  done,
  label,
}: {
  step: number;
  total: number;
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className={`
          grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full text-xs font-bold shrink-0
          transition-all duration-300 ring-1
          ${
            done
              ? "bg-emerald-500 text-white ring-emerald-400"
              : active
              ? "bg-[#8B4513] text-white ring-[#A0522D] shadow-sm"
              : "bg-white text-slate-400 ring-slate-200"
          }
        `}
      >
        {done ? <Check className="h-4 w-4" /> : step}
      </div>
      <span
        className={`
          hidden sm:inline text-xs font-semibold whitespace-nowrap transition
          ${active || done ? "text-[#8B4513]" : "text-slate-400"}
        `}
      >
        {label}
      </span>
      {step < total && (
        <span
          aria-hidden
          className={`
            hidden sm:inline h-px w-6 lg:w-10
            ${done ? "bg-emerald-300" : "bg-slate-200"}
          `}
        />
      )}
    </div>
  );
}

export function CitasVeterinariasUsuarioAgendar({
  mascotas,
  mascotaSeleccionada,
  setMascotaSeleccionada,
  fechaSeleccionada,
  setFechaSeleccionada,
  horaSeleccionada,
  setHoraSeleccionada,
  motivo,
  setMotivo,
  horasDisponibles,
  celdas,
  cambiarMes,
  hoy,
  mesActual,
  anioActual,
  nombreMes,
  onConfirmar,
}: Props) {
  const tieneMascota = !!mascotaSeleccionada;
  const tieneFecha = !!fechaSeleccionada;
  const tieneHora = !!horaSeleccionada;
  const tieneMotivo = motivo.trim().length > 0;

  const fechaLegible = fechaSeleccionada
    ? new Date(fechaSeleccionada + "T00:00:00").toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <motion.div
      key="agendar"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* ============ STEP INDICATOR ============ */}
      <div className="overflow-x-auto custom-scroll -mx-1 px-1">
        <div className="inline-flex items-center gap-2 sm:gap-3 min-w-max rounded-2xl bg-[#FFF6EC] ring-1 ring-[#f3d6bb]/60 p-3 sm:p-4">
          <StepIndicator
            step={1}
            total={4}
            active={!tieneMascota}
            done={tieneMascota}
            label="Mascota"
          />
          <StepIndicator
            step={2}
            total={4}
            active={tieneMascota && !tieneFecha}
            done={tieneFecha}
            label="Fecha y hora"
          />
          <StepIndicator
            step={3}
            total={4}
            active={tieneHora && !tieneMotivo}
            done={tieneMotivo}
            label="Motivo"
          />
          <StepIndicator
            step={4}
            total={4}
            active={tieneMotivo}
            done={false}
            label="Confirmar"
          />
        </div>
      </div>

      {/* ============ 1. MASCOTAS ============ */}
      <section>
        <header className="mb-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb]">
              <PawPrint className="h-4 w-4" />
            </span>
            <h3 className="text-base font-extrabold text-[#8B4513]">
              ¿Para qué mascota es la cita?
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#a88b77] mt-1 ml-9">
            Selecciona la mascota adoptada que necesita la cita veterinaria.
          </p>
        </header>

        {mascotas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e9d8c5] bg-[#fffaf4] py-10 px-6 text-center">
            <PawPrint className="mx-auto h-8 w-8 text-[#BC5F36] mb-2" />
            <p className="text-sm font-extrabold text-[#8B4513]">
              No tienes mascotas adoptadas
            </p>
            <p className="text-xs text-[#7a5c49] mt-1">
              Necesitas tener al menos una adopción aprobada para agendar citas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {mascotas.map((m) => {
              const seleccionada =
                mascotaSeleccionada?.mascota_id === m.mascota_id;
              return (
                <button
                  type="button"
                  key={m.mascota_id}
                  onClick={() => {
                    setMascotaSeleccionada(m);
                    setFechaSeleccionada(null);
                    setHoraSeleccionada(null);
                    setMotivo("");
                  }}
                  className={`
                    group relative text-left
                    flex items-center gap-4 rounded-2xl border bg-white p-3 sm:p-4
                    transition-all duration-200
                    ${
                      seleccionada
                        ? "border-[#8B4513] ring-2 ring-[#8B4513]/15 shadow-[0_12px_24px_-12px_rgba(43,27,18,0.18)]"
                        : "border-[#eadacb] hover:border-[#f3d6bb] hover:bg-[#fffaf4] hover:shadow-md"
                    }
                  `}
                >
                  <div className="relative shrink-0">
                    <img
                      src={m.imagen_url || "/placeholder.jpg"}
                      alt={m.mascota_nombre}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover ring-1 ring-[#eadacb]"
                    />
                    {seleccionada && (
                      <span className="absolute -top-1.5 -right-1.5 grid h-7 w-7 place-items-center rounded-full bg-[#8B4513] text-white shadow-md ring-2 ring-white">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-lg font-extrabold text-[#8B4513] capitalize truncate">
                      {m.mascota_nombre}
                    </h4>
                    <p className="text-xs text-[#7a5c49] capitalize mt-0.5">
                      Estado:{" "}
                      <span className="font-semibold">{m.estado_mascota}</span>
                    </p>
                    <p className="text-[11px] text-[#a88b77] mt-1.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      CAAM - Morelia
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ============ 2. FECHA / HORA / MOTIVO ============ */}
      {tieneMascota && (
        <section className="space-y-6 pt-2">
          {/* === FECHA === */}
          <div className="rounded-2xl bg-white border border-[#eadacb] p-4 sm:p-5 shadow-sm">
            <header className="mb-4">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb]">
                  <Calendar className="h-4 w-4" />
                </span>
                <h3 className="text-base font-extrabold text-[#8B4513]">
                  Selecciona la fecha
                </h3>
              </div>
              <p className="text-xs text-[#a88b77] mt-1 ml-9">
                No disponible fines de semana · Hasta 30 días en adelante.
              </p>
            </header>

            {/* Navegación */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => cambiarMes("prev")}
                disabled={
                  new Date(anioActual, mesActual, 1) <=
                  new Date(hoy.getFullYear(), hoy.getMonth(), 1)
                }
                className="
                  grid h-9 w-9 place-items-center rounded-xl text-[#8B4513]
                  hover:bg-[#FFF1E6] transition
                  disabled:opacity-30 disabled:cursor-not-allowed
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BC5F36]/40
                "
                aria-label="Mes anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <span className="text-base font-extrabold text-[#8B4513] capitalize">
                {nombreMes}
              </span>

              <button
                type="button"
                onClick={() => cambiarMes("next")}
                className="
                  grid h-9 w-9 place-items-center rounded-xl text-[#8B4513]
                  hover:bg-[#FFF1E6] transition
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BC5F36]/40
                "
                aria-label="Mes siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Cabecera días */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center mb-2">
              {["D", "L", "M", "M", "J", "V", "S"].map((d, idx) => (
                <span
                  key={idx}
                  className="text-[10px] sm:text-xs font-bold text-[#a88b77] uppercase tracking-wider py-1"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Días */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {celdas.map((cell, idx) =>
                cell === null ? (
                  <div key={`pad-${idx}`} aria-hidden />
                ) : (
                  <button
                    type="button"
                    key={cell.fechaStr}
                    disabled={cell.deshabilitado}
                    onClick={() => {
                      if (!cell.deshabilitado) {
                        setFechaSeleccionada(cell.fechaStr);
                        setHoraSeleccionada(null);
                        setMotivo("");
                      }
                    }}
                    className={`
                      aspect-square grid place-items-center rounded-xl text-sm font-semibold
                      transition-all duration-150
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BC5F36]/40
                      ${
                        cell.deshabilitado
                          ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                          : fechaSeleccionada === cell.fechaStr
                          ? "bg-[#8B4513] text-white shadow-md scale-105 ring-2 ring-[#A0522D]"
                          : "text-[#8B4513] hover:bg-[#FFF1E6] hover:scale-105"
                      }
                    `}
                  >
                    {cell.d}
                  </button>
                )
              )}
            </div>
          </div>

          {/* === HORARIOS === */}
          {tieneFecha && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl bg-white border border-[#eadacb] p-4 sm:p-5 shadow-sm"
            >
              <header className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb]">
                    <Clock className="h-4 w-4" />
                  </span>
                  <h3 className="text-base font-extrabold text-[#8B4513]">
                    Selecciona un horario
                  </h3>
                </div>
                {fechaLegible && (
                  <p className="text-xs text-[#a88b77] mt-1 ml-9 capitalize">
                    {fechaLegible}
                  </p>
                )}
              </header>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-2.5">
                {horasDisponibles.map((hora) => {
                  const activo = horaSeleccionada === hora;
                  return (
                    <button
                      type="button"
                      key={hora}
                      onClick={() => setHoraSeleccionada(hora)}
                      className={`
                        py-2.5 rounded-xl border text-sm font-bold tabular-nums
                        transition-all duration-150
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BC5F36]/40
                        ${
                          activo
                            ? "bg-[#8B4513] text-white border-[#A0522D] shadow-md scale-[1.02]"
                            : "bg-white border-[#eadacb] text-[#8B4513] hover:bg-[#FFF1E6] hover:border-[#f3d6bb]"
                        }
                      `}
                    >
                      {hora}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* === MOTIVO === */}
          {tieneHora && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl bg-white border border-[#eadacb] p-4 sm:p-5 shadow-sm"
            >
              <header className="mb-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb]">
                    <FileText className="h-4 w-4" />
                  </span>
                  <h3 className="text-base font-extrabold text-[#8B4513]">
                    ¿Cuál es el motivo?
                  </h3>
                </div>
                <p className="text-xs text-[#a88b77] mt-1 ml-9">
                  Describe brevemente por qué necesitas esta cita.
                </p>
              </header>

              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej: revisión general, vacuna anual, problema con la piel..."
                maxLength={500}
                className="
                  w-full rounded-xl border border-[#eadacb] bg-[#fffaf4] p-3
                  h-28 text-sm resize-none leading-relaxed text-slate-700
                  focus:ring-2 focus:ring-[#BC5F36]/30 focus:border-[#BC5F36]
                  focus:outline-none transition
                  placeholder:text-[#c2a896]
                "
              />
              <div className="flex justify-end mt-1">
                <span className="text-[11px] text-[#a88b77] tabular-nums">
                  {motivo.length}/500
                </span>
              </div>
            </motion.div>
          )}

          {/* === RESUMEN + CONFIRMAR === */}
          {tieneMotivo && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="
                relative overflow-hidden rounded-3xl
                bg-gradient-to-br from-[#FFF7EF] via-white to-[#FFEAD2]
                border border-[#eadacb] p-5 sm:p-6 shadow-md
              "
            >
              <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#FDE68A]/40 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#BC5F36]/10 blur-3xl" />

              <div className="relative">
                <header className="mb-4">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#BC5F36] ring-1 ring-[#f3d6bb] mb-2">
                    <CheckCircle2 className="h-3 w-3" />
                    Resumen
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#8B4513]">
                    ¿Todo se ve bien?
                  </h3>
                  <p className="text-sm text-[#7a5c49]">
                    Revisa los detalles antes de confirmar.
                  </p>
                </header>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <ResumenChip
                    Icon={PawPrint}
                    label="Mascota"
                    value={mascotaSeleccionada?.mascota_nombre ?? "—"}
                  />
                  <ResumenChip
                    Icon={Calendar}
                    label="Fecha"
                    value={fechaLegible ?? "—"}
                  />
                  <ResumenChip
                    Icon={Clock}
                    label="Hora"
                    value={horaSeleccionada ?? "—"}
                  />
                  <ResumenChip
                    Icon={MapPin}
                    label="Lugar"
                    value="CAAM Morelia"
                  />
                </dl>

                <Button
                  variant="primary"
                  size="lg"
                  full
                  onClick={onConfirmar}
                  className="!rounded-2xl"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Confirmar cita
                </Button>
              </div>
            </motion.div>
          )}
        </section>
      )}
    </motion.div>
  );
}

function ResumenChip({
  Icon,
  label,
  value,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-white/70 ring-1 ring-[#eadacb]/50 p-3 backdrop-blur-sm">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb] shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#a88b77]">
          {label}
        </p>
        <p className="text-sm font-extrabold text-[#8B4513] capitalize truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

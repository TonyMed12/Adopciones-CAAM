"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

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
  return (
    <motion.div
      key="agendar"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="mt-8 space-y-8"
    >
      {/* === MASCOTAS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mascotas.map((m) => (
          <div
            key={m.mascota_id}
            onClick={() => {
              setMascotaSeleccionada(m);
              setFechaSeleccionada(null);
              setHoraSeleccionada(null);
              setMotivo("");
            }}
            className={`flex items-center gap-4 border rounded-2xl p-4 cursor-pointer transition ${
              mascotaSeleccionada?.mascota_id === m.mascota_id
                ? "bg-[#FFF1E6] border-[#8B4513]"
                : "hover:bg-[#FFF8F3]"
            }`}
          >
            <img
              src={m.imagen_url || "/placeholder.jpg"}
              alt={m.mascota_nombre}
              className="w-24 h-24 rounded-xl object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-[#8B4513]">
                {m.mascota_nombre}
              </h2>
              <p className="text-sm text-gray-600">
                Estado: {m.estado_mascota}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                📍 CAAM - Centro de Atención Animal de Morelia
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* === CONTENIDO SI HAY MASCOTA === */}
      {mascotaSeleccionada && (
        <div className="border-t pt-6 space-y-6">
          {/* === Fecha === */}
          <div>
            <h3 className="font-medium text-[#8B4513] mb-3">
              Selecciona la fecha de tu cita
            </h3>

            {/* Navegación */}
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cambiarMes("prev")}
                disabled={
                  new Date(anioActual, mesActual, 1) <=
                  new Date(hoy.getFullYear(), hoy.getMonth(), 1)
                }
              >
                ◀️
              </Button>

              <span className="text-[#8B4513] font-semibold capitalize">
                {nombreMes}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => cambiarMes("next")}
              >
                ▶️
              </Button>
            </div>

            {/* Cabecera */}
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {["D", "L", "M", "M", "J", "V", "S"].map((d) => (
                <span
                  key={d}
                  className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Días */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {celdas.map((cell, idx) =>
                cell === null ? (
                  <div key={`pad-${idx}`} />
                ) : (
                  <button
                    key={cell.fechaStr}
                    disabled={cell.deshabilitado}
                    onClick={() => {
                      if (!cell.deshabilitado) {
                        setFechaSeleccionada(cell.fechaStr);
                        setHoraSeleccionada(null);
                        setMotivo("");
                      }
                    }}
                    className={`py-2 text-sm rounded-lg transition ${
                      cell.deshabilitado
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : fechaSeleccionada === cell.fechaStr
                        ? "bg-[#8B4513] text-white font-semibold"
                        : "hover:bg-[#FFF1E6] text-[#8B4513]"
                    }`}
                  >
                    {cell.d}
                  </button>
                )
              )}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              * No disponible fines de semana. Puedes agendar a partir de mañana.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              * Solo puedes agendar citas dentro de los próximos 30 días.
            </p>
          </div>

          {/* === Horarios === */}
          {fechaSeleccionada && (
            <div>
              <h3 className="font-medium text-[#8B4513] mb-2">
                Selecciona un horario
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {horasDisponibles.map((hora) => (
                  <button
                    key={hora}
                    onClick={() => setHoraSeleccionada(hora)}
                    className={`py-2 rounded-lg border text-sm transition ${
                      horaSeleccionada === hora
                        ? "bg-[#8B4513] text-white border-[#A0522D]"
                        : "hover:bg-[#FFF1E6]"
                    }`}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* === Motivo === */}
          {horaSeleccionada && (
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-1">
                Motivo de la cita
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Describe brevemente el motivo..."
                className="w-full border rounded-lg p-2 h-24 resize-none focus:ring-2 focus:ring-[#FDE68A] focus:outline-none transition"
              />
            </div>
          )}

          {/* === Confirmar === */}
          {motivo && (
            <div className="text-center">
              <Button variant="primary" size="lg" onClick={onConfirmar}>
                Confirmar cita
              </Button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

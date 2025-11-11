"use client";
import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    asistencia: "asistio" | "no_asistio_no_apto";
    interaccion: "buena_aprobada" | "no_apta" | null;
    nota?: string;
  }) => void;
  citaLabel: string;
  defaultAsistencia?: "asistio" | "no_asistio_no_apto" | null;
  defaultInteraccion?: "buena_aprobada" | "no_apta" | null;
  defaultNota?: string;
};

export default function CitaEvalModal({
  open,
  onClose,
  onConfirm,
  citaLabel,
  defaultAsistencia = null,
  defaultInteraccion = null,
  defaultNota = "",
}: Props) {
  const [asistencia, setAsistencia] = useState<"asistio" | "no_asistio_no_apto">("asistio");
  const [interaccion, setInteraccion] = useState<"buena_aprobada" | "no_apta" | null>("buena_aprobada");
  const [nota, setNota] = useState(defaultNota);

  useEffect(() => {
    if (defaultAsistencia) setAsistencia(defaultAsistencia);
    // permitir null como valor inicial válido
    if (defaultInteraccion !== undefined) setInteraccion(defaultInteraccion ?? null);
    setNota(defaultNota ?? "");
  }, [defaultAsistencia, defaultInteraccion, defaultNota]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#EADACB] bg-white p-5 shadow-lg">
        <h3 className="text-lg font-extrabold text-[#2B1B12] mb-1">Evaluar cita</h3>
        <p className="text-sm text-[#6b4f40] mb-4">{citaLabel}</p>

        <div className="space-y-4">
          {/* Asistencia */}
          <div>
            <p className="text-sm font-semibold text-[#2B1B12] mb-1">Asistencia</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="asistencia"
                  checked={asistencia === "asistio"}
                  onChange={() => setAsistencia("asistio")}
                />
                <span>✅ Asistió</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="asistencia"
                  checked={asistencia === "no_asistio_no_apto"}
                  onChange={() => setAsistencia("no_asistio_no_apto")}
                />
                <span>❌ No asistió / No apto</span>
              </label>
            </div>
          </div>

          {/* Interacción (solo si asistió) */}
          {asistencia === "asistio" && (
            <div>
              <p className="text-sm font-semibold text-[#2B1B12] mb-1">Interacción</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="interaccion"
                    checked={interaccion === "buena_aprobada"}
                    onChange={() => setInteraccion("buena_aprobada")}
                  />
                  <span>👍 Buena (aprobada)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="interaccion"
                    checked={interaccion === "no_apta"}
                    onChange={() => setInteraccion("no_apta")}
                  />
                  <span>👎 No apta</span>
                </label>
              </div>
            </div>
          )}

          {/* Nota */}
          <div>
            <p className="text-sm font-semibold text-[#2B1B12] mb-1">Nota (opcional)</p>
            <textarea
              className="w-full rounded-md border border-[#EADACB] px-3 py-2 text-sm"
              rows={3}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Observaciones…"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#EADACB] bg-white px-3 py-1.5 text-sm font-semibold text-[#2B1B12] hover:bg-[#FFF4E7] transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() =>
              onConfirm({
                asistencia,
                interaccion: asistencia === "asistio" ? interaccion : "no_apta",
                nota,
              })
            }
            className="rounded-lg bg-[#BC5F36] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-95 transition-all"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

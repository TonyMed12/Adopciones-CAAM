"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, ThumbsUp, ThumbsDown, XCircle, BadgeCheck, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    asistencia: "asistio" | "no_asistio_no_apto";
    interaccion: "buena_aprobada" | "no_apta" | null;
    nota: string | null;
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

  const [asistencia, setAsistencia] =
    useState<"asistio" | "no_asistio_no_apto">("asistio");
  const [interaccion, setInteraccion] =
    useState<"buena_aprobada" | "no_apta" | null>("buena_aprobada");
  const [nota, setNota] = useState(defaultNota);

  useEffect(() => {
    if (defaultAsistencia) setAsistencia(defaultAsistencia);
    if (defaultInteraccion !== undefined) setInteraccion(defaultInteraccion ?? null);
    setNota(defaultNota ?? "");
  }, [defaultAsistencia, defaultInteraccion, defaultNota]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">

      {/* CONTENEDOR */}
      <div className="w-full max-w-lg rounded-2xl bg-white border border-[#EADACB] shadow-2xl overflow-hidden animate-slideUp">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EADACB] bg-[#FFF8F2]">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-[#BC5F36]" />
            <h3 className="text-lg font-extrabold text-[#2B1B12]">Evaluar cita</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5 text-[#6b4f40]" />
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="px-6 py-5 space-y-6">

          {/* INFO */}
          <div className="bg-[#FFF4E7] border border-[#EADACB] rounded-xl px-4 py-3">
            <p className="text-sm leading-snug">
              <span className="font-semibold text-[#2B1B12]">{citaLabel}</span>
            </p>
            <p className="text-xs text-[#6b4f40] mt-1">Ingresa evaluación de la cita.</p>
          </div>

          {/* ASISTENCIA */}
          <div>
            <label className="text-xs font-semibold text-[#2B1B12]">
              Asistencia
            </label>

            <div className="grid gap-2 mt-2">

              {/* Asistió */}
              <label
                className={`
                    flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition
                    ${asistencia === "asistio"
                    ? "border-green-500 bg-green-50"
                    : "border-[#EADACB] hover:bg-[#FFF8F1]"
                  }
                  `}
              >
                <input
                  type="radio"
                  name="asistencia"
                  className="accent-green-600"
                  checked={asistencia === "asistio"}
                  onChange={() => setAsistencia("asistio")}
                />
                <CheckCircle2 className="text-green-600 w-5 h-5" />
                <span className="text-sm font-medium text-[#2B1B12]">
                  Asistió
                </span>
              </label>

              {/* No asistió */}
              <label
                className={`
                    flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition
                    ${asistencia === "no_asistio_no_apto"
                    ? "border-red-500 bg-red-50"
                    : "border-[#EADACB] hover:bg-[#FFF8F1]"
                  }
                  `}
              >
                <input
                  type="radio"
                  name="asistencia"
                  className="accent-red-600"
                  checked={asistencia === "no_asistio_no_apto"}
                  onChange={() => {
                    setAsistencia("no_asistio_no_apto");
                    setInteraccion(null);
                  }}
                />
                <XCircle className="text-red-600 w-5 h-5" />
                <span className="text-sm font-medium text-[#2B1B12]">
                  No asistió / No apto
                </span>
              </label>
            </div>
          </div>

          {/* INTERACCIÓN */}
          {asistencia === "asistio" && (
            <div>
              <label className="text-xs font-semibold text-[#2B1B12]">
                Interacción
              </label>

              <div className="grid gap-2 mt-2">

                {/* Buena */}
                <label
                  className={`
                      flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition
                      ${interaccion === "buena_aprobada"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-[#EADACB] hover:bg-[#FFF8F1]"
                    }
                    `}
                >
                  <input
                    type="radio"
                    name="interaccion"
                    className="accent-yellow-500"
                    checked={interaccion === "buena_aprobada"}
                    onChange={() => setInteraccion("buena_aprobada")}
                  />

                  <ThumbsUp className="text-yellow-600 w-5 h-5" />
                  <span className="text-sm font-medium text-[#2B1B12]">
                    Buena (aprobada)
                  </span>
                </label>

                {/* No apta */}
                <label
                  className={`
                      flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition
                      ${interaccion === "no_apta"
                      ? "border-gray-500 bg-gray-100"
                      : "border-[#EADACB] hover:bg-[#FFF8F1]"
                    }
                    `}
                >
                  <input
                    type="radio"
                    name="interaccion"
                    className="accent-gray-500"
                    checked={interaccion === "no_apta"}
                    onChange={() => setInteraccion("no_apta")}
                  />

                  <ThumbsDown className="text-gray-600 w-5 h-5" />
                  <span className="text-sm font-medium text-[#2B1B12]">
                    No apta
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* NOTA */}
          <div>
            <label className="text-xs font-semibold text-[#2B1B12]">
              Nota (opcional)
            </label>

            <textarea
              rows={4}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Observaciones…"
              className="mt-2 w-full rounded-xl border border-[#EADACB] bg-[#FFFAF5] px-3 py-2 text-sm 
              focus:ring-2 focus:ring-[#BC5F36] outline-none resize-none"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-[#EADACB] bg-[#FFFDF9] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm text-[#2B1B12] hover:bg-gray-100 transition"
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
            className="px-4 py-2 rounded-lg bg-[#BC5F36] text-white text-sm font-semibold hover:bg-[#a44f2e] transition"
          >
            Guardar evaluación
          </button>
        </div>
      </div>
    </div>
  );
}

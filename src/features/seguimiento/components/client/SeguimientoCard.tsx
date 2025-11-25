"use client";

import { CheckCircle2, PawPrint } from "lucide-react";
import dayjs from "dayjs";

export default function SeguimientoCard({
  seguimiento,
  index,
  onImageClick,
}: {
  seguimiento: any;
  index: number;
  onImageClick?: (url: string) => void;
}) {
  const s = seguimiento;

  const estadoLabels: Record<string, string> = {
    requiere_atencion: "Requiere Atención",
    regular: "Regular",
    bueno: "Bueno",
    excelente: "Excelente",
  };

  const estadoColors: Record<string, string> = {
    requiere_atencion: "bg-red-100 text-red-700 border-red-300",
    regular: "bg-yellow-100 text-yellow-700 border-yellow-300",
    bueno: "bg-blue-100 text-blue-700 border-blue-300",
    excelente: "bg-green-100 text-green-700 border-green-300",
  };

  const estadoTexto = estadoLabels[s.estado_mascota] ?? "No registrado";
  const estadoColor =
    estadoColors[s.estado_mascota] ??
    "bg-gray-100 text-gray-600 border-gray-300";

  return (
    <div className="bg-white border border-[#E5D1B8] rounded-2xl p-6 shadow-sm">
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-[#8B4513] font-semibold text-lg">
            Seguimiento #{index + 1}
          </p>
          <p className="text-sm text-gray-600">
            Programado para:{" "}
            <b>{dayjs(s.fecha_seguimiento).format("DD/MM/YYYY")}</b>
          </p>
        </div>

        {s.completado && (
          <CheckCircle2 className="text-green-600" size={26} />
        )}
      </div>

      {/* ESTADO */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#8B4513] mb-1">
          Estado de la mascota:
        </p>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${estadoColor}`}
        >
          {estadoTexto}
        </span>
      </div>

      {/* PROBLEMAS */}
      {Array.isArray(s.problemas_reportados) &&
        s.problemas_reportados.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-[#8B4513] mb-1">
              Problemas reportados:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {s.problemas_reportados.map((p: string, idx: number) => (
                <li key={idx}>{p.replace(/^\w/, (c) => c.toUpperCase())}</li>
              ))}
            </ul>
          </div>
        )}

      {/* OBSERVACIONES */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#8B4513] mb-1">
          Observaciones del adoptante:
        </p>
        <p className="text-sm text-gray-700">
          {s.observaciones?.replace(/^\w/, (c: string) => c.toUpperCase())}
        </p>
      </div>

      {/* RECOMENDACIONES */}
      {s.recomendaciones && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-[#8B4513] mb-1">
            Recomendaciones:
          </p>
          <p className="text-sm text-gray-700">
            {s.recomendaciones.replace(/^\w/, (c) => c.toUpperCase())}
          </p>
        </div>
      )}

      {/* SATISFACCION */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#8B4513] mb-2">
          Satisfacción del adoptante:
        </p>

        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <PawPrint
              key={idx}
              size={24}
              className={
                idx < (s.satisfaccion_adoptante ?? 0)
                  ? "text-[#BC5F36]"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
      </div>

      {/* FOTOS */}
      {Array.isArray(s.fotos_actuales) && s.fotos_actuales.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-[#8B4513] mb-2">
            Evidencias fotográficas:
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {s.fotos_actuales.map((url: string, j: number) => (
              <img
                key={j}
                src={url}
                className="w-full h-28 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition"
                onClick={() => onImageClick?.(url)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

export function AdopcionesKPIs({
  totales,
  filtroEstado,
  onChange,
}: {
  totales: {
    pendientes: number;
    aprobadas: number;
    rechazadas: number;
  };
  filtroEstado: "todas" | "pendiente" | "aprobada" | "rechazada";
  onChange: (estado: "todas" | "pendiente" | "aprobada" | "rechazada") => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 pt-1">
      {/* Pendientes */}
      <button
        onClick={() => onChange("pendiente")}
        className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition
          ${
            filtroEstado === "pendiente"
              ? "bg-yellow-200 text-yellow-900 border-yellow-500 shadow-sm scale-[1.03]"
              : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
          }
        `}
      >
        Pendientes: {totales.pendientes}
      </button>

      {/* Aprobadas */}
      <button
        onClick={() => onChange("aprobada")}
        className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition
          ${
            filtroEstado === "aprobada"
              ? "bg-green-200 text-green-900 border-green-600 shadow-sm scale-[1.03]"
              : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          }
        `}
      >
        Aprobadas: {totales.aprobadas}
      </button>

      {/* Rechazadas */}
      <button
        onClick={() => onChange("rechazada")}
        className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition
          ${
            filtroEstado === "rechazada"
              ? "bg-red-200 text-red-900 border-red-600 shadow-sm scale-[1.03]"
              : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          }
        `}
      >
        Rechazadas: {totales.rechazadas}
      </button>

      {/* Mostrar todas */}
      {filtroEstado !== "todas" && (
        <button
          onClick={() => onChange("todas")}
          className="px-3 py-1.5 rounded-lg border text-sm font-semibold bg-white text-[#6b4f40] hover:bg-gray-50"
        >
          Mostrar todas
        </button>
      )}
    </div>
  );
}

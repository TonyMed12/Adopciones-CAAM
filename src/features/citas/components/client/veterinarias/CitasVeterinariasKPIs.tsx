"use client";

export function CitasVeterinariasKPIs({
  totales,
}: {
  totales: { pendientes: number; aprobadas: number; canceladas: number };
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="px-2 py-1 text-sm rounded-md border bg-yellow-50 text-yellow-700">
        Pendientes: {totales.pendientes}
      </span>
      <span className="px-2 py-1 text-sm rounded-md border bg-green-50 text-green-700">
        Aprobadas: {totales.aprobadas}
      </span>
      <span className="px-2 py-1 text-sm rounded-md border bg-red-50 text-red-700">
        Canceladas: {totales.canceladas}
      </span>
    </div>
  );
}

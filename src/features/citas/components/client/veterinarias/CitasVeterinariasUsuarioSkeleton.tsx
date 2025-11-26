"use client";

export default function CitasVeterinariasUsuarioSkeleton() {
  return (
    <div className="mt-8 animate-pulse">
      {/* Header skeleton */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-[#FFF1E6]">
            <tr>
              {["Mascota", "Fecha", "Hora", "Motivo", "Estado"].map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <div className="h-3 w-20 bg-[#f5e6d3] rounded" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 5 }).map((_, row) => (
              <tr key={row} className="border-t">
                {Array.from({ length: 5 }).map((_, col) => (
                  <td key={col} className="px-4 py-4">
                    <div className="h-3 w-full bg-[#f2e7db] rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid sm:hidden gap-4 mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-[#E5D1B8] rounded-xl p-4 shadow-sm space-y-3"
          >
            {/* Title row */}
            <div className="flex justify-between">
              <div className="h-3 w-28 bg-[#f2e7db] rounded" />
              <div className="h-3 w-16 bg-[#f5e6d3] rounded" />
            </div>

            {/* Fecha */}
            <div className="h-3 w-40 bg-[#f2e7db] rounded" />

            {/* Hora */}
            <div className="h-3 w-32 bg-[#f2e7db] rounded" />

            {/* Motivo */}
            <div className="h-3 w-48 bg-[#f2e7db] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

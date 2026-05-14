"use client";

export default function CitasVeterinariasUsuarioSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Filtros */}
      <div className="flex gap-2 mb-5 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-24 bg-[#f4e7d8] rounded-xl"
          />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl bg-white border border-[#eadacb] p-4 sm:p-5 pl-5 sm:pl-6 shadow-sm"
          >
            <div className="absolute top-0 left-0 h-full w-1.5 bg-[#f4e7d8]" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-[#f4e7d8]" />
                <div className="space-y-2">
                  <div className="h-2.5 w-16 bg-[#f9f1e7] rounded" />
                  <div className="h-4 w-28 bg-[#f4e7d8] rounded" />
                </div>
              </div>
              <div className="h-5 w-20 bg-[#f9f1e7] rounded-full" />
            </div>

            {/* Fecha box */}
            <div className="flex items-center gap-3 rounded-xl bg-[#fffaf4] border border-[#f3d6bb]/50 p-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-[#f4e7d8]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 bg-[#f4e7d8] rounded" />
                <div className="h-3 w-20 bg-[#f9f1e7] rounded" />
              </div>
            </div>

            {/* Motivo */}
            <div className="space-y-2 mb-2">
              <div className="h-3 w-3/4 bg-[#f9f1e7] rounded" />
              <div className="h-3 w-1/2 bg-[#f9f1e7] rounded" />
            </div>

            {/* Ubicación */}
            <div className="h-2.5 w-48 bg-[#f9f1e7] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

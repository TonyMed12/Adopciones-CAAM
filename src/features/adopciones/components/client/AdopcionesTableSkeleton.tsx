"use client";

export default function AdopcionesTableSkeleton() {
  return (
    <>
      {/* Search Skeleton */}
      <div className="bg-white rounded-2xl border border-[#EADACB] shadow-sm p-3 mb-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <div className="flex items-center gap-2 rounded-full border border-[#EADACB] bg-white pl-3 pr-2 py-2 w-full animate-pulse">
              <div className="h-4 w-4 bg-[#EADACB] rounded-full" />
              <div className="h-3 w-32 bg-[#F3E8DC] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="lg:hidden space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-[#EADACB] rounded-2xl p-4 shadow-sm space-y-3 animate-pulse"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-[#F3E8DC] rounded" />
              <div className="h-4 w-16 bg-[#F3E8DC] rounded" />
            </div>

            {/* Info */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-[#F3E8DC] rounded-xl" />

              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-[#F3E8DC] rounded" />
                <div className="h-3 w-40 bg-[#F3E8DC] rounded" />
                <div className="h-3 w-28 bg-[#F3E8DC] rounded" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <div className="flex-1 h-8 bg-[#F3E8DC] rounded-lg" />
              <div className="flex-1 h-8 bg-[#F3E8DC] rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden lg:block bg-white rounded-2xl border border-[#EADACB] shadow-sm overflow-x-auto mt-4">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-[1]">
            <tr className="bg-[#FFF4E7] border-y border-[#EADACB]">
              <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#2b1b12]">
                Adoptante
              </th>
              <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#2b1b12]">
                Mascota
              </th>
              <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#2b1b12]">
                Estado
              </th>
              <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-right text-[#2b1b12]">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr
                key={i}
                className={`border-b border-[#F3E8DC] ${
                  i % 2 === 0 ? "bg-white" : "bg-[#FFFDF9]"
                } animate-pulse`}
              >
                <td className="px-3 py-4">
                  <div className="h-3 w-32 bg-[#F3E8DC] rounded" />
                </td>

                <td className="px-3 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-[#F3E8DC] rounded-full" />
                    <div className="h-3 w-24 bg-[#F3E8DC] rounded" />
                  </div>
                </td>

                <td className="px-3 py-4">
                  <div className="h-4 w-20 bg-[#F3E8DC] rounded" />
                </td>

                <td className="px-3 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <div className="h-6 w-14 bg-[#F3E8DC] rounded" />
                    <div className="h-6 w-14 bg-[#F3E8DC] rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

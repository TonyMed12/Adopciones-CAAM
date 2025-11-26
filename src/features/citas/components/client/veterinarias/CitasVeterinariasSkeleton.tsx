"use client";

export default function CitasVeterinariasSkeleton() {
  return (
    <div className="space-y-6 animate-pulse w-full block lg:block">

      {/* ===== KPIs ===== */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-7 w-32 bg-[#f4e7d8] rounded-md" />
        ))}
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">

        {/* ===== Tabla Desktop ===== */}
        <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden border border-[#eedfcc]">
          <div className="bg-[#FFF6E5] py-3 px-4 grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-[#f4e7d8] rounded-md" />
            ))}
          </div>

          <div className="divide-y divide-[#f5e6d3]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4 px-4 py-4">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="h-4 bg-[#f9f1e7] rounded-md" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ===== Cards Mobile ===== */}
        <div className="lg:hidden space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#EADACB] p-4 shadow-sm space-y-3"
            >
              <div className="flex justify-between">
                <div className="h-4 w-28 bg-[#f4e7d8] rounded" />
                <div className="h-4 w-16 bg-[#f8eee3] rounded" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#f4e7d8] rounded-md" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-[#f9f1e7] rounded-md" />
                  <div className="h-3 w-20 bg-[#f1e8dc] rounded-md" />
                </div>
              </div>

              <div className="h-3 w-40 bg-[#f4e7d8] rounded-md" />

              <div className="flex gap-2 pt-2">
                <div className="flex-1 h-8 bg-[#f9f1e7] rounded-md" />
                <div className="flex-1 h-8 bg-[#f9f1e7] rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* ===== Panel lateral ===== */}
        <div className="flex flex-col gap-4 self-start">

          {/* Calendario Skeleton */}
          <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
            <div className="h-5 w-40 bg-[#f4e7d8] rounded-md" />

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#f9f1e7] rounded-md" />
              ))}
            </div>
          </div>

          {/* Próximas citas */}
          <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
            <div className="h-5 w-40 bg-[#f4e7d8] rounded-md" />

            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="py-3 flex justify-between items-center border-b border-[#FDE68A]"
              >
                <div>
                  <div className="h-4 w-28 bg-[#f9f1e7] rounded-md mb-2" />
                  <div className="h-3 w-40 bg-[#f1e8dc] rounded-md" />
                </div>

                <div className="h-4 w-12 bg-[#f4e7d8] rounded-md" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

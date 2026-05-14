"use client";

export default function CitasVeterinariasSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6 animate-pulse">
      {/* ===== KPIs ===== */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 bg-slate-100 rounded" />
                <div className="h-8 w-12 bg-slate-200 rounded" />
              </div>
              <div className="h-11 w-11 rounded-2xl bg-slate-100" />
            </div>
          </div>
        ))}
      </div>

      {/* ===== Layout principal ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-6 items-start">
        {/* Tabla desktop */}
        <div className="hidden lg:block rounded-2xl border border-slate-200/70 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-100" />
            <div className="space-y-2">
              <div className="h-3 w-32 bg-slate-200 rounded" />
              <div className="h-2.5 w-20 bg-slate-100 rounded" />
            </div>
          </div>

          {/* Header */}
          <div className="bg-slate-50/60 px-5 py-3 grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-2.5 bg-slate-200 rounded" />
            ))}
          </div>

          {/* Filas */}
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4 px-5 py-4 items-center">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-100" />
                  <div className="h-3 w-20 bg-slate-100 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-slate-100" />
                  <div className="h-3 w-16 bg-slate-100 rounded" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                  <div className="h-2.5 w-16 bg-slate-50 rounded" />
                </div>
                <div className="h-3 w-full bg-slate-100 rounded" />
                <div className="h-5 w-20 bg-slate-100 rounded-full" />
                <div className="flex justify-end gap-1.5">
                  <div className="h-7 w-16 bg-slate-100 rounded-lg" />
                  <div className="h-7 w-16 bg-slate-100 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cards mobile */}
        <div className="lg:hidden space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200/70 bg-white p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-2.5 w-14 bg-slate-100 rounded" />
                    <div className="h-3.5 w-24 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="h-5 w-20 bg-slate-100 rounded-full" />
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-slate-100" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-2.5 w-16 bg-slate-100 rounded" />
                  <div className="h-3 w-32 bg-slate-100 rounded" />
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-slate-100" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-2.5 w-16 bg-slate-100 rounded" />
                  <div className="h-3 w-44 bg-slate-100 rounded" />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <div className="flex-1 h-9 bg-slate-100 rounded-xl" />
                <div className="flex-1 h-9 bg-slate-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Panel lateral */}
        <div className="flex flex-col gap-4 self-start">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-slate-100" />
              <div className="space-y-2">
                <div className="h-3 w-28 bg-slate-200 rounded" />
                <div className="h-2.5 w-20 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-md" />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-slate-100" />
              <div className="space-y-2">
                <div className="h-3 w-28 bg-slate-200 rounded" />
                <div className="h-2.5 w-20 bg-slate-100 rounded" />
              </div>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3 mb-2"
              >
                <div className="h-9 w-9 rounded-xl bg-slate-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                  <div className="h-2.5 w-36 bg-slate-100 rounded" />
                  <div className="h-4 w-16 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

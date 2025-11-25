"use client";

export default function DocumentosTableSkeleton() {
  return (
    <section className="rounded-2xl border border-[#eadacb] bg-white shadow-sm overflow-hidden animate-pulse p-4 space-y-4">

      {[1, 2, 3].map((_, i) => (
        <div key={i} className="border-b border-[#f3e8dd] pb-4 last:border-none">

          <div className="flex justify-between items-center px-2 py-3">
            <div className="space-y-1">
              <div className="h-4 w-40 bg-[#eadacb] rounded-md"></div>
              <div className="h-3 w-28 bg-[#eadacb]/70 rounded-md"></div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-4 w-14 bg-[#eadacb] rounded-md"></div>
              <div className="h-4 w-20 bg-[#eadacb] rounded-md"></div>
              <div className="h-4 w-4 bg-[#eadacb] rounded-md"></div>
            </div>
          </div>

          <div className="mt-2 space-y-3 px-2">
            {[1, 2].map((_, i) => (
              <div
                key={i}
                className="border border-[#eadacb] rounded-xl p-4 bg-white shadow-sm flex justify-between items-center"
              >
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-[#eadacb] rounded-md"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-28 bg-[#eadacb] rounded-md"></div>
                    <div className="h-3 w-20 bg-[#eadacb]/70 rounded-md"></div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-6 w-16 bg-[#eadacb] rounded-md"></div>
                  <div className="h-6 w-12 bg-[#eadacb] rounded-md"></div>
                  <div className="h-6 w-12 bg-[#eadacb] rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

"use client";

export default function Pagination({
  page,
  totalPages,
  onChange,
  isMobile,
}: {
  page: number;
  totalPages: number;
  onChange: (n: number) => void;
  isMobile: boolean;
}) {
  if (totalPages <= 1) return null;

  // --- MOBILE VERSION ---
  if (isMobile) {
    return (
      <div className="flex items-center justify-between text-sm mt-4">
        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className={`px-3 py-1 rounded-lg border text-[#BC5F36] ${
            page === 1 ? "opacity-40" : "hover:bg-[#FFF4E7]"
          }`}
        >
          Anterior
        </button>
        <span className="text-[#2B1B12] font-medium">
          {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className={`px-3 py-1 rounded-lg border text-[#BC5F36] ${
            page === totalPages ? "opacity-40" : "hover:bg-[#FFF4E7]"
          }`}
        >
          Siguiente
        </button>
      </div>
    );
  }

  // --- DESKTOP VERSION ---
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        disabled={page === 1}
        onClick={() => onChange(1)}
        className="px-2 py-1 text-[#BC5F36] hover:bg-[#FFF4E7] rounded-lg disabled:opacity-40"
      >
        «
      </button>
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-2 py-1 text-[#BC5F36] hover:bg-[#FFF4E7] rounded-lg disabled:opacity-40"
      >
        ‹
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const num = i + 1;
        return (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`px-3 py-1 rounded-lg border ${
              num === page
                ? "bg-[#BC5F36] text-white"
                : "hover:bg-[#FFF4E7] text-[#2B1B12]"
            }`}
          >
            {num}
          </button>
        );
      })}

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-2 py-1 text-[#BC5F36] hover:bg-[#FFF4E7] rounded-lg disabled:opacity-40"
      >
        ›
      </button>
      <button
        disabled={page === totalPages}
        onClick={() => onChange(totalPages)}
        className="px-2 py-1 text-[#BC5F36] hover:bg-[#FFF4E7] rounded-lg disabled:opacity-40"
      >
        »
      </button>
    </div>
  );
}

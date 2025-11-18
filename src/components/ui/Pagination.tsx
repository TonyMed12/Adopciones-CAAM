"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  itemsLabel?: string;   // "usuarios", "mascotas", etc.
  itemsPerPage?: number; // ej: 5 ó 10
  totalItems?: number;   // cantidad total real de elementos
};

export default function Pagination({
  page,
  totalPages,
  onChange,
  itemsLabel = "registros",
  itemsPerPage,
  totalItems,
}: Props) {
  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      onChange(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 🔢 Cálculo del rango mostrado
  const start = itemsPerPage && totalItems ? (page - 1) * itemsPerPage + 1 : null;
  const end =
    itemsPerPage && totalItems
      ? Math.min(page * itemsPerPage, totalItems)
      : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm">

      {/* Texto descriptivo */}
      <span className="text-slate-500">
        {start && end && totalItems ? (
          <>
            Mostrando <b>{start}</b>–<b>{end}</b> de <b>{totalItems}</b> {itemsLabel}
          </>
        ) : (
          <>
            Página <b>{page}</b> de <b>{totalPages}</b>
          </>
        )}
      </span>

      {/* Controles */}
      <div className="flex items-center gap-2">

        {/* Botón Anterior */}
        <button
          onClick={() => {
            if (page > 1) {
              goTo(page - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          disabled={page === 1}
          className={`
            h-8 px-3 rounded-md border text-xs font-semibold flex items-center gap-1
            transition disabled:opacity-40
            ${page === 1
              ? "bg-white border-slate-200 text-slate-400"
              : "bg-white border-slate-200 text-[#8B4513] hover:bg-amber-50"
            }
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        {/* Chips numerados */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goTo(p)}
              className={`
                min-w-[2rem] h-8 rounded-full text-xs font-semibold border transition
                ${p === page
                  ? "bg-[#BC5F36] text-white border-[#BC5F36]"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-amber-50"
                }
              `}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={() => {
            if (page < totalPages) {
              goTo(page + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          disabled={page === totalPages}
          className={`
            h-8 px-3 rounded-md border text-xs font-semibold flex items-center gap-1
            transition disabled:opacity-40
            ${page === totalPages
              ? "bg-white border-slate-200 text-slate-400"
              : "bg-white border-slate-200 text-[#8B4513] hover:bg-amber-50"
            }
          `}
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

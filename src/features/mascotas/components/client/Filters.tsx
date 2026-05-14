"use client";
import { Search, SlidersHorizontal, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  q: string;
  onQ: (v: string) => void;
  especie: string;
  onEspecie: (v: string) => void;
  sexo: string;
  onSexo: (v: string) => void;
  ESPECIES: readonly string[];
};

type Opt = { label: string; value: string };

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void
) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClose]);
}

/* =================== Chip Select (móvil-friendly) =================== */
function ChipSelect({
  value,
  onChange,
  options,
  ariaLabel,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Opt[];
  ariaLabel: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  useClickOutside(boxRef, () => setOpen(false));

  const current = options.find((o) => o.value === value) ?? options[0];
  const isDefault = current.value === options[0].value;

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center justify-between gap-2 rounded-xl border bg-white px-3.5 py-2.5 text-sm font-medium transition-all shadow-sm hover:shadow-md",
          isDefault
            ? "border-[#eadacb] text-[#7a5c49]"
            : "border-[#BC5F36] text-[#8B4513] bg-[#FFF7EF] ring-1 ring-[#BC5F36]/20"
        )}
      >
        <span className="truncate">{current.label}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          aria-hidden
          className={cn(
            "transition-transform shrink-0",
            open ? "rotate-180" : ""
          )}
        >
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-50 max-h-72 overflow-y-auto rounded-xl border border-[#eadacb] bg-white shadow-xl py-1.5 animate-fade-slide custom-scroll"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3.5 py-2 text-sm transition-colors flex items-center justify-between gap-2",
                  active
                    ? "bg-[#FFF1E6] text-[#8B4513] font-semibold"
                    : "text-[#6c5241] hover:bg-[#FFF7EF]"
                )}
              >
                <span>{opt.label}</span>
                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#BC5F36]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =================== Filters principal =================== */
export default function Filters({
  q,
  onQ,
  especie,
  onEspecie,
  sexo,
  onSexo,
  ESPECIES,
}: Props) {
  const especieOpts: Opt[] = [
    { label: "Todas las especies", value: "Todas" },
    ...ESPECIES.map((e) => ({ label: e, value: e })),
  ];
  const sexoOpts: Opt[] = [
    { label: "Ambos sexos", value: "Todos" },
    { label: "Macho", value: "Macho" },
    { label: "Hembra", value: "Hembra" },
  ];

  const hasActiveFilters =
    q.trim() !== "" || especie !== "Todas" || sexo !== "Todos";

  const clearAll = () => {
    onQ("");
    onEspecie("Todas");
    onSexo("Todos");
  };

  return (
    <section
      aria-label="Filtros de mascotas"
      className="rounded-2xl bg-white border border-[#eadacb] shadow-sm p-3 sm:p-4"
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px_auto]">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a78d7b] pointer-events-none">
            <Search size={18} />
          </span>
          <input
            value={q}
            onChange={(e) => onQ(e.target.value)}
            placeholder="Busca por nombre, raza o descripción…"
            className="w-full rounded-xl border border-[#eadacb] bg-white pl-11 pr-9 py-2.5 text-sm placeholder:text-[#a78d7b] focus:border-[#BC5F36] focus:ring-2 focus:ring-[#BC5F36]/20 outline-none transition-all shadow-sm"
          />
          {q && (
            <button
              type="button"
              onClick={() => onQ("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a78d7b] hover:text-[#BC5F36] transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <ChipSelect
          value={especie}
          onChange={onEspecie}
          options={especieOpts}
          ariaLabel="Filtrar por especie"
        />
        <ChipSelect
          value={sexo}
          onChange={onSexo}
          options={sexoOpts}
          ariaLabel="Filtrar por sexo"
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#eadacb] bg-[#FFF7EF] px-3 py-2.5 text-sm font-semibold text-[#8B4513] hover:bg-[#FFF1E6] hover:border-[#BC5F36]/40 transition-all shadow-sm"
          >
            <X size={14} />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        )}
      </div>

      {/* Indicador móvil de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
          <span className="inline-flex items-center gap-1 text-[#7a5c49]">
            <SlidersHorizontal size={12} />
            <span className="font-semibold">Filtros activos:</span>
          </span>
          {q.trim() !== "" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF1E6] text-[#8B4513] px-2.5 py-1 font-semibold">
              "{q}"
              <button
                type="button"
                onClick={() => onQ("")}
                aria-label="Quitar búsqueda"
                className="hover:text-[#BC5F36]"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {especie !== "Todas" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF1E6] text-[#8B4513] px-2.5 py-1 font-semibold">
              {especie}
              <button
                type="button"
                onClick={() => onEspecie("Todas")}
                aria-label="Quitar especie"
                className="hover:text-[#BC5F36]"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {sexo !== "Todos" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF1E6] text-[#8B4513] px-2.5 py-1 font-semibold">
              {sexo}
              <button
                type="button"
                onClick={() => onSexo("Todos")}
                aria-label="Quitar sexo"
                className="hover:text-[#BC5F36]"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </section>
  );
}

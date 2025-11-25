"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
  label: string;
  value: string;
}

interface Props {
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function CAAMRazaCombobox({
  value,
  options,
  onChange,
  placeholder = "Seleccionar raza",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = query.trim()
    ? options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function selectValue(opt: Option) {
    onChange(opt.value);
    setQuery(opt.label);
    setOpen(false);
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <input
        type="text"
        value={open ? query : selected?.label || ""}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="
          w-full rounded-xl border border-[#FF8414]/40 bg-white px-3 py-3 text-base
          text-[#2b1b12] shadow-sm focus:border-[#FF8414] focus:outline-none
          placeholder:text-[#2b1b12]/40 transition
        "
      />

      {open && (
        <div
          className="
            absolute z-50 mt-1 w-full max-h-56 overflow-y-auto 
            rounded-xl border border-[#FF8414]/40 bg-white shadow-lg
          "
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500 italic">
              No se encontraron razas
            </div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => selectValue(opt)}
                className={`
                  w-full text-left px-3 py-2 text-base transition
                  hover:bg-[#FFF2E6]
                  ${
                    opt.value === value
                      ? "bg-[#FF8414]/15 font-medium text-[#8B4513]"
                      : ""
                  }
                `}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

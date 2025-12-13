"use client";
console.log("CAAMSelect NUEVO");
import { useEffect, useRef, useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface CAAMSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export function CAAMSelect({
  value,
  onChange,
  options,
  placeholder = "Seleccionar",
  className = "",
}: CAAMSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(v: string) {
    onChange(v);
    setOpen(false);
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="
          w-full h-12 px-5 flex items-center justify-between
          rounded-lg border border-[#d6c2b3]
          bg-white text-sm text-[#2b1b12]
          shadow-sm
          focus:outline-none focus:ring-2 focus:ring-[#8B4513]
          transition
        "
      >
        <span className={selected ? "" : "text-gray-400"}>
          {selected?.label || placeholder}
        </span>

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="
            absolute z-50 mt-1 w-full
            rounded-lg border border-[#d6c2b3]
            bg-white shadow-lg
            max-h-56 overflow-y-auto
          "
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;

            return (
              <button
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`
                  w-full px-3 py-2 text-sm text-left
                  transition
                  hover:bg-[#f4ece4]
                  ${
                    isSelected
                      ? "bg-[#8B4513] text-white"
                      : "text-[#2b1b12]"
                  }
                `}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

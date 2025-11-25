"use client";

import { useState, useRef } from "react";

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

  function handleSelect(v: string) {
    onChange(v);
    setOpen(false);
  }

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        className="w-full rounded-xl border border-[#FF8414]/40 bg-white px-3 py-3 text-base 
        text-[#2b1b12] shadow-sm flex justify-between items-center
        hover:border-[#FF8414] transition"
        onClick={() => setOpen(!open)}
      >
        <span>
          {options.find((o) => o.value === value)?.label || placeholder}
        </span>

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          className={`transition ${open ? "rotate-180" : ""}`}
        >
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full rounded-xl border border-[#FF8414]/40 
          bg-white shadow-lg max-h-60 overflow-y-auto"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-3 py-2 text-base hover:bg-[#fff2e6] transition 
                ${opt.value === value ? "bg-[#FF8414]/15 font-medium" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

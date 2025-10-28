"use client";

import React from "react";

export default function StepperAdopcion() {
  const steps = ["1. Ver mascotas", "2. Agendar visita", "3. Confirmación"];

  return (
    <ol className="grid gap-3 md:grid-cols-3">
      {steps.map((label, idx) => (
        <li
          key={label}
          className="rounded-xl border border-[#eadacb] bg-[#fff4e7] p-4 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#BC5F36] text-xs font-bold text-white">
              {idx + 1}
            </span>
            <p className="text-sm font-extrabold text-[#2b1b12]">{label}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

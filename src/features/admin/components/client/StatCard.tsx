"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

export function StatCard({
  label,
  value,
  icon,
  color,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
}) {
  const hasAlert = value > 0 && label !== "Mascotas adoptables";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl border bg-white p-5
        text-left w-full transition-all duration-300
        hover:-translate-y-[2px] hover:shadow-[0_20px_40px_-15px_rgba(43,27,18,0.15)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BC5F36]/40
        ${
          hasAlert
            ? "border-[#BC5F36]/30 bg-gradient-to-br from-[#fffaf4] to-white"
            : "border-slate-200/80"
        }
      `}
      style={{ boxShadow: "0 4px 16px -8px rgba(2,6,23,.08)" }}
    >
      {/* Decoración sutil */}
      <div
        className={`
          pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl
          ${
            hasAlert
              ? "bg-[#FFEAD2]/70"
              : "bg-slate-100/70"
          }
        `}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <h3 className="text-3xl sm:text-[2rem] font-extrabold text-slate-800 mt-1.5 leading-none tracking-tight tabular-nums">
            {value}
          </h3>

          {hasAlert && (
            <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#BC5F36]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#BC5F36] animate-pulse" />
              Requiere atención
            </p>
          )}
        </div>

        <div
          className={`
            grid h-11 w-11 place-items-center rounded-2xl shrink-0 transition group-hover:scale-105
            ${color ?? "bg-[#FFF1E6] text-[#BC5F36] ring-1 ring-[#f3d6bb]"}
          `}
        >
          {icon}
        </div>
      </div>

      {/* Arrow al hover */}
      <ArrowUpRight
        className="absolute bottom-4 right-4 h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-[#BC5F36] transition-all"
        aria-hidden="true"
      />
    </button>
  );
}

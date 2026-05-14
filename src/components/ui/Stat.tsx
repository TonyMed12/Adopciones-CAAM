"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "brand" | "accent" | "neutral" | "success" | "warning" | "danger";

const TONE_MAP: Record<Tone, { bg: string; text: string; ring: string }> = {
  brand:   { bg: "bg-[#FFF1E6]",  text: "text-[#8B4513]", ring: "ring-[#f3d6bb]" },
  accent:  { bg: "bg-[#FEF3C7]",  text: "text-[#8B5E34]", ring: "ring-[#fde68a]" },
  neutral: { bg: "bg-slate-100",  text: "text-slate-700", ring: "ring-slate-200" },
  success: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
  warning: { bg: "bg-amber-50",   text: "text-amber-700", ring: "ring-amber-200" },
  danger:  { bg: "bg-rose-50",    text: "text-rose-700", ring: "ring-rose-200" },
};

export interface StatProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: Tone;
  className?: string;
}

export function Stat({
  label,
  value,
  hint,
  icon,
  tone = "brand",
  className,
}: StatProps) {
  const t = TONE_MAP[tone];
  return (
    <div
      className={cn(
        "relative rounded-2xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl md:text-3xl font-extrabold text-[#2b1b12] leading-tight truncate">
            {value}
          </p>
          {hint && (
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              {hint}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "grid place-items-center h-11 w-11 rounded-xl ring-1 ring-inset shrink-0",
              t.bg,
              t.text,
              t.ring
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

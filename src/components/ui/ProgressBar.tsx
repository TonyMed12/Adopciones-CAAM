"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "brand" | "success" | "warning" | "info";

const TRACK: Record<Tone, string> = {
  brand:   "from-[#BC5F36] to-[#D97706]",
  success: "from-emerald-500 to-emerald-400",
  warning: "from-amber-500 to-amber-400",
  info:    "from-sky-500 to-sky-400",
};

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: React.ReactNode;
  showValue?: boolean;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  className?: string;
  description?: React.ReactNode;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  tone = "brand",
  size = "md",
  className,
  description,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const height = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2.5";

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && (
            <span className="font-semibold text-[#6c5241]">{label}</span>
          )}
          {showValue && (
            <span className="font-semibold text-[#8B4513] tabular-nums">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-[#f5e8d8]",
          height
        )}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-[width] duration-500 ease-out",
            TRACK[tone]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {description && (
        <p className="mt-1.5 text-xs text-[#7a5c49] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

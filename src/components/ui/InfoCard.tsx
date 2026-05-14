"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "brand" | "info" | "success" | "warning" | "danger" | "neutral";

const TONE: Record<
  Tone,
  { bg: string; border: string; text: string; iconBg: string }
> = {
  brand: {
    bg: "bg-[#FFF7EF]",
    border: "border-[#f3d6bb]",
    text: "text-[#8B4513]",
    iconBg: "bg-[#FFE8D2] text-[#BC5F36]",
  },
  info: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-900",
    iconBg: "bg-sky-100 text-sky-600",
  },
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-900",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-900",
    iconBg: "bg-amber-100 text-amber-700",
  },
  danger: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-900",
    iconBg: "bg-rose-100 text-rose-600",
  },
  neutral: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-800",
    iconBg: "bg-slate-100 text-slate-600",
  },
};

export interface InfoCardProps {
  tone?: Tone;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function InfoCard({
  tone = "info",
  icon,
  title,
  children,
  action,
  className,
}: InfoCardProps) {
  const t = TONE[tone];
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 sm:p-5 flex gap-4",
        t.bg,
        t.border,
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "grid place-items-center h-10 w-10 rounded-xl shrink-0",
            t.iconBg
          )}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        {title && (
          <h4 className={cn("font-bold mb-1 text-sm sm:text-base", t.text)}>
            {title}
          </h4>
        )}
        <div className={cn("text-sm leading-relaxed", t.text, "opacity-90")}>
          {children}
        </div>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}

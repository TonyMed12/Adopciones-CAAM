"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tone?: "info" | "danger" | "success" | "warning";
  action?: React.ReactNode;
}

const TONE = {
  info: {
    bg: "from-[#FFF7EF] to-[#FFEAD2]",
    border: "border-[#f3d6bb]",
    iconBg: "bg-[#BC5F36]",
    titleColor: "text-[#2b1b12]",
    descColor: "text-[#6c5241]",
  },
  danger: {
    bg: "from-rose-50 to-rose-100/60",
    border: "border-rose-200",
    iconBg: "bg-rose-600",
    titleColor: "text-rose-900",
    descColor: "text-rose-800/90",
  },
  success: {
    bg: "from-emerald-50 to-emerald-100/60",
    border: "border-emerald-200",
    iconBg: "bg-emerald-600",
    titleColor: "text-emerald-900",
    descColor: "text-emerald-800/90",
  },
  warning: {
    bg: "from-amber-50 to-amber-100/60",
    border: "border-amber-200",
    iconBg: "bg-amber-600",
    titleColor: "text-amber-900",
    descColor: "text-amber-800/90",
  },
};

export default function PanelEstado({
  icon,
  title,
  desc,
  tone = "info",
  action,
}: Props) {
  const t = TONE[tone];

  return (
    <section
      className={cn(
        "rounded-2xl border bg-gradient-to-br p-5 sm:p-6 shadow-sm",
        t.bg,
        t.border
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <span
          className={cn(
            "grid h-12 w-12 place-items-center rounded-2xl text-white shadow-md shrink-0",
            t.iconBg
          )}
        >
          {icon}
        </span>

        <div className="flex-1 min-w-0">
          <h3 className={cn("text-base sm:text-lg font-extrabold leading-tight", t.titleColor)}>
            {title}
          </h3>
          <p className={cn("mt-1 text-sm leading-relaxed", t.descColor)}>
            {desc}
          </p>
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </section>
  );
}

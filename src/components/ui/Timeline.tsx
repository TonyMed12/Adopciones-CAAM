"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export type TimelineTone =
  | "brand"
  | "success"
  | "warning"
  | "info"
  | "neutral";

const DOT_TONE: Record<TimelineTone, string> = {
  brand:   "bg-[#BC5F36] text-white ring-[#BC5F36]/20",
  success: "bg-emerald-500 text-white ring-emerald-500/20",
  warning: "bg-amber-500 text-white ring-amber-500/20",
  info:    "bg-sky-500 text-white ring-sky-500/20",
  neutral: "bg-white text-[#a78d7b] ring-[#eadacb] border border-[#eadacb]",
};

export interface TimelineItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: TimelineTone;
  badge?: React.ReactNode;
}

export function Timeline({
  items,
  className,
}: {
  items: TimelineItem[];
  className?: string;
}) {
  return (
    <ol className={cn("relative", className)}>
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        const tone = it.tone || "brand";
        return (
          <li key={it.id} className="relative pl-10 pb-6 last:pb-0">
            {!isLast && (
              <span
                aria-hidden="true"
                className="absolute left-[15px] top-9 bottom-0 w-[2px] bg-[#eadacb]"
              />
            )}

            <div
              className={cn(
                "absolute left-0 top-1 grid place-items-center h-8 w-8 rounded-full ring-4",
                DOT_TONE[tone]
              )}
            >
              {it.icon || (
                <span className="block h-2 w-2 rounded-full bg-current opacity-90" />
              )}
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm sm:text-base font-extrabold text-[#2b1b12] leading-tight">
                    {it.title}
                  </h4>
                  {it.badge}
                </div>
                {it.description && (
                  <div className="mt-1 text-sm text-[#7a5c49] leading-relaxed">
                    {it.description}
                  </div>
                )}
              </div>
              {it.meta && (
                <div className="shrink-0 text-xs text-[#a78d7b]">{it.meta}</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

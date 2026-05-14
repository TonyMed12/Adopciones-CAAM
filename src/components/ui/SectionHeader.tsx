"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  eyebrow?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SectionHeader({
  title,
  description,
  action,
  icon,
  eyebrow,
  className,
  size = "md",
}: SectionHeaderProps) {
  const titleClass =
    size === "lg"
      ? "text-2xl md:text-3xl"
      : size === "sm"
      ? "text-base md:text-lg"
      : "text-xl md:text-2xl";

  return (
    <div
      className={cn(
        "flex items-end justify-between gap-3 flex-wrap mb-4",
        className
      )}
    >
      <div className="min-w-0 flex items-start gap-3">
        {icon && (
          <div className="grid place-items-center h-10 w-10 rounded-xl bg-[#FFF1E6] text-[#BC5F36] shrink-0 ring-1 ring-[#f3d6bb]">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#BC5F36] mb-1">
              {eyebrow}
            </p>
          )}
          <h2
            className={cn(
              "font-extrabold tracking-tight text-[#2b1b12] leading-tight",
              titleClass
            )}
          >
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm md:text-base text-[#7a5c49] leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

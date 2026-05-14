"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative w-full text-center rounded-3xl bg-gradient-to-br from-[#FFFAF4] to-[#FFF1E6] border border-[#eadacb]",
        compact ? "py-10 px-6" : "py-14 px-6 md:py-20",
        className
      )}
    >
      <div className="max-w-md mx-auto flex flex-col items-center gap-3">
        {icon && (
          <div className="grid place-items-center h-16 w-16 rounded-2xl bg-white text-[#BC5F36] shadow-sm ring-1 ring-[#f3d6bb]">
            {icon}
          </div>
        )}

        <h3 className="text-xl md:text-2xl font-extrabold text-[#2b1b12] tracking-tight">
          {title}
        </h3>

        {description && (
          <p className="text-sm md:text-base text-[#7a5c49] leading-relaxed">
            {description}
          </p>
        )}

        {(action || secondaryAction) && (
          <div className="mt-3 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            {action}
            {secondaryAction}
          </div>
        )}
      </div>
    </div>
  );
}

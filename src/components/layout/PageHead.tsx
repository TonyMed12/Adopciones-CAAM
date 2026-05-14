"use client";
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  eyebrow?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
};

export default function PageHead({
  title,
  subtitle,
  right,
  eyebrow,
  icon,
  className,
  align = "left",
}: Props) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:gap-3 mb-6 sm:mb-8",
        isCenter
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between text-center sm:text-left",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-2 min-w-0",
          isCenter ? "items-center" : "w-full"
        )}
      >
        {eyebrow && (
          <div
            className={cn(
              "inline-flex items-center gap-2 self-center sm:self-start text-xs font-semibold uppercase tracking-wider text-[#BC5F36]",
              isCenter && "sm:self-center"
            )}
          >
            {eyebrow}
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-3",
            isCenter ? "justify-center" : "justify-center sm:justify-start"
          )}
        >
          {icon && (
            <div className="grid place-items-center h-11 w-11 rounded-2xl bg-[#FFF1E6] text-[#8B4513] shrink-0 shadow-sm">
              {icon}
            </div>
          )}

          <h1
            className={cn(
              "m-0 font-extrabold leading-tight tracking-tight text-[#8B4513]",
              "text-2xl sm:text-3xl md:text-4xl"
            )}
          >
            {title}
          </h1>
        </div>

        {subtitle && (
          <p className="m-0 text-sm sm:text-base text-[#7a5c49] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {right && (
        <div className="flex-shrink-0 self-stretch sm:self-end">{right}</div>
      )}
    </div>
  );
}

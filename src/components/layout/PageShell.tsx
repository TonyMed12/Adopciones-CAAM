"use client";
import React from "react";
import { cn } from "@/lib/utils";

type Width = "narrow" | "default" | "wide" | "full";
type Spacing = "none" | "sm" | "md" | "lg";

const WIDTH_MAP: Record<Width, string> = {
  narrow: "max-w-[880px]",
  default: "max-w-[1100px]",
  wide: "max-w-[1280px]",
  full: "max-w-none",
};

const SPACING_MAP: Record<Spacing, string> = {
  none: "py-0",
  sm: "pt-4 pb-8",
  md: "pt-6 pb-14",
  lg: "pt-10 pb-20",
};

export default function PageShell({
  children,
  width = "default",
  spacing = "md",
  className,
  as: As = "main",
}: {
  children: React.ReactNode;
  width?: Width;
  spacing?: Spacing;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <As
      className={cn(
        "mx-auto w-full px-4 sm:px-6 text-[#2b1b12]",
        WIDTH_MAP[width],
        SPACING_MAP[spacing],
        className
      )}
    >
      {children}
    </As>
  );
}

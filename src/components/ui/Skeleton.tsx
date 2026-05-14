"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "circle" | "text" | "card";

export function Skeleton({
  className = "",
  variant = "default",
}: {
  className?: string;
  variant?: Variant;
}) {
  const base = "caam-skeleton";
  const shape =
    variant === "circle"
      ? "rounded-full"
      : variant === "text"
      ? "rounded-md h-3"
      : variant === "card"
      ? "rounded-2xl"
      : "rounded-md";

  return <div className={cn(base, shape, className)} aria-hidden="true" />;
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            i === lines - 1 ? "w-2/3" : "w-full",
            i === 0 ? "h-4" : "h-3"
          )}
        />
      ))}
    </div>
  );
}

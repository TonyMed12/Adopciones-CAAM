"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-semibold leading-none tracking-wide whitespace-nowrap transition-colors",
  {
    variants: {
      tone: {
        brand:   "bg-[#FFF1E6] text-[#8B4513] ring-1 ring-inset ring-[#f3d6bb]",
        accent:  "bg-[#FEF3C7] text-[#8B5E34] ring-1 ring-inset ring-[#fde68a]",
        neutral: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
        success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
        warning: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
        danger:  "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
        info:    "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
        solid:   "bg-[#BC5F36] text-white",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: { tone: "brand", size: "md" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  dot?: boolean;
}

export function Badge({
  className,
  tone,
  size,
  icon,
  dot,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "inline-block rounded-full",
            size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
            "bg-current opacity-80"
          )}
        />
      )}
      {icon}
      {children}
    </span>
  );
}

export { badgeVariants };

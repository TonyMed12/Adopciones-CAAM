"use client";

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--brand-pink)] text-white shadow-md hover:bg-pink-500 hover:shadow-lg hover:scale-105 focus:ring-pink-300",
        secondary:
          "border border-gray-300 text-gray-800 hover:border-[var(--brand-purple)] hover:text-[var(--brand-purple)] hover:shadow-md hover:scale-105 focus:ring-purple-300",
        ghost:
          "text-gray-800 hover:bg-gray-100 focus:ring-gray-300",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2 text-sm",
        lg: "px-6 py-3 text-base",
      },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      full: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/** Botón estándar (renderiza <button>) */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, full, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, full, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

/** Versión para enlaces (Next.js Link) */
type ButtonLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & { className?: string; full?: boolean };

export function ButtonLink({
  href,
  className,
  variant,
  size,
  full,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size, full, className }))}
      {...props}
    />
  );
}

export { buttonVariants };

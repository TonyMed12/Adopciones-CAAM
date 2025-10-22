"use client";

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Variantes del botón
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-[#8B4513] text-white shadow-md hover:bg-[#A0522D] hover:shadow-lg hover:scale-105 focus:ring-[#FDE68A]",
        secondary:
          "bg-[#FDE68A] text-[#8B4513] shadow-sm hover:bg-[#FCD34D] hover:shadow-md hover:scale-105 focus:ring-[#8B4513]",
        ghost:
          "text-[#8B4513] hover:bg-[#FFF1E6] focus:ring-[#FDE68A]",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2 text-sm",
        lg: "px-6 py-3 text-base",
      },
      full: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      full: false,
    },
  }
);

// Props para <Button>
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// Botón estándar
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

// Props para <ButtonLink>
type ButtonLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & { className?: string; full?: boolean };

// Versión para enlaces
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

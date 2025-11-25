"use client";

import * as React from "react";

export interface CAAMNumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const CAAMNumberInput = React.forwardRef<
  HTMLInputElement,
  CAAMNumberInputProps
>(({ className = "", ...props }, ref) => {
  return (
    <input
      type="number"
      ref={ref}
      {...props}
      className={`
        w-full rounded-xl border border-[#FF8414]/40 bg-white
        px-3 py-3 text-base text-[#2b1b12]
        shadow-sm focus:border-[#FF8414] focus:ring-0
        placeholder:text-[#2b1b12]/40 transition
        ${className}
      `}
    />
  );
});

CAAMNumberInput.displayName = "CAAMNumberInput";

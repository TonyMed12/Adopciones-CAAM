"use client";

import * as React from "react";

export interface CAAMInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const CAAMInput = React.forwardRef<HTMLInputElement, CAAMInputProps>(
  ({ className = "", value, onChange, ...props }, ref) => {
    return (
      <input
        ref={ref}
        value={value ?? ""} // 🔥 evita undefined/null
        onChange={(e) => onChange?.(e)} // 🔥 RHF-friendly
        className={`
          w-full rounded-xl border border-[#FF8414]/40 bg-white
          px-3 py-3 text-base text-[#2b1b12]
          shadow-sm focus:border-[#FF8414] focus:ring-0
          placeholder:text-[#2b1b12]/40 transition
          ${className}
        `}
        {...props}
      />
    );
  }
);

CAAMInput.displayName = "CAAMInput";




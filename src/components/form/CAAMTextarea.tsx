"use client";

import * as React from "react";

export interface CAAMTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const CAAMTextarea = React.forwardRef<
  HTMLTextAreaElement,
  CAAMTextareaProps
>(({ className = "", ...props }, ref) => {
  return (
    <textarea
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

CAAMTextarea.displayName = "CAAMTextarea";

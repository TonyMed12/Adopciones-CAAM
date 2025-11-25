// CAAMColorSelectorWrapper.tsx
"use client";

import { SelectorColores } from "@/features/mascotas/components/client/SelectorColores";

interface WrapperProps {
  value: string[];
  onChange: (v: string[]) => void;
}

export function CAAMColorSelectorWrapper({ value, onChange }: WrapperProps) {
  return (
    <div className="rounded-xl border border-[#FF8414]/30 p-3 bg-white shadow-sm">
      <SelectorColores value={value} onChange={onChange} />
    </div>
  );
}

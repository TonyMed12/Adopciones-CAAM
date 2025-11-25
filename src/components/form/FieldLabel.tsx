// FieldLabel.tsx
"use client";

interface FieldLabelProps {
  children: React.ReactNode;
}

export function FieldLabel({ children }: FieldLabelProps) {
  return (
    <label className="block text-sm font-semibold text-[#5f2f13] mb-2">
      {children}
    </label>
  );
}

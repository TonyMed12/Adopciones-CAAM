// FormRow.tsx
"use client";

interface FormRowProps {
  children: React.ReactNode;
}

export function FormRow({ children }: FormRowProps) {
  return <div className="flex items-start gap-4 w-full">{children}</div>;
}

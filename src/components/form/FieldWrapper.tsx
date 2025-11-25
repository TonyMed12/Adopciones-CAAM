// FieldWrapper.tsx
"use client";

interface FieldWrapperProps {
  children: React.ReactNode;
  error?: string;
}

export function FieldWrapper({ children, error }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      {children}
      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}

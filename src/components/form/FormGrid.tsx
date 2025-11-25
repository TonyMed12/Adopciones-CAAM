// FormGrid.tsx
"use client";

interface FormGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

export function FormGrid({ children, cols = 2 }: FormGridProps) {
  const colClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[cols];

  return (
    <div className={`grid ${colClass} gap-4 w-full`}>
      {children}
    </div>
  );
}
